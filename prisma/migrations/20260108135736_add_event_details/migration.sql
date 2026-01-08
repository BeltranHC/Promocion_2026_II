-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "fullDescription" TEXT,
ADD COLUMN     "hasTickets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maxTickets" INTEGER,
ADD COLUMN     "schedule" TEXT,
ADD COLUMN     "ticketPrice" DOUBLE PRECISION,
ADD COLUMN     "time" TEXT;

-- CreateTable
CREATE TABLE "EventImage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventImage_eventId_idx" ON "EventImage"("eventId");

-- AddForeignKey
ALTER TABLE "EventImage" ADD CONSTRAINT "EventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
