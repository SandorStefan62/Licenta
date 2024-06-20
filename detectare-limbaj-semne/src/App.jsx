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
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: ""
  })

  const fetchUserData = async (token) => {
    try {
      if (!token) {
        throw new Error("Token not found.");
      } else {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const response = await fetch(`https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          if (!data.userData.firstName && !data.userData.lastName) {
            setUser({
              firstName: "",
              lastName: "",
              username: data.userData.username,
              email: data.userData.email,
              role: data.userData.role
            });
          } else if (!data.userData.firstName) {
            setUser({
              firstName: "",
              lastName: data.userData.lastName,
              username: data.userData.username,
              email: data.userData.email,
              role: data.userData.role
            });
          } else if (!data.userData.lastName) {
            setUser({
              firstName: data.userData.firstName,
              lastName: "",
              username: data.userData.username,
              email: data.userData.email,
              role: data.userData.role
            });
          } else {
            setUser({
              firstName: data.userData.firstName,
              lastName: data.userData.lastName,
              username: data.userData.username,
              email: data.userData.email,
              role: data.userData.role
            });
          }
        } else {
          console.error("Failed to fetch user data: ", data.error);
        }
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  }

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
    if (token && location.pathname !== "/Login") {
      verifyToken(token);
      fetchUserData(token);
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
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar isAdmin={isAdmin} setIsLoggedIn={setIsLoggedIn} firstName={user.firstName} lastName={user.lastName} />}
      <Pages className="w-screen h-screen flex justify-center items-center">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route exact path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route exact path="/About" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route exact path="/Dictionary" element={<ProtectedRoute isAdmin={isAdmin} ><Dictionary /></ProtectedRoute>} />
            <Route exact path="/Practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route exact path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
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