import 'dotenv/config';
import dataSource from '../data-source';
import { Solicitacao } from '../../solicitacoes/solicitacao.entity';
import { CentroCusto } from '../../centros-custo/centro-custo.entity';

const centro = {
  codigo: 'TI-DEV',
  nome: 'Desenvolvimento de Sistemas',
  saldo: '5000.00',
};

const dados = [
  {
    titulo: 'Aquisição de monitor',
    centroCusto: 'TI-DEV',
    prioridade: 'normal' as const,
    valorEstimado: '1200.00',
  },
  {
    titulo: 'Substituição de Servidor',
    centroCusto: 'TI-DEV',
    prioridade: 'urgente' as const,
    valorEstimado: '8000.00',
  },
];

async function executar() {
  await dataSource.initialize();

  const centrosRepository = dataSource.getRepository(CentroCusto);
  const existente = await centrosRepository.findOneBy({ codigo: centro.codigo });

  if(!existente) {
    await centrosRepository.save(centrosRepository.create(centro));
  }

  const repository = dataSource.getRepository(Solicitacao);

  for(const item of dados) {
    const solicitacaoExistente = await repository.findOneBy({ titulo: item.titulo });

    if(!solicitacaoExistente) {
      await repository.save(
        repository.create({
          ...item,
          status: 'pendente',
        }),
      );
    }
  }

  await dataSource.destroy();
}

executar().catch(async (error) => {
  console.error(error);

  if(dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exitCode = 1;
});
