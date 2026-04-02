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
import ServicesPage from "../pages/ServicesPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import DishDetailsPage from "../pages/DishDetailsPage";
import ReservationReviewPage from "../pages/ReservationReviewPage";
import GalleryPage from "../pages/GalleryPage";
import AdminLayout from "../admin/AdminLayout";
import AdminReservations from "../admin/pages/AdminReservations";
import AdminRooms from "../admin/pages/AdminRooms";
import AdminGallery from "../admin/pages/AdminGallery";
import AdminMenu from "../admin/pages/AdminMenu";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminAnalytics from "../admin/pages/AdminAnalytics";
import AdminGuests from "../admin/pages/AdminGuests";
import AdminSettings from "../admin/pages/AdminSettings";
import AdminTables from "../admin/pages/AdminTables";
import AdminBlogs from "../admin/pages/AdminBlogs";
import AdminProfile from "../admin/pages/AdminProfile";
import AdminReviews from "../admin/pages/AdminReviews";
import AdminOffers from "../admin/pages/AdminOffers";
import AdminInquiries from "../admin/pages/AdminInquiries";
import AdminContent from "../admin/pages/AdminContent";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminNotifications from "../admin/pages/AdminNotifications";
import AdminCafeBookings from "../admin/pages/AdminCafeBookings";
import AdminCafeMenu from "../admin/pages/AdminCafeMenu";
import AdminRestaurantBookings from "../admin/pages/AdminRestaurantBookings";
import AdminRestaurantMenu from "../admin/pages/AdminRestaurantMenu";
import AdminBarBookings from "../admin/pages/AdminBarBookings";
import AdminBarMenu from "../admin/pages/AdminBarMenu";
import AdminRoomBookings from "../admin/pages/AdminRoomBookings";
import AdminStaffManagement from "../admin/pages/AdminStaffManagement";
import AdminCuisineManagement from "../admin/pages/AdminCuisineManagement";
import AdminOrderManagement from "../admin/pages/AdminOrderManagement";
import AdminInventoryManagement from "../admin/pages/AdminInventoryManagement";
import AdminKDS from "../admin/pages/AdminKDS";
import AdminWaiterPanel from "../admin/pages/AdminWaiterPanel";
import AdminPOS from "../admin/pages/AdminPOS";
import AdminRoleAccess from "../admin/pages/AdminRoleAccess";
import AdminArchitecture from "../admin/pages/AdminArchitecture";
import AdminCafeWaiterPanel from "../admin/pages/AdminCafeWaiterPanel";
import AdminRestaurantWaiterPanel from "../admin/pages/AdminRestaurantWaiterPanel";
import AdminBarWaiterPanel from "../admin/pages/AdminBarWaiterPanel";
import AdminCafeChefPanel from "../admin/pages/AdminCafeChefPanel";
import AdminRestaurantChefPanel from "../admin/pages/AdminRestaurantChefPanel";
import AdminBarChefPanel from "../admin/pages/AdminBarChefPanel";
import AdminBartenderPanel from "../admin/pages/AdminBartenderPanel";
import AdminManagerPanel from "../admin/pages/AdminManagerPanel";
import AdminHousekeepingPanel from "../admin/pages/AdminHousekeepingPanel";

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
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/dish/:id" element={<DishDetailsPage />} />
        <Route path="/reservation-review" element={<ReservationReviewPage />} />
        <Route path="/gallerypage" element={<GalleryPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="cafe-bookings" element={<AdminCafeBookings />} />
          <Route path="cafe-menu" element={<AdminCafeMenu />} />
          <Route path="restaurant-bookings" element={<AdminRestaurantBookings />} />
          <Route path="restaurant-menu" element={<AdminRestaurantMenu />} />
          <Route path="bar-bookings" element={<AdminBarBookings />} />
          <Route path="bar-menu" element={<AdminBarMenu />} />
          <Route path="room-bookings" element={<AdminRoomBookings />} />
          <Route path="staff" element={<AdminStaffManagement />} />
          <Route path="cuisines" element={<AdminCuisineManagement />} />
          <Route path="orders" element={<AdminOrderManagement />} />
          <Route path="inventory" element={<AdminInventoryManagement />} />
          <Route path="kds" element={<AdminKDS />} />
          <Route path="waiter-panel" element={<AdminWaiterPanel />} />
          <Route path="cafe-waiter" element={<AdminCafeWaiterPanel />} />
          <Route path="restaurant-waiter" element={<AdminRestaurantWaiterPanel />} />
          <Route path="bar-waiter" element={<AdminBarWaiterPanel />} />
          <Route path="cafe-chef" element={<AdminCafeChefPanel />} />
          <Route path="restaurant-chef" element={<AdminRestaurantChefPanel />} />
          <Route path="bar-chef" element={<AdminBarChefPanel />} />
          <Route path="bartender-panel" element={<AdminBartenderPanel />} />
          <Route path="manager-panel" element={<AdminManagerPanel />} />
          <Route path="housekeeping-panel" element={<AdminHousekeepingPanel />} />
          <Route path="pos" element={<AdminPOS />} />
          <Route path="guests" element={<AdminGuests />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="tables" element={<AdminTables />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="role-access" element={<AdminRoleAccess />} />
          <Route path="architecture" element={<AdminArchitecture />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;