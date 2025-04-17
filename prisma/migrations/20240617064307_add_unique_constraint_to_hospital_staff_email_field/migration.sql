/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `HospitalStaff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HospitalStaff_email_key" ON "HospitalStaff"("email");
