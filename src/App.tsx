import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={(e: boolean) => setSidebarOpen(e)}
        />
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-white bg-opacity-70 backdrop-filter backdrop-blur-md pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
