import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaRupeeSign,
  FaMoon,
  FaSun,
  FaSearch,
  FaTimes,
  FaBell,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";
import { AiOutlineBars } from "react-icons/ai";
import { HiOutlineViewGrid } from "react-icons/hi";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { id: "#1", name: "Brandon Jacob", price: "₹2,500.00", status: "Approved" },
  { id: "#2", name: "Bridie Kessler", price: "₹4,200.00", status: "Pending" },
  {
    id: "#3",
    name: "Ashleigh Langosh",
    price: "₹1,100.00",
    status: "Approved",
  },
  { id: "#4", name: "Angus Grady", price: "₹3,800.00", status: "Rejected" },
  { id: "#5", name: "Raheem Lehner", price: "₹5,000.00", status: "Approved" },
  { id: "#6", name: "David Rai", price: "₹2,200.00", status: "Approved" },
  { id: "#7", name: "Neha Rani", price: "₹6,500.00", status: "Rejected" },
  { id: "#8", name: "Raj Malhotra", price: "₹3,000.00", status: "Approved" },
  { id: "#9", name: "Ayesha Khan", price: "₹4,600.00", status: "Pending" },
  { id: "#10", name: "Rohit Sharma", price: "₹7,500.00", status: "Approved" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-600 dark:text-white";
    default:
      return "bg-gray-200";
  }
};

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState(145);
  const [usersRevenue, setUsersRevenue] = useState(3264);
  const [advisors, setAdvisors] = useState(245);
  const [advisorsRevenue, setAdvisorsRevenue] = useState(4264);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => prev + Math.floor(Math.random() * 3));
      setUsersRevenue((prev) => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const usersChartData = [
    { name: "Jan", users: 30, usersRevenue: 400 },
    { name: "Feb", users: 50, usersRevenue: 600 },
    { name: "Mar", users: 45, usersRevenue: 800 },
    { name: "Apr", users: 60, usersRevenue: 900 },
    { name: "May", users: 80, usersRevenue: 1000 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAdvisors((prev) => prev + Math.floor(Math.random() * 3));
      setAdvisorsRevenue((prev) => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const advisorsChartData = [
    { name: "Jan", advisors: 40, advisorsRevenue: 500 },
    { name: "Feb", advisors: 60, advisorsRevenue: 700 },
    { name: "Mar", advisors: 55, advisorsRevenue: 900 },
    { name: "Apr", advisors: 70, advisorsRevenue: 1000 },
    { name: "May", advisors: 90, advisorsRevenue: 2000 },
  ];

  const iconColorClass = darkMode ? "text-white" : "text-gray-800";
  const searchInputClass = `pl-10 pr-4 py-2 rounded-md border w-full ${
    darkMode
      ? "dark:border-gray-700 bg-gray-700 text-white placeholder-gray-300"
      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
  }`;

  const filtered = salesData.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.product || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.status || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`flex justify-between items-center px-6 py-4 shadow relative z-20 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <FaTimes className={`text-xl ${iconColorClass}`} />
            ) : (
              <AiOutlineBars className={`text-xl ${iconColorClass}`} />
            )}
          </button>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-300">
            MKB Dashboard
          </div>
        </div>

        <div className="hidden md:flex gap-4 items-center relative">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className={searchInputClass}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-300" />
          </div>

          <FaBell
            className={`text-xl cursor-pointer ${iconColorClass}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowComments(false);
              setShowProfile(false);
            }}
          />
          {showNotifications && (
            <div className="absolute right-16 top-14 w-60 bg-gray-800 text-white shadow-lg rounded-md z-10 p-4">
              <p className="text-sm font-semibold">Notifications</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>You have 3 new users</li>
                <li>Revenue increased by ₹500</li>
                <li>System update at 3PM</li>
              </ul>
            </div>
          )}

          <FaCommentDots
            className={`text-xl cursor-pointer ${iconColorClass}`}
            onClick={() => {
              setShowComments(!showComments);
              setShowNotifications(false);
              setShowProfile(false);
            }}
          />
          {showComments && (
            <div className="absolute right-16 top-14 w-60 bg-gray-800 text-white shadow-lg rounded-md z-10 p-4">
              <p className="text-sm font-semibold">Comments</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>Admin: Review the dashboard UI</li>
                <li>User: Feedback received</li>
                <li>Team: Meeting at 5PM</li>
              </ul>
            </div>
          )}

          <FaUserCircle
            className={`text-2xl cursor-pointer ${iconColorClass}`}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
              setShowComments(false);
            }}
          />
          {showProfile && (
            <div className="absolute right-16 top-14 w-60 bg-gray-800 text-white shadow-lg rounded-md z-10 p-4">
              <ul className="text-sm space-y-2">
                <li className="cursor-pointer hover:text-blue-400">
                  Edit Profile
                </li>
                <li className="cursor-pointer hover:text-red-400">Logout</li>
              </ul>
            </div>
          )}

          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"}{" "}
            Mode
          </button>
        </div>

        {showMobileMenu && (
          <div
            className={`absolute top-16 left-0 w-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } p-4 md:hidden z-10 shadow-lg`}
          >
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                className={searchInputClass}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-300" />
            </div>
            <div className="flex gap-4 mb-4">
              <FaBell
                className={`text-xl cursor-pointer ${iconColorClass}`}
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setShowComments(false);
                  setShowProfile(false);
                }}
              />
              <FaCommentDots
                className={`text-xl cursor-pointer ${iconColorClass}`}
                onClick={() => {
                  setShowComments((prev) => !prev);
                  setShowNotifications(false);
                  setShowProfile(false);
                }}
              />
              <FaUserCircle
                className={`text-2xl cursor-pointer ${iconColorClass}`}
                onClick={() => {
                  setShowProfile((prev) => !prev);
                  setShowNotifications(false);
                  setShowComments(false);
                }}
              />
            </div>
            {showNotifications && (
              <div className="mt-2 w-full bg-gray-800 text-white shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Notifications</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>You have 3 new users</li>
                  <li>Revenue increased by ₹500</li>
                  <li>System update at 3PM</li>
                </ul>
              </div>
            )}
            {showComments && (
              <div className="mt-2 w-full bg-gray-800 text-white shadow-md rounded-md p-3">
                <p className="text-sm font-semibold">Comments</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>Admin: Review the dashboard UI</li>
                  <li>User: Feedback received</li>
                  <li>Team: Meeting at 5PM</li>
                </ul>
              </div>
            )}
            {showProfile && (
              <div className="mt-2 w-full bg-gray-800 text-white shadow-md rounded-md p-3">
                <ul className="text-sm space-y-2">
                  <li className="cursor-pointer hover:text-blue-400">
                    Edit Profile
                  </li>
                  <li className="cursor-pointer hover:text-red-400">Logout</li>
                </ul>
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="w-full mt-4 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              {darkMode ? (
                <FaSun className="inline mr-2" />
              ) : (
                <FaMoon className="inline mr-2" />
              )}
              {darkMode ? "Light" : "Dark"} Mode
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        <aside
          className={`hidden md:block w-64 ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          } shadow-lg`}
        >
          <nav className="mt-8">
            <ul>
              <li
                className={`flex items-center gap-2 px-6 py-3 cursor-pointer font-semibold transition-colors duration-150 ${
                  darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200 hover:text-blue-600"
                }`}
                onClick={() => setActivePage("dashboard")}
              >
                <HiOutlineViewGrid className="text-blue-500" /> Dashboard
              </li>
              <li
                className={`flex items-center gap-2 px-6 py-3 cursor-pointer font-semibold transition-colors duration-150 ${
                  darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200 hover:text-blue-600"
                }`}
                onClick={() => setActivePage("action")}
              >
                <FaUsers className="text-green-500" /> Action
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          {activePage === "dashboard" && (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold mb-6">
                Dashboard
              </h1>
              {/* Existing Dashboard Content Here (users, advisors, charts) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div
                  className={`p-4 md:p-6 rounded-lg shadow-md ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 md:p-4 bg-blue-100 dark:bg-blue-700 rounded-full">
                      <FaUsers className="text-2xl text-blue-600 dark:text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium">Users</p>
                      <p className="text-2xl font-bold">{users}</p>
                      <p className="text-green-500 text-sm">Live update</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 md:p-6 rounded-lg shadow-md ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 md:p-4 bg-green-100 dark:bg-green-700 rounded-full">
                      <FaRupeeSign className="text-2xl text-green-600 dark:text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium">Revenue</p>
                      <p className="text-2xl font-bold">
                        ₹{usersRevenue.toLocaleString()}{" "}
                        <span className="text-green-500 text-sm">
                          Live update
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 md:p-6 rounded-lg shadow-md mb-8 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  User & Revenue Analytics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={usersChartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="usersRevenue"
                      stroke="#22c55e"
                      name="Revenue"
                    />
                    <CartesianGrid
                      stroke={darkMode ? "#444" : "#ccc"}
                      strokeDasharray="5 5"
                    />
                    <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                    <YAxis stroke={darkMode ? "#fff" : "#000"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div
                  className={`p-4 md:p-6 rounded-lg shadow-md ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 md:p-4 bg-blue-100 dark:bg-blue-700 rounded-full">
                      <FaUsers className="text-2xl text-blue-600 dark:text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium">Advisors</p>
                      <p className="text-2xl font-bold">{advisors}</p>
                      <p className="text-green-500 text-sm">Live update</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 md:p-6 rounded-lg shadow-md ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-3 md:p-4 bg-green-100 dark:bg-green-700 rounded-full">
                      <FaRupeeSign className="text-2xl text-green-600 dark:text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium">Revenue</p>
                      <p className="text-2xl font-bold">
                        ₹{advisorsRevenue.toLocaleString()}{" "}
                        <span className="text-green-500 text-sm">
                          Live update
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 md:p-6 rounded-lg shadow-md mb-8 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Advisor & Revenue Analytics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={advisorsChartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="advisors"
                      stroke="#3b82f6"
                      name="Advisors"
                    />
                    <Line
                      type="monotone"
                      dataKey="advisorsRevenue"
                      stroke="#22c55e"
                      name="Revenue"
                    />
                    <CartesianGrid
                      stroke={darkMode ? "#444" : "#ccc"}
                      strokeDasharray="5 5"
                    />
                    <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                    <YAxis stroke={darkMode ? "#fff" : "#000"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div
                className={`p-4 sm:p-6 rounded-2xl shadow-md ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                {/* Heading */}
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    Recent Sales{" "}
                    <span className="text-primary text-xl font-medium">
                      | Today
                    </span>
                  </h2>
                </div>

                {/* Page Size & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium">
                      <select
                        className="w-full md:w-auto p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value));
                          setPage(1);
                        }}
                      >
                        {[5, 10, 20].map((size) => (
                          <option key={size}>{size}</option>
                        ))}
                      </select>
                      <span className="ml-2">entries per page</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full md:w-60 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b dark:border-gray-600">
                        <th className="py-2">#</th>
                        <th>Customer</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((sale, idx) => (
                        <tr
                          key={idx}
                          className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td className="py-2">{sale.id}</td>
                          <td>{sale.name}</td>
                          <td>{sale.price}</td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
                                sale.status
                              )}`}
                            >
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {displayed.map((sale, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg shadow border dark:border-gray-700 ${
                        darkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        #{sale.id} - {sale.name}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> {sale.price}
                      </p>
                      <p className="text-sm">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
                            sale.status
                          )}`}
                        >
                          {sale.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                  <span className="mb-2 sm:mb-0">
                    Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filtered.length)} of{" "}
                    {filtered.length} entries
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "action" && (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold mb-6">
                Advisor Action Panel
              </h1>

              <div
                className={`p-4 md:p-6 rounded-lg shadow-md mb-8 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Manage Advisors</h2>
                <ul className="space-y-2">
                  <li className="p-3 rounded-md bg-blue-100 dark:bg-blue-700 text-sm">
                    ✔️ Advisor 1 - Active
                  </li>
                  <li className="p-3 rounded-md bg-blue-100 dark:bg-blue-700 text-sm">
                    ✔️ Advisor 2 - Active
                  </li>
                </ul>
              </div>

              <div
                className={`p-4 md:p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">Pending Advisors</h2>
                <ul className="space-y-2">
                  <li className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-700 text-sm">
                    ⏳ Advisor 3 - Pending Approval
                  </li>
                  <li className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-700 text-sm">
                    ⏳ Advisor 4 - Awaiting Verification
                  </li>
                </ul>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
