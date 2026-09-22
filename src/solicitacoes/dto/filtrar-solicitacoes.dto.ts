import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type {
  PrioridadeSolicitacao,
  StatusSolicitacao,
} from '../solicitacao.entity';

export class FiltrarSolicitacoesDto {
  @IsOptional()
  @IsIn(['pendente', 'aprovada'])
  status?: StatusSolicitacao;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  centroCusto?: string;

  @IsOptional()
  @IsIn(['normal', 'urgente'])
  prioridade?: PrioridadeSolicitacao;
}