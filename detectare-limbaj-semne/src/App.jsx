import { Route, Routes, useLocation } from "react-router";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import About from "./pages/About";
import Detection from "./pages/Detection"

const Pages = styled.div`
  h1 {
    font-size: calc(2rem + 2vw);
    color: var(--white)
  }
`;

function App() {
  const location = useLocation();
  return (
    <>
      <Sidebar />
      <Pages className="w-screen h-screen flex justify-center items-center">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/About" element={<About />} />
            <Route exact path="/Detection" element={<Detection />} />
          </Routes>
        </AnimatePresence>
      </Pages>
    </>
  );
}

export default App;