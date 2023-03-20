import { TrashIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import CenterDialog from "../../components/CenterDialog";
import { db } from "../../firebase";
import { AttendanceModel } from "../../models/Attendance";
import { RUser } from "../../models/RUser";
import AttendanceForm from "./AttendanceForm";

export default function ListAttendance() {
  const [attendances, setAttendances] = useState<AttendanceModel[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLecturer, setIsLecturer] = useState(false);

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  const navigate = useNavigate();

  useEffect(() => {
    setIsLecturer(profile?.role === "lecturer");
    const attendancesSnap = getDocs(collection(db, "attendances"));
    attendancesSnap.then((res) => {
      const list = res.docs.map((doc) => doc.data()) as AttendanceModel[];
      if (profile.role === "student") {
        const studentAttendances = list.filter((att) =>
          att.attendees.some((student) => student.uid === profile.uid)
        );
        studentAttendances.forEach((att, index) => {
          const studentAttendee = att.attendees.find(
            (student) => student.uid === profile.uid
          );
          let status = "missed";
          if (studentAttendee) {
            status = studentAttendee.attended ? "attended" : "missed";
            att.status = status;
          }
        });
        setAttendances(studentAttendances);
      } else {
        const markedAttendances = list.filter(
          (att) => att.lecturerId === profile.uid
        );
        setAttendances(markedAttendances);
      }
    });
  }, []);

  return (
    <main className="container py-12 px-6">
      <div className="py-6">
        <div className="flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-row space-x-4 items-start justify-between">
            <h1>Attendance</h1>
            <div className="w-44">
              {isLecturer && (
                <Button
                  disabled={false}
                  isLoading={false}
                  onClick={(_) => setIsOpen(true)}
                  type="button"
                  cta="Mark Attendance"
                  color=""
                ></Button>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            {attendances.length <= 0 && (
              <div className="p-6 text-center text-amber-600 font-medium bg-amber-50 rounded-lg">
                <p>
                  We couldn't find any recorded attendances for this account
                </p>
              </div>
            )}

            {attendances.length > 0 && (
              <div className="grid grid-cols-4 px-4 font-medium">
                <p>Unit</p>
                <p>Date</p>
                <p>Room</p>
                <p>{isLecturer ? "Action" : "Status"}</p>
              </div>
            )}

            {attendances.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 p-4 rounded-lg bg-gray-50 hover:ring-1 hover:ring-gray-300"
              >
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold text-black">
                    {item.unitName}
                  </span>
                  {!isLecturer && (
                    <span className="text-xs text-gray-500">
                      by {item.lecturerName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <h3>{new Date(item.unitTime).toDateString()}</h3>
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(item.unitTime).toTimeString()}
                  </span>
                </div>

                <div>
                  <p>{item.room}</p>
                </div>

                <div className="flex items-center w-full">
                  {isLecturer && (
                    <div className="flex flex-row space-x-2">
                      {/* <button className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600">
                        <TrashIcon className="w-5 h-5"></TrashIcon>
                      </button> */}

                      <button
                        onClick={(_) => navigate(`./${item.id}`)}
                        className="p-2 rounded-lg hover:bg-purple-100 hover:text-purple-800"
                      >
                        <ChevronRightIcon className="w-5 h-5"></ChevronRightIcon>
                      </button>
                    </div>
                  )}

                  {!isLecturer && (
                    <div
                      className={`w-auto px-4 py-2 text-xs rounded-full  font-semibold uppercase tracking-wider ${
                        item.status === "missed"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <CenterDialog
            isOpen={isOpen}
            onClose={(_) => setIsOpen(false)}
            dialogTitle="Mark Attendance"
            component={
              <AttendanceForm
                onCloseModal={(_) => setIsOpen(false)}
                onMarkAttendance={(newAttendance) =>
                  setAttendances([...attendances, newAttendance])
                }
              ></AttendanceForm>
            }
          ></CenterDialog>
        </div>
      </div>
    </main>
  );
}
