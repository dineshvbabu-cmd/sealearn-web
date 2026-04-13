-- CreateTable
CREATE TABLE "CoursePackage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "badgeText" TEXT NOT NULL DEFAULT 'Bundle Offer',
    "badgeColor" TEXT NOT NULL DEFAULT 'bg-teal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePackageCourse" (
    "packageId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CoursePackageCourse_pkey" PRIMARY KEY ("packageId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoursePackage_slug_key" ON "CoursePackage"("slug");

-- AddForeignKey
ALTER TABLE "CoursePackageCourse" ADD CONSTRAINT "CoursePackageCourse_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "CoursePackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePackageCourse" ADD CONSTRAINT "CoursePackageCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
