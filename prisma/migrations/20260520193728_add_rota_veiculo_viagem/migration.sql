-- AlterTable
ALTER TABLE "Supervisor" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Rota" (
    "id" SERIAL NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "distancia" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Rota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "quilometragem" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Viagem" (
    "id" SERIAL NOT NULL,
    "status_viagem" TEXT NOT NULL,
    "token_finalizacao" TEXT NOT NULL,
    "dataSaida" TIMESTAMP(3) NOT NULL,
    "dataChegada" TIMESTAMP(3) NOT NULL,
    "motorista_id" INTEGER NOT NULL,
    "supervisor_id" INTEGER NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "rota_id" INTEGER NOT NULL,

    CONSTRAINT "Viagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Viagem" ADD CONSTRAINT "Viagem_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viagem" ADD CONSTRAINT "Viagem_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Supervisor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viagem" ADD CONSTRAINT "Viagem_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viagem" ADD CONSTRAINT "Viagem_rota_id_fkey" FOREIGN KEY ("rota_id") REFERENCES "Rota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
