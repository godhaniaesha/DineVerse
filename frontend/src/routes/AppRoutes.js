import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Navbar from "../components/Navbar";
import Auth from "../components/Auth";
import Header from "../components/Header";
import BookTable from "../components/BookTable";
import BookRoom from "../components/BookRoom";

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
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/header" element={<Header />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/bookTable" element={<BookTable />} />
        <Route path="/bookRoom" element={<BookRoom />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;