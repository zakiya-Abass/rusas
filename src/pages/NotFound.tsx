import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="h-screen w-full p-24 bg-gray-200">
      <div className="flex flex-col space-y-6 justify-center items-center h-full w-full bg-white rounded-2xl ">
        <h1 className=" text-6xl font-black">Oops that wasn't right!</h1>
        <p className="text-lg text-gray-500 font-semibold">
          We couldn't find the page you requested for. Try going back{" "}
          <Link to="/">
            <span className="underline hover:text-black">Home</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
