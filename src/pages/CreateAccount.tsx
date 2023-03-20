import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth } from "../firebase";
import Button from "../components/Button";
import { RUser } from "../models/RUser";

type CreateAccountForm = {
  firstName: string;
  lastName: string;
  role: string;
  regNo: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function CreateAccount() {
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      regNo: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<CreateAccountForm> = (data) => {
    console.log(data);
    setFormLoading(true);
    createUserWithEmailAndPassword(auth, data.email, data.confirmPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("Auth Token", user.refreshToken);
        const profile: RUser = {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          regNo: data.regNo,
          email: data.email,
          uid: user.uid,
        };
        setDoc(doc(db, "users", user.uid), profile).then((_) => {
          sessionStorage.setItem("profile", JSON.stringify(profile));
          navigate("../app/overview");
          setFormLoading(false);
        });
        updateProfile(user, {
          displayName: `${data.firstName} ${data.lastName}`,
        });
      })
      .catch((error) => {
        setFormLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 bg-gray-100 h-full sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <svg
            className="h-12 w-auto mx-auto transition-all duration-300 ease-in-out hover:scale-125"
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1425781 22.513672 6.1425781 22.513672 L 7.8574219 21.486328 C 7.8574219 21.486328 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 C 17 9.2504839 14.749516 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 18.666667 13.552734 21.894531 13.552734 21.894531 L 14.447266 20.105469 C 14.447266 20.105469 9 17.333333 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 C 15 13.64497 16.35503 15 18 15 C 19.64497 15 21 13.64497 21 12 C 21 7.0414839 16.958516 3 12 3 z M 11 11 C 11 12.722222 11.552197 14.928875 13.111328 16.771484 C 14.670459 18.614093 17.261905 20 21 20 L 21 18 C 17.738095 18 15.829541 16.885907 14.638672 15.478516 C 13.447803 14.071125 13 12.277778 13 11 L 11 11 z" />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/login">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                sign in to your account
              </span>
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 md:gap-y-0">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("firstName", { required: true })}
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("lastName", { required: true })}
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <div className="mt-1">
                  <select
                    {...register("role", { required: true })}
                    id="role"
                    name="role"
                    autoComplete="role"
                    required
                  >
                    <option value="" disabled>
                      Choose your role
                    </option>
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="regNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Registration Number
                </label>
                <div className="mt-1">
                  <input
                    {...register("regNo", { required: true })}
                    id="regNo"
                    name="regNo"
                    type="text"
                    autoComplete="regNo"
                    required
                    placeholder="19ZAD104438"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    {...register("email", { required: true })}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="registrar@riarauniversity.ac.ke"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    {...register("password", { required: true, minLength: 8 })}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword", {
                    required: true,
                    minLength: 8,
                    deps: ["password"],
                    validate: {
                      passwordMatches: (value) => {
                        console.log(
                          "Password :: ",
                          getValues("password"),
                          " confirm password :: ",
                          value
                        );

                        return getValues("password") === value;
                      },
                    },
                  })}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    Your passwords don't match
                  </p>
                )}
              </div>

              <div>
                <Button
                  disabled={!isValid}
                  isLoading={formLoading}
                  onClick={onSubmit}
                  cta="Create"
                  color="primary"
                ></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
