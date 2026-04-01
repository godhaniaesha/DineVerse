import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Auth from "../components/Auth";
import Header from "../components/Header";
import BookTable from "../components/BookTable";
import BookRoom from "../components/BookRoom";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import Faq from "../pages/Faq";
import OurHistory from "../pages/Ourhistory";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/header" element={<Header />} />
        <Route path="/bookTable" element={<BookTable />} />
        <Route path="/bookRoom" element={<BookRoom />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/history" element={<OurHistory />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;