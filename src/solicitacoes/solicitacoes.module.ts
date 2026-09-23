import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { Solicitacao } from './solicitacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from '../auditoria/auditoria.entity';
import { CentroCusto } from '../centros-custo/centro-custo.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Solicitacao, Auditoria, CentroCusto]),
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {}
