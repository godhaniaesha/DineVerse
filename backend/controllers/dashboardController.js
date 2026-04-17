import { RoomReservation } from "../models/RoomReservation.js";
import { TableReservation } from "../models/TableReservation.js";
import Room from "../models/Room.js";
import Table from "../models/Table.js";
import { Order } from "../models/Order.js";
import { Gallery } from "../models/Gallery.js";
import { ThrowError } from "../utils/Error.utils.js";

export const getAdminDashboardData = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);


        const todayRoomReservations = await RoomReservation.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });
        const todayTableReservations = await TableReservation.countDocuments({
            date: { $gte: startOfToday, $lte: endOfToday }
        });
        const todaysReservations = todayRoomReservations + todayTableReservations;

        const activeRoomsCount = await Room.countDocuments({ status: "Occupied" });
        const totalRoomsCount = await Room.countDocuments({});

        const todayOrdersCount = await Order.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        const totalGalleryUploads = await Gallery.countDocuments({});

        const kpiCards = [
            { label: "Today's Reservations", value: todaysReservations, trend: "Tables & Rooms" },
            { label: "Active Rooms", value: `${activeRoomsCount} / ${totalRoomsCount}`, trend: "Occupied vs Total" },
            { label: "Total Orders", value: todayOrdersCount, trend: "Today" },
            { label: "Gallery Uploads", value: totalGalleryUploads, trend: "Total Uploads" }
        ];


        const bestDishesAgg = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    orders: { $sum: "$items.quantity" }
                }
            },
            { $sort: { orders: -1 } },
            { $limit: 4 }
        ]);

        const bestSellingDishes = bestDishesAgg.map(item => ({
            name: item._id,
            orders: item.orders
        }));


        const topItemNames = bestSellingDishes.map(d => d.name);

        let bucket12AM = { time: "12 AM" };
        let bucket6AM = { time: "6 AM" };
        let bucket12PM = { time: "12 PM" };
        let bucket6PM = { time: "6 PM" };

        topItemNames.forEach(name => {
            bucket12AM[name] = 0;
            bucket6AM[name] = 0;
            bucket12PM[name] = 0;
            bucket6PM[name] = 0;
        });

        const todaysOrdersForChart = await Order.find({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        }).select("items createdAt");

        todaysOrdersForChart.forEach(order => {
            const hour = order.createdAt.getHours();
            order.items.forEach(item => {
                if (topItemNames.includes(item.name)) {

                    if (hour >= 0 && hour < 6) {
                        bucket12AM[item.name] += item.quantity;
                        bucket6AM[item.name] += item.quantity;
                        bucket12PM[item.name] += item.quantity;
                        bucket6PM[item.name] += item.quantity;
                    } else if (hour >= 6 && hour < 12) {
                        bucket6AM[item.name] += item.quantity;
                        bucket12PM[item.name] += item.quantity;
                        bucket6PM[item.name] += item.quantity;
                    } else if (hour >= 12 && hour < 18) {
                        bucket12PM[item.name] += item.quantity;
                        bucket6PM[item.name] += item.quantity;
                    } else if (hour >= 18 && hour < 24) {
                        bucket6PM[item.name] += item.quantity;
                    }
                }
            });
        });

        const topChartData = [bucket12AM, bucket6AM, bucket12PM, bucket6PM];


        const tables = await Table.find({});
        const tableOverview = tables.map(t => ({
            area: t.area,
            table: t.tableNo,
            seats: t.capacity || 4,
            status: t.status
        })).slice(0, 6);


        const roomBookings = await RoomReservation.find({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        }).limit(5);

        const tableBookings = await TableReservation.find({
            date: { $gte: startOfToday, $lte: endOfToday }
        }).limit(5);

        const todayLiveBookings = [];

        tableBookings.forEach(tb => {
            todayLiveBookings.push({
                id: tb.bookingRef || `TR-${Math.floor(100 + Math.random() * 900)}`,
                guest: tb.guest_name || "Guest",
                slot: tb.time,
                type: "Table",
                status: tb.status,
                timestamp: tb.createdAt
            });
        });

        roomBookings.forEach(rb => {
            todayLiveBookings.push({
                id: rb.bookingRef || `RV-${Math.floor(100 + Math.random() * 900)}`,
                guest: `${rb.first_name} ${rb.last_name}`,
                slot: rb.checkInTime || "14:00",
                type: "Room",
                status: rb.status,
                timestamp: rb.createdAt
            });
        });


        todayLiveBookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return res.status(200).json({
            success: true,
            msg: "Dashboard data fetched successfully",
            data: {
                kpiCards,
                bestSellingDishes: bestSellingDishes,
                topChartData,
                tableOverview,
                todayLiveBookings: todayLiveBookings.slice(0, 5)
            }
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};