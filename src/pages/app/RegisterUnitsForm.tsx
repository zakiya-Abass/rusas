import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { auth, db } from "../../firebase";
import { Unit } from "../../models/Unit";

interface RegisterUnit extends Unit {
  selected?: boolean;
}

export default function RegisterUnitsForm(props: {
  onCloseModal: (e: any) => void;
  onRegisterUnits: (units: Unit[]) => void;
}) {
  const [units, setUnits] = useState<RegisterUnit[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    const unitsSnap = getDocs(collection(db, "units"));
    unitsSnap.then((res) => {
      const units = (res.docs.map((doc) => doc.data()) as Unit[]).map(
        (unit) => ({ ...unit, selected: false })
      );
      setUnits(units);
    });
  }, []);

  const toggleUnit = (itemIndex: number) => {
    units[itemIndex].selected = !units[itemIndex].selected;
    setUnits([...units]);
  };

  const selectAll = () => {
    const modifiedList = [...units];
    modifiedList.forEach((unit) => (unit.selected = true));
    setUnits(modifiedList);
  };

  const deselectAll = () => {
    const modifiedList = [...units];
    modifiedList.forEach((unit) => (unit.selected = false));
    setUnits(modifiedList);
  };

  const onSave = () => {
    setIsFormLoading(true);
    const userId = auth.currentUser?.uid;
    const selectedUnits = units.filter((item) => item.selected);
    selectedUnits.forEach((item) => {
      delete item.selected;
    });
    if (userId) {
      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);
      batch.set(userRef, { units: selectedUnits }, { merge: true });
      batch
        .commit()
        .then((_) => {
          setIsFormLoading(false);
          props.onRegisterUnits(selectedUnits);
          props.onCloseModal(null);
        })
        .catch((err) => {
          // TODO: handle error
          console.error(err);
        });
    }
  };

  return (
    <form className="pt-6">
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex flex-row space-x-4 items-center justify-between">
          <p className="block font-semibold text-gray-700">Select units</p>

          {units.every((item) => item.selected) && (
            <button
              onClick={(_) => deselectAll()}
              type="button"
              className="text-xs font-semibold text-black px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Deselect All
            </button>
          )}

          {!units.every((item) => item.selected) && (
            <button
              onClick={(_) => selectAll()}
              type="button"
              className="text-xs font-semibold text-black px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Select All
            </button>
          )}
        </div>
        {units.map((item, itemIndex) => (
          <label
            htmlFor={item.id}
            key={item.id}
            className={`flex flex-row space-x-4 items-center w-full p-2 rounded-md  ${
              item.selected
                ? "bg-purple-50 hover:bg-purple-100"
                : "bg-none hover:bg-gray-100"
            }`}
          >
            <input
              id={item.id}
              checked={item.selected}
              onChange={(_) => toggleUnit(itemIndex)}
              type="checkbox"
            />
            <p className="font-medium">{item.name}</p>
          </label>
        ))}
      </div>

      <div className="pt-6">
        <Button
          disabled={!units.some((item) => item.selected)}
          isLoading={isFormLoading}
          onClick={(_) => onSave()}
          cta="Save"
          type="button"
          color="primary"
        ></Button>
      </div>
    </form>
  );
}
