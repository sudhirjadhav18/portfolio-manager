/*
  Warnings:

  - You are about to drop the column `code` on the `Stock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symbol` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Stock_code_key";

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "code",
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "public"."Stock"("symbol");
