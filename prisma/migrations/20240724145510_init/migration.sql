/*
  Warnings:

  - The `dateUsed` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "dateUsed",
ADD COLUMN     "dateUsed" TIMESTAMP(3)[],
ALTER COLUMN "totalUsed" SET DEFAULT 0;
