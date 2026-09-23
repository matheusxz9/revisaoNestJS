import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionarCentrosCusto1790192957878 implements MigrationInterface {
    name = 'AdicionarCentrosCusto1790192957878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "centros_custo" ("codigo" character varying(30) NOT NULL, "nome" character varying(100) NOT NULL, "saldo" numeric(12,2) NOT NULL DEFAULT 0, "versao" integer NOT NULL DEFAULT 1, CONSTRAINT "PK_centros_custo" PRIMARY KEY ("codigo"), CONSTRAINT "CHK_centros_custo_saldo" CHECK ("saldo" >= 0))`);
        await queryRunner.query(`INSERT INTO "centros_custo" ("codigo", "nome", "saldo") VALUES ('TI-DEV', 'Desenvolvimento de Sistemas', 5000), ('TI-INFRA', 'Infraestrutura de TI', 5000) ON CONFLICT DO NOTHING`);
        await queryRunner.query(`ALTER TABLE "solicitacoes" ADD "valor_estimado" numeric(12,2) NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "solicitacoes" ADD CONSTRAINT "CHK_solicitacoes_valor_estimado" CHECK ("valor_estimado" >= 0)`);
        await queryRunner.query(`ALTER TABLE "solicitacoes" ADD CONSTRAINT "FK_solicitacoes_centro_custo" FOREIGN KEY ("centro_custo") REFERENCES "centros_custo"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solicitacoes" DROP CONSTRAINT "FK_solicitacoes_centro_custo"`);
        await queryRunner.query(`ALTER TABLE "solicitacoes" DROP CONSTRAINT "CHK_solicitacoes_valor_estimado"`);
        await queryRunner.query(`ALTER TABLE "solicitacoes" DROP COLUMN "valor_estimado"`);
        await queryRunner.query(`DROP TABLE "centros_custo"`);
    }
}
