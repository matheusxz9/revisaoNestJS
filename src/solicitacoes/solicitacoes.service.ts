import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Solicitacao } from './solicitacao.entity';
import { CriarSolicitacaoDto } from './dto/criar-solicitacao.dto';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltrarSolicitacoesDto } from './dto/filtrar-solicitacoes.dto';
import { DataSource } from 'typeorm';
import { Auditoria } from '../auditoria/auditoria.entity';
import { CentroCusto } from '../centros-custo/centro-custo.entity';
import { AprovarSolicitacaoDto } from './dto/aprovar-solicitacao.dto';

@Injectable()
export class SolicitacoesService {
  constructor(
    @InjectRepository(Solicitacao)
    private readonly repository: Repository<Solicitacao>,
    private readonly dataSource: DataSource,
  ) { }

  listar(filtros: FiltrarSolicitacoesDto) {
    const where: FindOptionsWhere<Solicitacao> = {};

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.centroCusto) {
      where.centroCusto = filtros.centroCusto;
    }

    if (filtros.prioridade) {
      where.prioridade = filtros.prioridade;
    }

    return this.repository.find({
      where,
      order: { id: 'ASC' },
    });
  }

  async buscarPorId(id: number) {
    const solicitacao = await this.repository.findOneBy({ id });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return solicitacao;
  }

  criar(dto: CriarSolicitacaoDto) {
    const solicitacao = this.repository.create({
      titulo: dto.titulo,
      centroCusto: dto.centroCusto,
      prioridade: dto.prioridade,
      valorEstimado: String(dto.valorEstimado),
      status: 'pendente',
    });
    return this.repository.save(solicitacao);
  }

  async aprovar(id: number, dto: AprovarSolicitacaoDto, atorId: number) {
    return this.dataSource.transaction(async (manager) => {
      const solicitacao = await manager.findOneBy(Solicitacao, { id });

      if(!solicitacao) {
        throw new NotFoundException("Solicitação não encontrada");
      }

      if(solicitacao.status !== 'pendente') {
        throw new ConflictException("Solicitação não está pendente");
      }

      if(solicitacao.versao !== dto.versao) {
        throw new ConflictException(
          'Versão da solicitação desatualizada; consulte novamente',
        );
      }

      const centro = await manager.findOneBy(CentroCusto, {
        codigo: solicitacao.centroCusto,
      });

      if(!centro) {
        throw new NotFoundException("Centro de custo não encontrado");
      }

      if(centro.versao !== dto.versaoCentroCusto) {
        throw new ConflictException(
          'Versão do centro de custo desatualizada; consulte novamente',
        );
      }

      const saldoAnterior = centro.saldo;

      const desconto = await manager
      .createQueryBuilder()
      .update(CentroCusto)
      .set({ saldo: () => 'saldo - :valor', versao: () => 'versao + 1'})
      .where('codigo = :codigo', { codigo: centro.codigo })
      .andWhere('versao = :versao', { versao: dto.versaoCentroCusto })
      .andWhere('saldo >= :valor', { valor: solicitacao.valorEstimado })
      .execute();

      if(desconto.affected !== 1) {
        throw new ConflictException('Saldo insuficiente no centro de custo');
      }

      const resultado = await manager
      .createQueryBuilder()
      .update(Solicitacao)
      .set({ status: 'aprovada', versao: () => 'versao + 1'})
      .where('id = :id', { id })
      .andWhere('versao = :versao', { versao: dto.versao })
      .andWhere('status = :status', { status: 'pendente' })
      .execute();

      if(resultado.affected !== 1) {
        throw new ConflictException(
          'A solicitação foi alterada; consulte novamente',
        );
      }

      const centroDepois = await manager.findOneByOrFail(CentroCusto, {
        codigo: centro.codigo,
      });

      await manager.insert(Auditoria, {
        atorId,
        acao: 'SOLICITACAO_APROVADA',
        recursoTipo: 'solicitacao',
        recursoId: id,
        detalhes: {
          centroCusto: centro.codigo,
          valorReservado: solicitacao.valorEstimado,
          saldoAnterior,
          saldoResultante: centroDepois.saldo,
          versaoSolicitacao: dto.versao,
          versaoCentroCusto: dto.versaoCentroCusto,
        },
      });

      return {
        solicitacao: await manager.findOneByOrFail(Solicitacao, { id }),
        centroCusto: centroDepois,
      };
    })
  }
}
