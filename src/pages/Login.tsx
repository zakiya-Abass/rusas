import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../firebase";
import Button from "../components/Button";
import { doc, getDoc } from "firebase/firestore";

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    setFormLoading(true);

    signInWithEmailAndPassword(auth, data.email.trim(), data.password.trim())
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("Auth Token", user.refreshToken);
        return getDoc(doc(db, "users", user.uid));
      })
      .then((res) => {
        const userProfile = res.data();
        sessionStorage.setItem("profile", JSON.stringify(userProfile));
        navigate("../app/overview");
        setFormLoading(false);
      })
      .catch((error) => {
        setFormLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        console.log(errorCode);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 bg-gray-100 h-screen sm:px-6 lg:px-8">
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/create-account">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                create a new account
              </span>
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  disabled={!isValid}
                  isLoading={formLoading}
                  cta="Sign in"
                  color="primary"
                ></Button>
              </div>

              {errorMessage && (
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    {errorMessage}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
