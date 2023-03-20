import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SummaryCard from "../../components/SummaryCard";
import { db } from "../../firebase";
import { AttendanceModel } from "../../models/Attendance";
import { RUser } from "../../models/RUser";

export default function Overview() {
  const [isLecturer, setIsLecturer] = useState(false);
  const [noOfUnits, setNoOfUnits] = useState(0);
  const [attendancePct, setAttendancePct] = useState(0);
  const [recordedAtt, setRecordedAtt] = useState(0);

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  useEffect(() => {
    setIsLecturer(profile?.role === "lecturer");
    const allUnitsSnap = getDocs(collection(db, "units"));
    const studentsUnitsSnap = getDoc(doc(db, "users", profile.uid));

    if (profile.role === "lecturer") {
      allUnitsSnap.then((res) => {
        const units = res.docs.map((doc) => doc.data());
        if (units.length) {
          setNoOfUnits(units.length);
        } else {
          setNoOfUnits(0);
        }
      });
    } else {
      studentsUnitsSnap.then((res) => {
        const units = res.data().units;
        if (units.length) {
          setNoOfUnits(units.length);
        } else {
          setNoOfUnits(0);
        }
      });
    }

    const attendancesSnap = getDocs(collection(db, "attendances"));
    attendancesSnap.then((res) => {
      const list = res.docs.map((doc) => doc.data()) as AttendanceModel[];
      if (profile.role === "student") {
        const studentAttendances =
          list.filter((att) =>
            att.attendees.some((student) => student.uid === profile.uid)
          ) || 0;
        const attended =
          studentAttendances.filter((att) =>
            att.attendees.some((student) => student.attended)
          ).length || 0;
        const totalRecorded = studentAttendances.length;
        const avgPct = Math.round((attended * 100) / totalRecorded) || 0;
        setAttendancePct(avgPct);
        setRecordedAtt(totalRecorded);
      } else {
        const markedAttendances = list.filter(
          (att) => att.lecturerId === profile.uid
        );
        const allAttendancePcts: number[] = [];
        markedAttendances.forEach((att) => {
          const totalAttendees = att.attendees.length;
          const noOfAttendedStudents = att.attendees.filter(
            (student) => student.attended
          ).length;
          const pct = (noOfAttendedStudents * 100) / totalAttendees;
          allAttendancePcts.push(pct);
        });
        const avgPct =
          allAttendancePcts.reduce((a, b) => a + b) / allAttendancePcts.length;
        setAttendancePct(Math.round(avgPct));
        setRecordedAtt(markedAttendances.length);
      }
    });
  }, []);

  return (
    <>
      <main className="container py-12 px-6">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1>{isLecturer ? `Lecturer's` : `Student's`} Overview</h1>
          </div>
          <div className="mx-auto max-w-7xl px-4 mt-8 sm:px-6 md:px-8">
            <div className="flex flex-col space-y-8">
              <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-8">
                <SummaryCard
                  color="light"
                  heading="Overall Attendance"
                  description={
                    recordedAtt > 0
                      ? `Out of ${recordedAtt} recorded attendances`
                      : ""
                  }
                  value={attendancePct.toString() + "%"}
                  trend={attendancePct >= 50 ? "up" : "down"}
                />
                <SummaryCard
                  color="dark"
                  heading="Total registered units"
                  value={noOfUnits.toString()}
                  trend="up"
                />
                {profile.role === "lecturer" && (
                  <SummaryCard
                    color="light"
                    heading="Total classes taught"
                    value={recordedAtt.toString()}
                    trend="up"
                  />
                )}
                {profile.role === "student" && (
                  <SummaryCard
                    color="light"
                    heading="Total classes attended"
                    value={recordedAtt.toString()}
                    trend="up"
                  />
                )}
              </div>

              <div className="h-96 rounded-lg border-4 border-dashed border-gray-200"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
