-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_incubator_id_fkey";

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "incubator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_incubator_id_fkey" FOREIGN KEY ("incubator_id") REFERENCES "Incubator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
