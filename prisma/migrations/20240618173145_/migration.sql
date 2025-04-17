/*
  Warnings:

  - You are about to drop the column `parent_id` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_parent_id_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "parent_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
