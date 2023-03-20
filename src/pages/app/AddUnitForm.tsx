import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import Button from "../../components/Button";
import { db } from "../../firebase";
import { Unit } from "../../models/Unit";

export default function AddUnitForm(props: {
  onCloseModal: (e: any) => void;
  onAddUnit: (unit: Unit) => void;
}) {
  const semesters = [
    "1.1",
    "1.2",
    "1.3",
    "2.1",
    "2.2",
    "2.3",
    "3.1",
    "3.2",
    "3.3",
    "4.1",
    "4.2",
    "4.3",
  ];
  const [formLoading, setFormLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      semester: "",
      code: "",
    },
  });

  const onSubmit: SubmitHandler<{
    name: string;
    code: string;
    semester: string;
  }> = (data) => {
    setFormLoading(true);
    const id = uuid();
    const addedUnit: Unit = {
      id,
      name: data.name,
      code: data.code,
      semester: data.semester,
      timestamp: Date.now(),
    };
    setDoc(doc(db, "units", id), addedUnit).then((_) => {
      setFormLoading(false);
      props.onAddUnit(addedUnit);
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
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <div className="mt-1">
          <input
            {...register("name", { required: true })}
            type="text"
            name="name"
            id="name"
            placeholder="Web Programming"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Code
        </label>
        <div className="mt-1">
          <input
            {...register("code", { required: true })}
            id="code"
            name="code"
            type="text"
            placeholder="ICS 201"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="unitId"
          className="block text-sm font-medium text-gray-700"
        >
          Semester
        </label>
        <div className="mt-1">
          <select
            {...register("semester", { required: true })}
            id="semester"
            name="semester"
            autoComplete="semester"
            required
          >
            <option value="" disabled>
              Select semester
            </option>
            {semesters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

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
