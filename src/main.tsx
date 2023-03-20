import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";

import Overview from "./pages/app/Overview";
import CreateAccount from "./pages/CreateAccount";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import "./index.css";
import ListAttendances from "./pages/app/ListAttendances";
import ListUnits from "./pages/app/ListUnits";
import AttendanceDetails from "./pages/app/AttendanceDetails";


// This is where React app starts from
// We define all the pages that would be in our and link them using 'react-router-dom' package
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");
    if (!authToken) navigate("../../login");
  }, []);

  return children;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="create-account" element={<CreateAccount />} />

      <Route path="app" element={<App />}>
        <Route
          path="overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="attendance"
          element={
            <ProtectedRoute>
              <ListAttendances />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="attendance/:id"
          element={
            <ProtectedRoute>
              <AttendanceDetails />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="units"
          element={
            <ProtectedRoute>
              <ListUnits />
            </ProtectedRoute>
          }
        ></Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
