import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { Solicitacao } from './solicitacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from '../auditoria/auditoria.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Solicitacao, Auditoria]),
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {}
