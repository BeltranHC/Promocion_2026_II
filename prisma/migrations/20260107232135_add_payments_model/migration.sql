/*
  Warnings:

  - You are about to drop the column `collected` on the `FundSettings` table. All the data in the column will be lost.
  - You are about to drop the column `contributingMembers` on the `FundSettings` table. All the data in the column will be lost.
  - You are about to drop the `Contributor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "FundSettings" DROP COLUMN "collected",
DROP COLUMN "contributingMembers",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Contributor";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "weekNumber" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_studentId_idx" ON "Payment"("studentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
