import { IsIn, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import type { PrioridadeSolicitacao } from '../solicitacao.entity';

export class CriarSolicitacaoDto {
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  titulo: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  centroCusto: string;

  @IsIn(['normal', 'urgente'])
  prioridade: PrioridadeSolicitacao;

  @IsNumber()
  @Min(0)
  valorEstimado: number;
}