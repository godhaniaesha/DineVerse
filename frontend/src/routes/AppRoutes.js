import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Menu from "../pages/Menu";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Auth from "../components/Auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookTable from "../components/BookTable";
import BookRoom from "../components/BookRoom";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import Faq from "../pages/Faq";
import OurHistory from "../pages/Ourhistory";
import ServicesPage from "../pages/ServicesPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import DishDetailsPage from "../pages/DishDetailsPage";
import GalleryPage from "../pages/GalleryPage";
import AdminLayout from "../admin/AdminLayout";
import AdminReservations from "../admin/pages/AdminReservations";
import AdminRooms from "../admin/pages/AdminRooms";
import AdminGallery from "../admin/pages/AdminGallery";
import AdminMenu from "../admin/pages/AdminMenu";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminAnalytics from "../admin/pages/AdminAnalytics";
import AdminGuests from "../admin/pages/AdminGuests";
import AdminTables from "../admin/pages/AdminTables";
import AdminRoomTypes from "../admin/pages/AdminRoomTypes";
import CafeBookTable from "../admin/pages/CafeBookTable";
import ResBookTable from "../admin/pages/ResBookTable";
import BarBookTable from "../admin/pages/BarBookTable";
import AdminBlogs from "../admin/pages/AdminBlogs";
import AdminProfile from "../admin/pages/AdminProfile";
import AdminReviews from "../admin/pages/AdminReviews";
import AdminInquiries from "../admin/pages/AdminInquiries";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminCafeBookings from "../admin/pages/AdminCafeBookings";
import AdminCafeMenu from "../admin/pages/AdminCafeMenu";
import AdminRestaurantBookings from "../admin/pages/AdminRestaurantBookings";
import AdminRestaurantMenu from "../admin/pages/AdminRestaurantMenu";
import AdminBarMenu from "../admin/pages/AdminBarMenu";
import AdminRoomBookings from "../admin/pages/AdminRoomBookings";
import AdminStaffManagement from "../admin/pages/AdminStaffManagement";
import AdminCuisineManagement from "../admin/pages/AdminCuisineManagement";
import AdminCategoryManagement from "../admin/pages/AdminCategoryManagement";
import AdminDishManagement from "../admin/pages/AdminDishManagement";
import AdminOrderManagement from "../admin/pages/AdminOrderManagement";
import AdminBilling from "../admin/pages/AdminBilling";
import AdminSalesHistory from "../admin/pages/AdminSalesHistory";
import CafeOrderManage from "../admin/pages/CafeOrderManage";
import ResOrderManage from "../admin/pages/ResOrderManage";
import BarOrderManage from "../admin/pages/BarOrderManage";
import AdminKDS from "../admin/pages/AdminKDS";
import AdminWaiterPanel from "../admin/pages/AdminWaiterPanel";
import AdminPOS from "../admin/pages/AdminPOS";
import AdminCafeWaiterPanel from "../admin/pages/AdminCafeWaiterPanel";
import AdminRouteGuard from "../admin/AdminRouteGuard";
import AdminRestaurantWaiterPanel from "../admin/pages/AdminRestaurantWaiterPanel";
import AdminBarWaiterPanel from "../admin/pages/AdminBarWaiterPanel";
import AdminManagerPanel from "../admin/pages/AdminManagerPanel";
import AdminHousekeepingPanel from "../admin/pages/AdminHousekeepingPanel";
import GallerySlider from "../components/GallerySlider";
import Bar from "../pages/Bar";
import ScrollToTop from "../components/ScrollToTop";
import Cafe from "../pages/Cafe";
import Restaurant from "../pages/Restaurant";
import Profile from "../pages/Profile";
import Rooms from "../pages/Rooms";

function AppLayout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = location.pathname.startsWith('/auth');

  const showHeaderFooter = !isAdmin && !isAuth;

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cafe" element={<Cafe />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/bookTable" element={<BookTable />} />
          <Route path="/bookRoom" element={<BookRoom />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/history" element={<OurHistory />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/dish/:id" element={<DishDetailsPage />} />
          <Route path="/gallerypage" element={<GalleryPage />} />
          <Route path="/gallerySlide" element={<GallerySlider />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/profile" element={<Profile />} />



          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminRouteGuard path="/admin/analytics"><AdminAnalytics /></AdminRouteGuard>} />
            <Route path="reservations" element={<AdminRouteGuard path="/admin/reservations"><AdminReservations /></AdminRouteGuard>} />
            <Route path="cafe-bookings" element={<AdminRouteGuard path="/admin/cafe-bookings"><AdminCafeBookings /></AdminRouteGuard>} />
            <Route path="cafe-menu" element={<AdminRouteGuard path="/admin/cafe-menu"><AdminCafeMenu /></AdminRouteGuard>} />
            <Route path="restaurant-bookings" element={<AdminRouteGuard path="/admin/restaurant-bookings"><AdminRestaurantBookings /></AdminRouteGuard>} />
            <Route path="restaurant-menu" element={<AdminRouteGuard path="/admin/restaurant-menu"><AdminRestaurantMenu /></AdminRouteGuard>} />
            <Route path="bar-menu" element={<AdminRouteGuard path="/admin/bar-menu"><AdminBarMenu /></AdminRouteGuard>} />
            <Route path="room-bookings" element={<AdminRouteGuard path="/admin/room-bookings"><AdminRoomBookings /></AdminRouteGuard>} />
            <Route path="staff" element={<AdminRouteGuard path="/admin/staff"><AdminStaffManagement /></AdminRouteGuard>} />
            <Route path="cuisines" element={<AdminRouteGuard path="/admin/cuisines"><AdminCuisineManagement /></AdminRouteGuard>} />
            <Route path="categories" element={<AdminRouteGuard path="/admin/categories"><AdminCategoryManagement /></AdminRouteGuard>} />
            <Route path="dishes" element={<AdminRouteGuard path="/admin/dishes"><AdminDishManagement /></AdminRouteGuard>} />
            <Route path="orders" element={<AdminRouteGuard path="/admin/orders"><AdminOrderManagement /></AdminRouteGuard>} />
            <Route path="billing" element={<AdminRouteGuard path="/admin/billing"><AdminBilling /></AdminRouteGuard>} />
            <Route path="sales-history" element={<AdminRouteGuard path="/admin/sales-history"><AdminSalesHistory /></AdminRouteGuard>} />
            <Route path="cafe-order-manage" element={<AdminRouteGuard path="/admin/cafe-order-manage"><CafeOrderManage /></AdminRouteGuard>} />
            <Route path="res-order-manage" element={<AdminRouteGuard path="/admin/res-order-manage"><ResOrderManage /></AdminRouteGuard>} />
            <Route path="bar-order-manage" element={<AdminRouteGuard path="/admin/bar-order-manage"><BarOrderManage /></AdminRouteGuard>} />
            <Route path="kds" element={<AdminRouteGuard path="/admin/kds"><AdminKDS /></AdminRouteGuard>} />
            <Route path="waiter-panel" element={<AdminRouteGuard path="/admin/waiter-panel"><AdminWaiterPanel /></AdminRouteGuard>} />
            <Route path="cafe-waiter" element={<AdminRouteGuard path="/admin/cafe-waiter"><AdminCafeWaiterPanel /></AdminRouteGuard>} />
            <Route path="restaurant-waiter" element={<AdminRouteGuard path="/admin/restaurant-waiter"><AdminRestaurantWaiterPanel /></AdminRouteGuard>} />
            <Route path="bar-waiter" element={<AdminRouteGuard path="/admin/bar-waiter"><AdminBarWaiterPanel /></AdminRouteGuard>} />
            <Route path="tables" element={<AdminRouteGuard path="/admin/tables"><AdminTables /></AdminRouteGuard>} />
            <Route path="manager-panel" element={<AdminRouteGuard path="/admin/manager-panel"><AdminManagerPanel /></AdminRouteGuard>} />
            <Route path="housekeeping-panel" element={<AdminRouteGuard path="/admin/housekeeping-panel"><AdminHousekeepingPanel /></AdminRouteGuard>} />
            <Route path="pos" element={<AdminRouteGuard path="/admin/pos"><AdminPOS /></AdminRouteGuard>} />
            <Route path="guests" element={<AdminRouteGuard path="/admin/guests"><AdminGuests /></AdminRouteGuard>} />
            <Route path="admin-menu" element={<AdminRouteGuard path="/admin/admin-menu"><AdminMenu /></AdminRouteGuard>} />
            <Route path="cafe-book-table" element={<AdminRouteGuard path="/admin/cafe-book-table"><CafeBookTable /></AdminRouteGuard>} />
            <Route path="res-book-table" element={<AdminRouteGuard path="/admin/res-book-table"><ResBookTable /></AdminRouteGuard>} />
            <Route path="bar-book-table" element={<AdminRouteGuard path="/admin/bar-book-table"><BarBookTable /></AdminRouteGuard>} />
            <Route path="room-types" element={<AdminRouteGuard path="/admin/room-types"><AdminRoomTypes /></AdminRouteGuard>} />
            <Route path="rooms" element={<AdminRouteGuard path="/admin/rooms"><AdminRooms /></AdminRouteGuard>} />
            <Route path="gallery" element={<AdminRouteGuard path="/admin/gallery"><AdminGallery /></AdminRouteGuard>} />
            <Route path="blogs" element={<AdminRouteGuard path="/admin/blogs"><AdminBlogs /></AdminRouteGuard>} />
            <Route path="reviews" element={<AdminRouteGuard path="/admin/reviews"><AdminReviews /></AdminRouteGuard>} />
            <Route path="inquiries" element={<AdminRouteGuard path="/admin/inquiries"><AdminInquiries /></AdminRouteGuard>} />
            <Route path="admin-users" element={<AdminRouteGuard path="/admin/admin-users"><AdminUsers /></AdminRouteGuard>} />
            <Route path="profile" element={<AdminRouteGuard path="/admin/profile"><AdminProfile /></AdminRouteGuard>} />
          </Route>
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;