import { Route, Routes, useLocation } from "react-router";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Detection from "./pages/Detection"
import Dictionary from "./pages/Dictionary";
import Practice from "./pages/Practice";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";

const Pages = styled.div`
`;

function App() {
  const location = useLocation();
  const hideSidebarRoutes = ["/Login"];

  return (
    <>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <Pages className="w-screen h-screen flex justify-center items-center">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/Login" element={<Login />} />
            <Route exact path="/About" element={<About />} />
            <Route exact path="/Dictionary" element={<Dictionary />} />
            <Route exact path="/Detection" element={<Detection />} />
            <Route exact path="/Practice" element={<Practice />} />
            <Route exact path="/UserProfile" element={<UserProfile />} />
            <Route exact path="/Settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </Pages>
    </>
  );
}

export default App;