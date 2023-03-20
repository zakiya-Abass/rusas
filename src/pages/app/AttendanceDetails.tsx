import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BuildingOfficeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AttendanceModel } from "../../models/Attendance";
import { RUser } from "../../models/RUser";

export default function AttendanceDetails() {
  const [isLecturer, setIsLecturer] = useState(false);
  const [currentAttendance, setCurrentAttendance] =
    useState<AttendanceModel | null>(null);
  const { id } = useParams();

  const navigate = useNavigate();

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  useEffect(() => {
    setIsLecturer(profile.role === "lecturer");
    const currentAttSnap = getDoc(doc(db, `attendances/${id}`));
    currentAttSnap.then((res) => {
      console.log(res.data());
      setCurrentAttendance(res.data());
    });
  }, []);

  const onDelete = () => {
    deleteDoc(doc(db, `attendances/${id}`)).then((_) => {
      navigate("../attendance");
    });
  };

  return (
    <>
      <main className="container py-12 px-6">
        <div className="py-6">
          <div className="flex flex-col space-y-4 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="flex flex-row space-x-4 items-start justify-between">
              <div>
                <h1>{currentAttendance?.unitName}</h1>
                <p className="text-sm font-medium text-gray-500">
                  <Link to="../attendance">
                    <span className="hover:underline">List</span>
                  </Link>{" "}
                  / Details
                </p>
              </div>
              <button
                onClick={(_) => onDelete()}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-gray-100 rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            </div>

            <div className="flex flex-row space-x-4">
              <div className="flex flex-row space-x-4 items-center px-4 py-1 border border-gray-500 text-gray-500 text-sm font-medium rounded-full">
                <BuildingOfficeIcon className="h-6 w-6" />
                <span>{currentAttendance?.room}</span>
              </div>

              <div className="flex flex-row space-x-4 items-center px-4 py-1 border border-gray-500 text-gray-500 text-sm font-medium rounded-full">
                <ClockIcon className="h-6 w-6" />
                <span>{`${new Date(
                  currentAttendance?.unitTime
                ).toLocaleString()}`}</span>
              </div>
            </div>

            {currentAttendance && (
              <div className="flex flex-col space-y-4 pt-4 border-t-2 border-dashed border-gray-300">
                <span className="text-gray-600 font-medium">
                  Attendees: {currentAttendance.attendees.length}
                </span>

                {currentAttendance.attendees.map((student) => (
                  <div className="grid grid-cols-3 gap-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col space-y-2">
                      <span className="font-semibold">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {student.email}
                      </span>
                    </div>

                    <div className="flex items-center w-full">
                      <span>{student.regNo}</span>
                    </div>

                    <div className="flex items-center w-full">
                      <span
                        className={`w-auto px-4 py-2 text-xs rounded-full  font-semibold uppercase tracking-wider ${
                          student.attended
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {student.attended ? "ATTENDED" : "MISSED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
