-- DropForeignKey
ALTER TABLE "public"."Material" DROP CONSTRAINT "Material_courseId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Material" ADD CONSTRAINT "Material_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
