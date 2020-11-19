import {MigrationInterface, QueryRunner} from "typeorm";

export class init1605817518172 implements MigrationInterface {
    name = 'init1605817518172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userId" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "team" ("teamId" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cf461f5b40cf1a2b8876011e1e1" UNIQUE ("name"), CONSTRAINT "PK_e3c1e347fd4f0813cc7b2e2115b" PRIMARY KEY ("teamId"))`);
        await queryRunner.query(`CREATE TABLE "match" ("matchId" SERIAL NOT NULL, "teamId" integer NOT NULL, "scheduledTime" integer NOT NULL, "startTime" integer, "halfTime" integer, "fullTime" integer, "opponentTeamName" character varying NOT NULL, "isHomeTeam" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7dd6d1fec38b24c30d6907d51e2" PRIMARY KEY ("matchId"))`);
        await queryRunner.query(`CREATE TABLE "player" ("playerId" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "jerseyNum" integer NOT NULL, "archived" boolean NOT NULL DEFAULT false, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "teamIdTeamId" integer, CONSTRAINT "PK_ee365af3f201a00d9a917bc45b0" PRIMARY KEY ("playerId"))`);
        await queryRunner.query(`CREATE TABLE "assist" ("id" SERIAL NOT NULL, "time" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "matchIdMatchId" integer, "playerIdPlayerId" integer, CONSTRAINT "PK_04ad848b6aa296193cd1582ddbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal" ("id" SERIAL NOT NULL, "time" integer NOT NULL, "playerId" integer, "matchId" integer NOT NULL, "lineup" integer array NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "possession" ("id" SERIAL NOT NULL, "matchId" integer NOT NULL, "time" integer NOT NULL, "playerId" integer, "neutral" boolean NOT NULL, "archived" boolean NOT NULL DEFAULT false, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3055666ee38f35a46d4c6444bd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bb88ac48f9b939b0124fed875d" ON "possession" ("matchId", "playerId", "neutral") `);
        await queryRunner.query(`CREATE TABLE "shot" ("id" SERIAL NOT NULL, "matchId" integer NOT NULL, "time" integer NOT NULL, "playerId" integer, "onTarget" boolean NOT NULL, "archived" boolean NOT NULL DEFAULT false, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_270d8a54e9ae132b9368e0d93a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "substitution" ("Id" SERIAL NOT NULL, "playerId" integer NOT NULL, "matchId" integer NOT NULL, "timeOn" integer NOT NULL, "timeOff" integer, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7aa8f19045dad29682e29da738a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "lineup" ("lineupId" SERIAL NOT NULL, "lineup" integer array NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "matchIdMatchId" integer, CONSTRAINT "PK_8b679a23b8c65fd46efce3a9c1c" PRIMARY KEY ("lineupId"))`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_f2d690b3cd42934a851294a40e3" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_e45eb731844867ec7a0a5ccfd8d" FOREIGN KEY ("teamIdTeamId") REFERENCES "team"("teamId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assist" ADD CONSTRAINT "FK_8c7492716bf5b67f742ecee1cc4" FOREIGN KEY ("matchIdMatchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assist" ADD CONSTRAINT "FK_b441ea0e81b2e030d66a665978c" FOREIGN KEY ("playerIdPlayerId") REFERENCES "player"("playerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_4940c009d3004c7a048f76fb9a3" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_285e792996a88665a0049ddf095" FOREIGN KEY ("playerId") REFERENCES "player"("playerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "possession" ADD CONSTRAINT "FK_c6405dcd6dcbf4d62b845b3b10c" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "possession" ADD CONSTRAINT "FK_8c59c97b0425a70078b6ceae3df" FOREIGN KEY ("playerId") REFERENCES "player"("playerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shot" ADD CONSTRAINT "FK_1774bbe7710012df60e0684bf59" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shot" ADD CONSTRAINT "FK_6390573e6f0dcff12b44a2f12d9" FOREIGN KEY ("playerId") REFERENCES "player"("playerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "substitution" ADD CONSTRAINT "FK_6c292fb97de2d50e3a1f08150fb" FOREIGN KEY ("playerId") REFERENCES "player"("playerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "substitution" ADD CONSTRAINT "FK_70760508438655c713e35174982" FOREIGN KEY ("matchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lineup" ADD CONSTRAINT "FK_3fd7d0540bc00d1cbe148c9ef4c" FOREIGN KEY ("matchIdMatchId") REFERENCES "match"("matchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lineup" DROP CONSTRAINT "FK_3fd7d0540bc00d1cbe148c9ef4c"`);
        await queryRunner.query(`ALTER TABLE "substitution" DROP CONSTRAINT "FK_70760508438655c713e35174982"`);
        await queryRunner.query(`ALTER TABLE "substitution" DROP CONSTRAINT "FK_6c292fb97de2d50e3a1f08150fb"`);
        await queryRunner.query(`ALTER TABLE "shot" DROP CONSTRAINT "FK_6390573e6f0dcff12b44a2f12d9"`);
        await queryRunner.query(`ALTER TABLE "shot" DROP CONSTRAINT "FK_1774bbe7710012df60e0684bf59"`);
        await queryRunner.query(`ALTER TABLE "possession" DROP CONSTRAINT "FK_8c59c97b0425a70078b6ceae3df"`);
        await queryRunner.query(`ALTER TABLE "possession" DROP CONSTRAINT "FK_c6405dcd6dcbf4d62b845b3b10c"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_285e792996a88665a0049ddf095"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_4940c009d3004c7a048f76fb9a3"`);
        await queryRunner.query(`ALTER TABLE "assist" DROP CONSTRAINT "FK_b441ea0e81b2e030d66a665978c"`);
        await queryRunner.query(`ALTER TABLE "assist" DROP CONSTRAINT "FK_8c7492716bf5b67f742ecee1cc4"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_e45eb731844867ec7a0a5ccfd8d"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_f2d690b3cd42934a851294a40e3"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e"`);
        await queryRunner.query(`DROP TABLE "lineup"`);
        await queryRunner.query(`DROP TABLE "substitution"`);
        await queryRunner.query(`DROP TABLE "shot"`);
        await queryRunner.query(`DROP INDEX "IDX_bb88ac48f9b939b0124fed875d"`);
        await queryRunner.query(`DROP TABLE "possession"`);
        await queryRunner.query(`DROP TABLE "goal"`);
        await queryRunner.query(`DROP TABLE "assist"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
