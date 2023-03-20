export type AttendanceModel = {
  id: string;
  lecturerId: string;
  lecturerName: string;
  room: string;
  timestamp: number;
  unitId: string;
  unitName: string;
  unitTime: number;
  attendees: Attendee[];
  status?: "missed" | "attended";
};

export type Attendee = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  regNo: string;
  attended: boolean;
};
