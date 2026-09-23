import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CentroCusto } from './centro-custo.entity';
import { CentrosCustoController } from './centros-custo.controller';
import { CentrosCustoService } from './centros-custo.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CentroCusto])],
  controllers: [CentrosCustoController],
  providers: [CentrosCustoService],
  exports: [CentrosCustoService],
})
export class CentrosCustoModule {}
