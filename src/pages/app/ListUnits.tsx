import { TrashIcon } from "@heroicons/react/24/outline";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

import Button from "../../components/Button";
import CenterDialog from "../../components/CenterDialog";
import { RUser } from "../../models/RUser";
import { Unit } from "../../models/Unit";
import AddUnitForm from "./AddUnitForm";
import RegisterUnitsForm from "./RegisterUnitsForm";

export default function ListUnits() {
  const [units, setUnits] = useState<Unit[]>([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLecturer, setIsLecturer] = useState(false);

  const navigate = useNavigate();

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  const onDelete = (id: string) => {
    deleteDoc(doc(db, `units/${id}`)).then((_) => {
      const remainingUnits = units.filter((item) => item.id !== id);
      setUnits(remainingUnits);
      console.log("Item deleted ::", id);
    });
  };

  useEffect(() => {
    setIsLecturer(profile.role === "lecturer");
    const allUnitsSnap = getDocs(collection(db, "units"));
    const studentsUnitsSnap = getDoc(doc(db, "users", profile.uid));

    if (profile.role === "lecturer") {
      allUnitsSnap.then((res) => {
        const units = res.docs.map((doc) => doc.data());
        if (units.length) setUnits(units);
      });
    } else {
      studentsUnitsSnap.then((res) => {
        const units = res.data().units;
        if (units.length) setUnits(units);
      });
    }
  }, []);

  return (
    <main className="container py-12 px-6">
      <div className="py-6">
        <div className="flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-row space-x-4 items-start justify-between">
            <h1>{isLecturer ? "All Units" : "Registered Units"}</h1>
            <div className="w-auto">
              {isLecturer ? (
                <Button
                  disabled={false}
                  isLoading={false}
                  onClick={(_) => setIsAddOpen(true)}
                  type="button"
                  cta="Add Unit"
                  color=""
                ></Button>
              ) : (
                <Button
                  disabled={false}
                  isLoading={false}
                  onClick={(_) => setIsRegisterOpen(true)}
                  type="button"
                  cta="Register Units"
                  color=""
                ></Button>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            {units.length > 0 && (
              <div className="grid grid-cols-4 px-4 font-medium">
                <p>Name</p>
                <p>Code</p>
                <p>Semester</p>
                <div></div>
              </div>
            )}

            {units.length > 0 &&
              units.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 p-4 rounded-lg bg-gray-100 hover:ring-1 hover:ring-gray-300"
                >
                  <div>
                    <span className="font-semibold text-black">
                      {item.name}
                    </span>
                  </div>

                  <div>
                    <p>{item.code}</p>
                  </div>

                  <div>
                    <p>{item.semester}</p>
                  </div>

                  <div className="flex justify-end">
                    {isLecturer && (
                      <button
                        onClick={(_) => onDelete(item.id)}
                        className="p-2 rounded-md hover:bg-red-100"
                      >
                        <TrashIcon className="w-6 h-6 text-red-700" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {units.length <= 0 && (
              <div className="text-center p-6 font-medium bg-amber-50 text-amber-600 rounded-lg">
                <p>You don't have any units registered</p>
              </div>
            )}
          </div>

          <CenterDialog
            isOpen={isAddOpen}
            onClose={(_) => setIsAddOpen(false)}
            dialogTitle="Add Unit"
            component={
              <AddUnitForm
                onCloseModal={(_) => setIsAddOpen(false)}
                onAddUnit={(addUnit) => setUnits([...units, addUnit])}
              ></AddUnitForm>
            }
          ></CenterDialog>

          <CenterDialog
            isOpen={isRegisterOpen}
            onClose={(_) => setIsRegisterOpen(false)}
            dialogTitle="Register Units"
            component={
              <RegisterUnitsForm
                onCloseModal={(_) => setIsRegisterOpen(false)}
                onRegisterUnits={(units) => setUnits(units)}
              ></RegisterUnitsForm>
            }
          ></CenterDialog>
        </div>
      </div>
    </main>
  );
}
