import express from 'express';
import { register, login, changePassword, forgotPassword, verifyOTP, resetPassword } from '../controllers/authController.js';
import { addStaff, getStaff, updateStaffProfile, deleteStaff, getAdmin } from '../controllers/staffController.js';
import { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory, addDish, getDishes, getDishById, updateDish, deleteDish, getDishesByArea, getCategoriesByArea, searchDishes, searchCategories } from '../controllers/foodController.js';
import { addRoomType, getRoomTypes, updateRoomType, deleteRoomType, addRoom, getRooms, updateRoom, deleteRoom, getRoomById, searchRooms } from '../controllers/roomController.js';
import { getReservations, updateReservationStatus, createPaymentIntent, confirmBooking, getReservationById, getAvailableRoomTypes, getRoomsByType, validateGuestDetails, getGuests, searchReservations, searchGuests, getAdminReservations } from '../controllers/reservationController.js';
import { addTable, getTables, getTableById, updateTable, deleteTable, getTablesByArea } from '../controllers/tableController.js';
import { UserAuth, superAdminAuth, managerAuth, adminManagerAuth, waiterAuth, chefAuth, housekeepingAuth, isStaff } from '../middlewares/authMiddleware.js';
import { upload, listBucketObjects, deleteManyFromS3 } from '../utils/uploadFile.utils.js';
import { addCuisine, getCuisines, getCuisineById, updateCuisine, deleteCuisine, searchCuisines } from '../controllers/cuisineController.js';
import { addImage, deleteImage, getGallery, toggleVisibility, updateImage } from '../controllers/galleryController.js';
import { addBlog, getBlogs, deleteBlog, getBlogById, updateBlog, toggleLike } from '../controllers/blogController.js';
import { addInquiry, deleteInquiry, getInquiries, getInquiryById, updateInquiryStatus } from '../controllers/inquiryController.js';
import { getHousekeepingStaff, assignHousekeeper, updateCleanStatus, getHousekeepingTasks, getHousekeepingStats } from '../controllers/housekeepingController.js';
import { confirmTableBooking, createTablePaymentIntent, getAvailableTablesByArea, getTableReservationsByDate, updateTableReservationStatus } from '../controllers/tableReservationController.js';
import { acceptDish, confirmBillingAndCheckout, createBillingPaymentIntent, createOrder, getAllOrdersAdmin, getAllOrdersForAdmin, getBillingOrders, getChefQueue, getDashboardStats, getKitchenQueue, getWaiterActiveOrders, markDishReady, updateItemStatus } from '../controllers/orderController.js';
import { getUserBookings, getUserBillingHistory } from '../controllers/userProfileController.js';
import { getAdminDashboardData } from '../controllers/dashboardController.js';
import { addReview, deleteReview, getAreaReviews, getReviews, getUserReviews } from '../controllers/reviewController.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION:', err.stack);
});
router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/changePassword', UserAuth, changePassword);
router.post('/auth/forgotPassword', forgotPassword);
router.post('/auth/verifyOTP', verifyOTP);
router.put('/auth/resetPassword', resetPassword);


router.get('/user/bookings', UserAuth, getUserBookings);
router.get('/user/billing', UserAuth, getUserBillingHistory);



router.post('/addStaff', UserAuth, adminManagerAuth, upload.none(), addStaff);
router.get('/getStaff', UserAuth, adminManagerAuth, getStaff);
router.get('/getAdmin', UserAuth, superAdminAuth, getAdmin);
router.put('/updateStaffProfile/:id', UserAuth, upload.single("img"), updateStaffProfile);
router.delete('/deleteStaff/:id', UserAuth, superAdminAuth, deleteStaff);


router.post('/rooms/types', UserAuth, adminManagerAuth, upload.single('image_url'), addRoomType);
router.get('/rooms/types', getRoomTypes);
router.put('/rooms/types/:id', UserAuth, adminManagerAuth, upload.single('image_url'), updateRoomType);
router.delete('/rooms/types/:id', UserAuth, adminManagerAuth, deleteRoomType);


router.post('/addRoom', UserAuth, adminManagerAuth, addRoom);
router.get('/getRooms', UserAuth, getRooms);
router.get('/rooms/search', UserAuth, adminManagerAuth, searchRooms);
router.get('/getRoomById/:id', UserAuth, getRoomById);
router.put('/updateRoom/:id', UserAuth, adminManagerAuth, updateRoom);
router.delete('/deleteRoom/:id', UserAuth, adminManagerAuth, deleteRoom);


router.post('/reservations/validateGuestDetails', validateGuestDetails);
router.post('/reservations/getAvailableRoomTypes', getAvailableRoomTypes);
router.post('/reservations/getRoomsByType', getRoomsByType);
router.post('/reservations/createPaymentIntent', createPaymentIntent);
router.post('/reservations/confirmBooking', confirmBooking);
router.get('/reservations/guests', UserAuth, adminManagerAuth, getGuests);
router.get('/reservations/guests/search', UserAuth, adminManagerAuth, searchGuests);
router.get('/reservations/search', UserAuth, adminManagerAuth, searchReservations);
router.get('/reservations/getAdminReservations', UserAuth, adminManagerAuth, getAdminReservations);
router.get('/reservations/getAll', UserAuth, adminManagerAuth, getReservations);
router.get('/reservations/getById/:id', UserAuth, adminManagerAuth, getReservationById);
router.patch('/reservations/updateStatus/:id', UserAuth, adminManagerAuth, updateReservationStatus);


router.get('/table/getAvailableTablesByArea', getAvailableTablesByArea);
router.post('/table/createTablePaymentIntent', UserAuth, createTablePaymentIntent);
router.post('/table/confirmTableBooking', UserAuth, confirmTableBooking);
router.patch('/table/updateTableReservationStatus', UserAuth, adminManagerAuth, updateTableReservationStatus);
router.get('/table/getTableReservationsByDate', UserAuth, adminManagerAuth, getTableReservationsByDate);


router.get('/housekeeping/staff', UserAuth, adminManagerAuth, getHousekeepingStaff);
router.patch('/housekeeping/assign', UserAuth, adminManagerAuth, assignHousekeeper);
router.patch('/housekeeping/updateStatus', UserAuth, housekeepingAuth, updateCleanStatus);
router.get('/housekeeping/getTasks', UserAuth, isStaff, getHousekeepingTasks);
router.get('/housekeeping/stats', UserAuth, isStaff, getHousekeepingStats);


router.post('/food/addCuisine', UserAuth, adminManagerAuth, upload.single('img'), addCuisine);
router.get('/food/getCuisines', getCuisines);
router.get('/food/cuisines/search', searchCuisines);
router.get('/food/getCuisineById/:id', getCuisineById);
router.put('/food/updateCuisine/:id', UserAuth, adminManagerAuth, upload.single('img'), updateCuisine);
router.delete('/food/deleteCuisine/:id', UserAuth, adminManagerAuth, deleteCuisine);


router.post('/food/addCategory', UserAuth, adminManagerAuth, upload.single('img'), addCategory);
router.get('/food/getCategories', getCategories);
router.get('/food/categories/search', searchCategories);
router.get('/food/getCategoryById/:id', getCategoryById);
router.get('/food/getCategoriesByArea', getCategoriesByArea);
router.put('/food/updateCategory/:id', UserAuth, adminManagerAuth, upload.single('img'), updateCategory);
router.delete('/food/deleteCategory/:id', UserAuth, adminManagerAuth, deleteCategory);


router.post('/food/addDish', UserAuth, adminManagerAuth, upload.single('img'), addDish);
router.get('/food/getDishes', getDishes);
router.get('/food/dishes/search', searchDishes);
router.get('/food/getDishesByArea', getDishesByArea);
router.get('/food/getDishById/:id', getDishById);
router.put('/food/updateDish/:id', UserAuth, adminManagerAuth, upload.single('img'), updateDish);
router.delete('/food/deleteDish/:id', UserAuth, adminManagerAuth, deleteDish);


router.post("/addImage", UserAuth, adminManagerAuth, upload.single("img"), addImage);
router.get("/getGallery", getGallery);
router.put("/updateImage/:id", UserAuth, adminManagerAuth, upload.single("img"), updateImage);
router.patch("/toggleVisibility/:id", UserAuth, adminManagerAuth, toggleVisibility);
router.delete("/deleteImage/:id", UserAuth, adminManagerAuth, deleteImage);


router.post("/addBlog", UserAuth, adminManagerAuth, upload.fields([{ name: "coverImg" }]), addBlog);
router.get("/getBlogs", getBlogs);
router.get("/getBlogById/:id", getBlogById);
router.put("/updateBlog/:id", UserAuth, adminManagerAuth, upload.fields([{ name: "coverImg" }]), updateBlog);
router.patch("/toggleLike/:id", UserAuth, toggleLike);
router.delete("/deleteBlog/:id", UserAuth, adminManagerAuth, deleteBlog);


router.post('/addTable', UserAuth, adminManagerAuth, addTable);
router.get('/getTables', UserAuth, getTables);
router.get('/getTablesByArea', getTablesByArea);
router.get('/getTableById/:id', UserAuth, getTableById);
router.put('/updateTable/:id', UserAuth, adminManagerAuth, updateTable);
router.delete('/deleteTable/:id', UserAuth, adminManagerAuth, deleteTable);


router.post('/addInquiry', addInquiry);
router.get('/getInquiries', UserAuth, adminManagerAuth, getInquiries);
router.get('/getInquiryById/:id', UserAuth, adminManagerAuth, getInquiryById);
router.patch('/updateInquiryStatus/:id', UserAuth, adminManagerAuth, updateInquiryStatus);
router.delete('/deleteInquiry/:id', UserAuth, adminManagerAuth, deleteInquiry);

router.post('/orders/create', UserAuth, waiterAuth, createOrder);
router.get('/orders/kitchen-queue', UserAuth, isStaff, getKitchenQueue);
router.get('/orders/all-orders', UserAuth, adminManagerAuth, getAllOrdersForAdmin);
router.patch('/orders/accept-dish', UserAuth, chefAuth, acceptDish);
router.patch('/orders/mark-ready', UserAuth, chefAuth, markDishReady);
router.patch('/orders/update-item-status/:orderId/:dishItemId', UserAuth, isStaff, updateItemStatus);
router.get('/orders/billing-orders', UserAuth, isStaff, getBillingOrders);
router.get('/dashboard/admin-overview', UserAuth, adminManagerAuth, getAdminDashboardData);
router.get('/orders/dashboard-stats', UserAuth, adminManagerAuth, getDashboardStats);
router.get('/analytics', UserAuth, adminManagerAuth, getAnalytics);
router.post('/orders/checkout-details/:orderId', UserAuth, adminManagerAuth, createBillingPaymentIntent);
router.post('/orders/confirm-checkout/:orderId', UserAuth, adminManagerAuth, confirmBillingAndCheckout);
router.get('/orders/chef-queue', UserAuth, chefAuth, getChefQueue);
router.get('/orders/waiter-active-orders', UserAuth, waiterAuth, getWaiterActiveOrders);
router.get('/orders/all-orders', UserAuth, adminManagerAuth, getAllOrdersAdmin);


router.post('/reviews/add', UserAuth, addReview);
router.get('/reviews/get-all', getReviews);
router.delete('/reviews/delete/:id', UserAuth, adminManagerAuth, deleteReview);
router.get('/reviews/area/:area', getAreaReviews);
router.get('/reviews/user/:userId', getUserReviews);


router.get("/s3/list", async (req, res) => {
    try {
        const images = await listBucketObjects();
        res.json({
            success: true,
            msg: "Get all images successfully",
            data: {
                total: images.length,
                images: images.map(e => e.url)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error while getting images from S3", error: error.message });
    }
});

router.delete("/s3/delete-many", async (req, res) => {
    try {
        const { images } = req.body;
        if (!Array.isArray(images) || !images.length) return res.status(400).json({ success: false, msg: "URLs array required" });

        const keys = images.map(url => {
            const key = String(url).split(".amazonaws.com/")[1];
            return key;
        }).filter(Boolean);

        if (!keys.length) return res.status(400).json({ success: false, msg: "Invalid S3 URLs" });

        await deleteManyFromS3(keys);
        res.json({
            success: true,
            msg: "Deleted multiple files",
            data: { deleted: keys.length, keys }
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Delete many error", error: error.message });
    }
});

export default router;