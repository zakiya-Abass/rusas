import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { RUser } from "../models/RUser";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar(props: { sidebarOpen: boolean | undefined; onToggleSidebar: (arg0: boolean) => void; }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = [
    { name: "Overview", href: "/app/overview", icon: HomeIcon, current: true },
    {
      name: "Attendance",
      href: "/app/attendance",
      icon: UsersIcon,
      current: false,
    },
    { name: "Units", href: "/app/units", icon: BookOpenIcon, current: false },
  ];

  const user = auth.currentUser;

  const profile: RUser = JSON.parse(
    sessionStorage.getItem("profile") as string
  );

  const onSignOut = () => {
    auth.signOut().then(() => {
      sessionStorage.removeItem("Auth Token");
      navigate("/");
    });
  };

  return (
    <>
      <Transition.Root show={props.sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={(e) => props.onToggleSidebar(e)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => props.onToggleSidebar(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-row flex-shrink-0 space-x-2 items-center px-4">
                    <svg
                      className="h-8 w-auto transition-all duration-300 ease-in-out hover:scale-125"
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1425781 22.513672 6.1425781 22.513672 L 7.8574219 21.486328 C 7.8574219 21.486328 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 C 17 9.2504839 14.749516 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 18.666667 13.552734 21.894531 13.552734 21.894531 L 14.447266 20.105469 C 14.447266 20.105469 9 17.333333 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 C 15 13.64497 16.35503 15 18 15 C 19.64497 15 21 13.64497 21 12 C 21 7.0414839 16.958516 3 12 3 z M 11 11 C 11 12.722222 11.552197 14.928875 13.111328 16.771484 C 14.670459 18.614093 17.261905 20 21 20 L 21 18 C 17.738095 18 15.829541 16.885907 14.638672 15.478516 C 13.447803 14.071125 13 12.277778 13 11 L 11 11 z" />
                    </svg>
                    <span className="font-bold tracking-widest">Rusas</span>
                  </div>
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <a href="#" className="group block flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-row flex-shrink-0 space-x-2 items-center px-4">
              <svg
                className="h-8 w-auto transition-all duration-300 ease-in-out hover:scale-125"
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1425781 22.513672 6.1425781 22.513672 L 7.8574219 21.486328 C 7.8574219 21.486328 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 C 17 9.2504839 14.749516 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 18.666667 13.552734 21.894531 13.552734 21.894531 L 14.447266 20.105469 C 14.447266 20.105469 9 17.333333 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 C 15 13.64497 16.35503 15 18 15 C 19.64497 15 21 13.64497 21 12 C 21 7.0414839 16.958516 3 12 3 z M 11 11 C 11 12.722222 11.552197 14.928875 13.111328 16.771484 C 14.670459 18.614093 17.261905 20 21 20 L 21 18 C 17.738095 18 15.829541 16.885907 14.638672 15.478516 C 13.447803 14.071125 13 12.277778 13 11 L 11 11 z" />
              </svg>
              <span className="font-bold tracking-widest">Rusas</span>
            </div>
            <nav className="mt-5 flex-1 space-y-4 bg-white px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-300 ease-in-out"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={onSignOut}
              className="mx-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <ArrowLeftOnRectangleIcon
                className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                aria-hidden="true"
              />
              Sign out
            </button>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <a className="group block w-full flex-shrink-0">
              <div className="flex flex-row items-center space-x-3 overflow-hidden">
                <div className="shrink-0">
                  <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-black"></UserCircleIcon>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                  <p
                    title={profile.email}
                    className="text-xs font-medium truncate text-gray-500 group-hover:text-gray-700"
                  >
                    {profile.email}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
