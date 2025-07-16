/*
  Warnings:

  - A unique constraint covering the columns `[nit]` on the table `providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "providers_nit_key" ON "providers"("nit");
