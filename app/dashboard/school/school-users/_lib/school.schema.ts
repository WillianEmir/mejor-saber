import { Role } from "@/src/generated/prisma";

export type UserSchoolType = {
  id: string;
  email: string;
  name: string;
  lastName: string | null;
  role: Role;
  idDocument: string | null;
  degree: string | null;
  schoolId: string | null;
  schoolSedeId: string | null;
};

export type UserSchoolModalType = UserSchoolType & {
  gradeNumber: string;
  gradeLetter: string;
};