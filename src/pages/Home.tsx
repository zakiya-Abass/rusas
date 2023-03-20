import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Students", href: "#" },
  { name: "Lecturers", href: "#" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gray-800 h-screen m-0">
      <div
        className="hidden sm:absolute sm:inset-0 sm:block"
        aria-hidden="true"
      >
        <svg
          className="absolute bottom-0 right-0 mb-48 translate-x-1/2 transform text-gray-700 lg:top-0 lg:mt-28 lg:mb-0 xl:translate-x-0 xl:transform-none"
          width={364}
          height={384}
          viewBox="0 0 364 384"
          fill="none"
        >
          <defs>
            <pattern
              id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width={364}
            height={384}
            fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)"
          />
        </svg>
      </div>
      <div className="relative pt-6 pb-16 sm:pb-24">
        <Popover>
          <nav
            className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
            aria-label="Global"
          >
            <div className="flex flex-1 items-center">
              <div className="flex w-full items-center justify-between md:w-auto">
                <a href="#">
                  <span className="sr-only">Workflow</span>
                  <svg
                    className="h-8 w-auto transition-all duration-300 ease-in-out hover:scale-125"
                    fill="#ffff"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1425781 22.513672 6.1425781 22.513672 L 7.8574219 21.486328 C 7.8574219 21.486328 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 C 17 9.2504839 14.749516 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 18.666667 13.552734 21.894531 13.552734 21.894531 L 14.447266 20.105469 C 14.447266 20.105469 9 17.333333 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 C 15 13.64497 16.35503 15 18 15 C 19.64497 15 21 13.64497 21 12 C 21 7.0414839 16.958516 3 12 3 z M 11 11 C 11 12.722222 11.552197 14.928875 13.111328 16.771484 C 14.670459 18.614093 17.261905 20 21 20 L 21 18 C 17.738095 18 15.829541 16.885907 14.638672 15.478516 C 13.447803 14.071125 13 12.277778 13 11 L 11 11 z" />
                  </svg>
                </a>
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button className="focus-ring-inset inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="hidden space-x-10 md:ml-10 md:flex">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="font-medium text-white hover:text-gray-300"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden md:flex">
              <Link to="/login">
                <span className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                  Log in
                </span>
              </Link>
            </div>
          </nav>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
            >
              <div className="overflow-hidden rounded-lg bg-black text-white shadow-md ring-1 ring-black ring-opacity-5">
                <div className="flex items-center justify-between px-5 pt-4">
                  <div>
                    <svg
                      className="h-8 w-auto transition-all duration-300 ease-in-out hover:scale-125"
                      fill="#ffff"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1425781 22.513672 6.1425781 22.513672 L 7.8574219 21.486328 C 7.8574219 21.486328 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 C 17 9.2504839 14.749516 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 18.666667 13.552734 21.894531 13.552734 21.894531 L 14.447266 20.105469 C 14.447266 20.105469 9 17.333333 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 C 15 13.64497 16.35503 15 18 15 C 19.64497 15 21 13.64497 21 12 C 21 7.0414839 16.958516 3 12 3 z M 11 11 C 11 12.722222 11.552197 14.928875 13.111328 16.771484 C 14.670459 18.614093 17.261905 20 21 20 L 21 18 C 17.738095 18 15.829541 16.885907 14.638672 15.478516 C 13.447803 14.071125 13 12.277778 13 11 L 11 11 z" />
                    </svg>
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-black p-2  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <Link to="/login">
                  <span className="block w-full bg-gray-600 px-5 py-3 text-center font-medium text-white hover:bg-gray-700">
                    Log in
                  </span>
                </Link>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <main className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className=" px-4 sm:px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left">
              <div className="text-center">
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  Riara University Students Attendance system.
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  All in one platform to manage and view reports of class
                  attendances for both lecturers and students
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
