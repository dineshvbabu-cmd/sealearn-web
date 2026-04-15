-- CreateEnum
CREATE TYPE "RegistrationFormType" AS ENUM ('GOOGLE_FORM', 'MS_FORM');

-- CreateEnum
CREATE TYPE "PriceRequestStatus" AS ENUM ('NEW', 'REPLIED', 'CLOSED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'LMS_ADMIN';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "registrationFormType" "RegistrationFormType" NOT NULL DEFAULT 'MS_FORM',
ADD COLUMN     "registrationFormUrl" TEXT,
ALTER COLUMN "feeNaira" SET DEFAULT 0,
ALTER COLUMN "applicationFee" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Enrolment" ADD COLUMN     "lmsActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lmsRevokedAt" TIMESTAMP(3),
ADD COLUMN     "stepLmsUrl" TEXT;

-- CreateTable
CREATE TABLE "PriceRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "courseId" TEXT,
    "message" TEXT,
    "status" "PriceRequestStatus" NOT NULL DEFAULT 'NEW',
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceRequest_email_idx" ON "PriceRequest"("email");

-- CreateIndex
CREATE INDEX "PriceRequest_status_idx" ON "PriceRequest"("status");

-- CreateIndex
CREATE INDEX "PriceRequest_createdAt_idx" ON "PriceRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "PriceRequest" ADD CONSTRAINT "PriceRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
