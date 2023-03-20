import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Student } from "../../models/Student";
import { Unit } from "../../models/Unit";
import Button from "../../components/Button";
import { RUser } from "../../models/RUser";
import { AttendanceModel, Attendee } from "../../models/Attendance";

export default function AttendanceForm(props: {
  onCloseModal: (e: any) => void;
  onMarkAttendance: (attendance: AttendanceModel) => void;
}) {
  const [formLoading, setFormLoading] = useState(false);
  const [studentListLoading, setStudentLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [allStudents, setAllStudents] = useState<RUser[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      unitId: "",
      room: "",
    },
  });

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  useEffect(() => {
    const unitsSnap = getDocs(collection(db, "units"));
    unitsSnap.then((res) => {
      const units = res.docs.map((doc) => doc.data());
      setUnits(units);
    });
    const studentsSnap = getDocs(collection(db, "users"));
    studentsSnap.then((res) => {
      const students = res.docs
        .map((doc) => doc.data())
        .filter((user) => user.role === "student");
      setAllStudents(students);
    });
  }, []);

  const onUnitChanged = (unitId: string) => {
    setStudentLoading(true);
    const registeredStudents: Attendee[] = allStudents
      .filter((student) => student.units?.some((unit) => unit.id === unitId))
      .map((student) => ({
        attended: false,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        uid: student.uid,
        regNo: student.regNo,
      }));
    setAttendees(registeredStudents);
    setStudentLoading(false);
  };

  const toggleStudent = (itemIndex: number) => {
    attendees[itemIndex].attended = !attendees[itemIndex].attended;
    setAttendees([...attendees]);
  };

  const selectAll = () => {
    const modifiedList = [...attendees];
    modifiedList.forEach((unit) => (unit.attended = true));
    setAttendees(modifiedList);
  };

  const deselectAll = () => {
    const modifiedList = [...attendees];
    modifiedList.forEach((unit) => (unit.attended = false));
    setAttendees(modifiedList);
  };

  const onSubmit: SubmitHandler<{
    room: string;
    unitId: string;
  }> = (data) => {
    setFormLoading(true);
    const id = uuid();
    const selectedUnit = units.find((unit) => unit.id === data.unitId) as Unit;
    const newAttendance: AttendanceModel = {
      id,
      attendees,
      room: data.room,
      unitId: selectedUnit?.id,
      unitName: selectedUnit.name,
      lecturerId: profile.uid,
      lecturerName: `${profile.firstName} ${profile.lastName}`,
      timestamp: Date.now(),
      unitTime: Date.now(),
    };
    setDoc(doc(db, "attendances", id), newAttendance).then((_) => {
      setFormLoading(false);
      props.onMarkAttendance(newAttendance);
      props.onCloseModal(null);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 pt-6"
    >
      <div>
        <label
          htmlFor="unitId"
          className="block text-sm font-medium text-gray-700"
        >
          Unit
        </label>
        <div className="mt-1">
          <select
            {...register("unitId", { required: true })}
            onChange={(event) => onUnitChanged(event.target.value)}
            id="unitId"
            name="unitId"
            autoComplete="unitId"
            required
          >
            <option value="" disabled>
              Select unit
            </option>
            {units.map((unit) => (
              <option value={unit.id}>{unit.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="room"
          className="block text-sm font-medium text-gray-700"
        >
          Room
        </label>
        <div className="mt-1">
          <select
            {...register("room", { required: true })}
            id="room"
            name="room"
            autoComplete="room"
            required
          >
            <option value="" disabled>
              Select room
            </option>
            <option value="New Tech Building 104">New Tech Building 104</option>
            <option value="New Tech Building 105">New Tech Building 105</option>
            <option value="BBIT Lab">BBIT Lab</option>
            <option value="Room 2.1">Room 2.1</option>
          </select>
        </div>
      </div>

      {attendees.length > 0 && (
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row space-x-4 items-center justify-between">
            <p className="block text-sm font-medium text-gray-700">
              Select attendees
            </p>

            {attendees.every((student) => student.attended) && (
              <button
                onClick={(_) => deselectAll()}
                type="button"
                className="text-xs font-semibold text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Deselect All
              </button>
            )}

            {!attendees.every((student) => student.attended) && (
              <button
                onClick={(_) => selectAll()}
                type="button"
                className="text-xs font-semibold text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Select All
              </button>
            )}
          </div>

          {attendees.map((student, studentIndex) => (
            <label
              htmlFor={student.uid}
              key={student.uid}
              className={`flex flex-row space-x-4 items-center w-full p-2 rounded-md  ${
                student.attended
                  ? "bg-purple-50 hover:bg-purple-100"
                  : "bg-none hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0 flex flex-row space-x-4 items-center">
                <input
                  id={student.uid}
                  checked={student.attended}
                  onChange={(_) => toggleStudent(studentIndex)}
                  type="checkbox"
                />
                <p className="font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <p>{student.regNo}</p>
            </label>
          ))}
        </div>
      )}

      {!attendees.length && (
        <div className="p-6 bg-amber-50 text-amber-600 text-sm font-medium rounded-lg">
          <p>There no registered students for that unit. Pick another unit</p>
        </div>
      )}

      <div className="pt-6">
        <Button
          disabled={!isValid}
          isLoading={formLoading}
          cta="Save"
          color="primary"
        ></Button>
      </div>
    </form>
  );
}
