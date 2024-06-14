import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";

import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Detection from "./pages/Detection"
import Dictionary from "./pages/Dictionary";
import Practice from "./pages/Practice";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

const Pages = styled.div`
`;

function App() {
  const location = useLocation();
  const hideSidebarRoutes = ["/Login"];
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const response = await fetch("https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        const decodedToken = jwtDecode(token);

        if (decodedToken.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error verifying token: ", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar isAdmin={isAdmin} setIsLoggedIn={setIsLoggedIn} />}
      <Pages className="w-screen h-screen flex justify-center items-center">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route exact path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route exact path="/About" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route exact path="/Dictionary" element={<ProtectedRoute><Dictionary /></ProtectedRoute>} />
            <Route exact path="/Detection" element={<ProtectedRoute><Detection /></ProtectedRoute>} />
            <Route exact path="/Practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route exact path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route exact path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            {isAdmin ? (
              <Route exact path="/Admin" element={<Admin />} />
            ) : (
              <Route
                exact
                path="/Admin"
                element={<Navigate to="/" replace />}
              />
            )}
          </Routes>
        </AnimatePresence>
      </Pages>
    </>
  );
}

export default App;