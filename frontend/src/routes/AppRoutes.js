import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BookTable from "../components/BookTable";
import BookRoom from "../components/BookRoom";
import About from "../pages/About";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookTable" element={<BookTable />} />
        <Route path="/bookRoom" element={<BookRoom />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;