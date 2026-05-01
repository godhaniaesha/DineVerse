import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dashboardService from "../../services/dashboardService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    kpiCards: [],
    bestSellingDishes: [],
    topChartData: [],
    tableOverview: [],
    todayLiveBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardData();

      if (response.success) {
        setDashboardData({
          kpiCards: Array.isArray(response.data.kpiCards)
            ? response.data.kpiCards
            : [],
          bestSellingDishes: Array.isArray(response.data.bestSellingDishes)
            ? response.data.bestSellingDishes
            : [],
          topChartData: Array.isArray(response.data.topChartData)
            ? response.data.topChartData
            : [],
          tableOverview: Array.isArray(response.data.tableOverview)
            ? response.data.tableOverview
            : [],
          todayLiveBookings: Array.isArray(response.data.todayLiveBookings)
            ? response.data.todayLiveBookings
            : [],
        });
      } else {
        setError(response.msg || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.message === "Authentication failed. Please login again.") {
        setError(
          "Authentication failed. Please login again to access the dashboard.",
        );
      } else if (
        error.message === "No authentication token found. Please login again."
      ) {
        setError("Please login to access the dashboard.");
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Dashboard Overview</h2>
        <p className="ad_p">
          Track key admin metrics across bookings, rooms and menu performance.
        </p>
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError =
      error.includes("Authentication failed") || error.includes("Please login");

    return (
      <div className="ad_page">
        <h2 className="ad_h2">Dashboard Overview</h2>
        <p className="ad_p">
          Track key admin metrics across bookings, rooms and menu performance.
        </p>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ color: "#ff6b6b", marginBottom: "16px" }}>{error}</div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!isAuthError && (
              <button
                className="rooms__btn rooms__btn--primary"
                onClick={fetchDashboardData}
              >
                Retry
              </button>
            )}
            {isAuthError && (
              <button
                className="rooms__btn rooms__btn--primary"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("authUser");
                  localStorage.removeItem("adminRole");
                  localStorage.removeItem("adminName");
                  navigate("/auth", { replace: true });
                }}
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Dashboard Overview</h2>
      <p className="ad_p">
        Track key admin metrics across bookings, rooms and menu performance.
      </p>

      <div className="ad_cards_grid" style={{ marginTop: 16 }}>
        {dashboardData.kpiCards.map((item, index) => (
          <article key={`${item.label}-${index}`} className="ad_card">
            <div className="ad_card__label">{item.label}</div>
            <div className="ad_card__value">{item.value}</div>
            <div className="ad_card__meta">{item.trend}</div>
          </article>
        ))}
      </div>

      <div
        className="ad_two_col"
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          gap: "16px",
        }}
      >
        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Best Selling Dishes</h3>
          <ul className="ad_list">
            {dashboardData.bestSellingDishes.map((item, index) => (
              <li
                key={item.name || index}
                className="ad_list__item ad_list__item--between"
              >
                <div>
                  <div style={{ color: "#f3ede2", fontWeight: 600 }}>
                    #{index + 1} {item.name}
                  </div>
                  <div className="ad_card__meta">
                    High demand during prime service hours
                  </div>
                </div>
                <span className="ad_chip">{item.orders} orders</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ad_card" style={{ overflow: "hidden" }}>
          <h3 className="ad_card__title">Top Menu Items</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.topChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ddd"
                  vertical={false}
                />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: "rgba(212,163,115,0.08)" }} // soft hover highlight
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    padding: "8px 12px",
                    backdropFilter: "blur(6px)",
                  }}
                  labelStyle={{
                    color: "#888",
                    fontSize: "11px",
                    marginBottom: "2px",
                  }}
                  itemStyle={{
                    color: "#333",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                  formatter={(value) => `${value} orders`}
                />{" "}
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                {dashboardData.bestSellingDishes.map((dish, index) => {
                  const colors = ["#d4a373", "#ff6b6b", "#4ecdc4", "#a78bfa"];
                  return (
                    <Line
                      key={dish.name || index}
                      type="monotone"
                      dataKey={dish.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Table Status</h3>
        <div className="ad_cards_grid" style={{ marginTop: 12 }}>
          {dashboardData.tableOverview.map((item, index) => (
            <article
              key={`${item.area}-${item.table}-${index}`}
              className="ad_card"
            >
              <div className="ad_card__label">
                {item.area} - {item.table}
              </div>
              <div className="ad_card__value">{item.seats} persons</div>
              <div className="ad_card__meta">{item.status}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Today Live Bookings</h3>
        <div className="ad_table_wrap">
          <table className="ad_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Slot</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.todayLiveBookings.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.guest}</td>
                  <td>{row.slot}</td>
                  <td>{row.type}</td>
                  <td>
                    <span className="ad_chip">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
