/*
  Warnings:

  - You are about to drop the `Nota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Nota" DROP CONSTRAINT "Nota_cursoId_fkey";

-- DropTable
DROP TABLE "Nota";

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "notaMaxima" DOUBLE PRECISION NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
