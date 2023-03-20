import { Unit } from "./Unit";

export type RUser = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  regNo: string;
  role: "student" | "lecturer";
  units?: Unit[];
};
