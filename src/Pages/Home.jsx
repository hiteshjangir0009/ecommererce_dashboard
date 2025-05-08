import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../Layout/Layout";
import { API_url_live } from '../Utils/APIconfig';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import Cookies from "js-cookie"; // at the top

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const requestOptions = {
                method: "PATCH",
                redirect: "follow"
            };

            const response = await fetch(`${API_url_live}checkout/getcheckout?role=superadmin`, requestOptions);
            const result = await response.json();
            setOrders(result.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const completedOrders = orders.filter(order => order.paymentStatus.toLowerCase() === 'completed').length;
    const pendingOrders = orders.filter(order => order.paymentStatus.toLowerCase() === 'pending').length;

    // Pie Chart Data
    const pieData = [
        { name: 'Completed', value: completedOrders },
        { name: 'Pending', value: pendingOrders }
    ];
    const COLORS = ['#00C49F', '#FFBB28'];

    // Bar Chart Data
    const statusCount = {};
    orders.forEach(order => {
        statusCount[order.paymentStatus] = (statusCount[order.paymentStatus] || 0) + 1;
    });

    const barData = Object.keys(statusCount).map(status => ({
        status,
        count: statusCount[status]
    }));

    const columns = [
        { name: "Order ID", selector: (row) => row._id, sortable: true, width: "120px" },
        { name: "Payment ID", selector: (row) => row.paymentId, sortable: true },
        { name: "Customer", selector: (row) => row.user, sortable: true },
        { name: "Total Price", selector: (row) => `₹${row.totalAmount}`, sortable: true },
        { name: "Status", selector: (row) => row.paymentStatus, sortable: true },
        { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
        {
            name: "Action",
            cell: (row) => (
                row.paymentStatus.toLowerCase() !== 'completed' ? (
                    <button
                        onClick={() => handlePaymentUpdate(row._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Mark as Completed
                    </button>
                ) : (
                    <span className="text-green-600 font-semibold">✔ Completed</span>
                )
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        
    ];


    const handlePaymentUpdate = async (checkoutId) => {
        const token = Cookies.get("Access_token"); // Get from cookie
        if (!token) {
            alert("Token missing. Please login again.");
            return;
        }
    
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
    
        const formdata = new FormData();
        formdata.append("checkoutId", checkoutId);
        formdata.append("paymentStatus", "Completed");
    
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
    
        try {
            const response = await fetch(`${API_url_live}checkout/status`, requestOptions);
            const result = await response.json();
    
            if (response.ok) {
                fetchOrders(); // Refresh table
            } else {
                console.error("Failed to update status:", result);
                alert(result.message || "Status update failed");
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Something went wrong");
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg my-20">
                <h2 className="text-2xl font-bold mb-6">Dashboard Stats</h2>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Total Orders</h3>
                        <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                        <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Completed</h3>
                        <p className="text-2xl font-bold">{completedOrders}</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Pending</h3>
                        <p className="text-2xl font-bold">{pendingOrders}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Pie Chart */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-center mb-2">Order Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-center mb-2">Orders by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Table */}
                <h2 className="text-2xl font-bold mb-4">All Orders</h2>
                <DataTable
                    columns={columns}
                    data={orders}
                    progressPending={loading}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    highlightOnHover
                    responsive
                    className="border rounded-lg"
                />
            </div>
        </Layout>
    );
};

export default Home;
