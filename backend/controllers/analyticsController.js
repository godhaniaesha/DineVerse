import { RoomReservation } from "../models/RoomReservation.js";
import { TableReservation } from "../models/TableReservation.js";
import { Order } from "../models/Order.js";
import Room from "../models/Room.js";
import { ThrowError } from "../utils/Error.utils.js";

export const getAnalytics = async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        let startDate, previousStartDate, previousEndDate;

        if (period === 'week') {
            startDate = new Date(startOfToday);
            startDate.setDate(startDate.getDate() - 7);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 7);
            previousEndDate = new Date(startDate);
        } else if (period === 'month') {
            startDate = new Date(startOfToday);
            startDate.setDate(startDate.getDate() - 30);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 30);
            previousEndDate = new Date(startDate);
        } else if (period === 'year') {
            startDate = new Date(startOfToday);
            startDate.setFullYear(startDate.getFullYear() - 1);
            previousStartDate = new Date(startDate);
            previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
            previousEndDate = new Date(startDate);
        }

        const orderRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: { $in: ["Active", "Completed"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const currentRevenue = orderRevenue[0]?.total || 0;

        const prevOrderRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousStartDate, $lt: previousEndDate },
                    status: { $in: ["Active", "Completed"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const previousRevenue = prevOrderRevenue[0]?.total || 0;
        const revenueChange = previousRevenue > 0
            ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
            : 0;

        const totalReservations = await Order.countDocuments({
            createdAt: { $gte: startDate },
            status: "Completed"
        });

        const avgReservationValue = totalReservations > 0
            ? Math.round(currentRevenue / totalReservations)
            : 0;

        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Room.countDocuments({
            status: { $in: ['Occupied', 'Reserved'] }
        });
        const occupancyRate = totalRooms > 0
            ? Math.round((occupiedRooms / totalRooms) * 100)
            : 0;

        const totalBookings = await RoomReservation.countDocuments({
            checkIn: { $gte: startDate }
        });
        const noShows = await RoomReservation.countDocuments({
            checkIn: { $gte: startDate },
            status: "No Show"
        });
        const noShowRate = totalBookings > 0
            ? ((noShows / totalBookings) * 100).toFixed(1)
            : 0;

        const weeklyRevenueTrend = await generateRevenueTrend(7);

        const monthlyRevenueTrend = await generateMonthlyRevenueTrend();

        const analyticsData = {
            kpiCards: [
                {
                    label: period === 'week' ? "Weekly Revenue" : period === 'month' ? "Monthly Revenue" : "Yearly Revenue",
                    value: currentRevenue >= 100000
                        ? `₹${(currentRevenue / 100000).toFixed(1)}L`
                        : currentRevenue >= 1000
                            ? `₹${(currentRevenue / 1000).toFixed(1)}K`
                            : `₹${currentRevenue}`,
                    trend: `${revenueChange >= 0 ? '+' : ''}${revenueChange}% vs last ${period}`,
                    isPositive: revenueChange >= 0
                },
                {
                    label: "Avg Reservation Value",
                    value: avgReservationValue >= 1000
                        ? `₹${(avgReservationValue / 1000).toFixed(1)}K`
                        : `₹${avgReservationValue}`,
                    trend: "Per booking",
                    isPositive: true
                },
                {
                    label: "Occupancy Rate",
                    value: `${occupancyRate}%`,
                    trend: `${occupiedRooms}/${totalRooms} rooms`,
                    isPositive: occupancyRate >= 70
                },
                {
                    label: "No-Show Rate",
                    value: `${noShowRate}%`,
                    trend: `${noShows} of ${totalBookings} bookings`,
                    isPositive: noShowRate < 5
                }
            ],
            weeklyRevenue: weeklyRevenueTrend,
            monthlyRevenue: monthlyRevenueTrend
        };

        res.status(200).json({
            success: true,
            msg: "Analytics data fetched successfully",
            data: analyticsData
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

const generateRevenueTrend = async (days) => {
    const trend = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayRevenue = await calculateDayRevenue(date, nextDate);

        trend.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: dayRevenue
        });
    }

    return trend;
};

const generateMonthlyRevenueTrend = async () => {
    const trend = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const monthRevenue = await calculateDayRevenue(date, nextMonth);

        trend.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            revenue: monthRevenue
        });
    }

    return trend;
};

const calculateDayRevenue = async (startDate, endDate) => {
    const orderRev = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lt: endDate },
                status: { $in: ["Active", "Completed"] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
            }
        }
    ]);

    return orderRev[0]?.total || 0;
};
