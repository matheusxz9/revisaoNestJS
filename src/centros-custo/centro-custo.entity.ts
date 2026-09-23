import {
  Column,
  Entity,
  PrimaryColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'centros_custo' })
export class CentroCusto {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  saldo: string;

  @VersionColumn({ name: 'versao' })
  versao: number;
}
