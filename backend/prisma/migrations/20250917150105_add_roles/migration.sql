-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "roleId" TEXT NOT NULL DEFAULT '2';

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "rolename" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_rolename_key" ON "public"."Role"("rolename");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
