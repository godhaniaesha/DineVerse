import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Navbar from "../components/Navbar";
import Auth from "../components/Auth";
import Home from "../pages/Home";
import Header from "../components/Header";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Navbar />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/header" element={<Header />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;