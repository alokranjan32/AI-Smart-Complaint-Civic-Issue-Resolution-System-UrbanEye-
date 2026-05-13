-- AlterTable
ALTER TABLE "User"
ADD COLUMN "xHandle" TEXT NOT NULL DEFAULT '',
ADD COLUMN "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "alertLatitude" DOUBLE PRECISION,
ADD COLUMN "alertLongitude" DOUBLE PRECISION,
ADD COLUMN "alertRadiusKm" DOUBLE PRECISION NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "Complaint"
ADD COLUMN "assignedTo" TEXT NOT NULL DEFAULT '',
ADD COLUMN "adminNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateEnum
CREATE TYPE "HistoryType" AS ENUM ('CREATED', 'ASSIGNED', 'STATUS_UPDATED', 'NOTE', 'RESOLVED');

-- CreateTable
CREATE TABLE "ComplaintHistory" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "type" "HistoryType" NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" "Role" NOT NULL,
    "message" TEXT NOT NULL,
    "fromStatus" "Status",
    "toStatus" "Status",
    "department" TEXT NOT NULL DEFAULT '',
    "assignedTo" TEXT NOT NULL DEFAULT '',
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComplaintHistory" ADD CONSTRAINT "ComplaintHistory_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
