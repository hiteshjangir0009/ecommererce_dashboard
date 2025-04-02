import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../Layout/Layout";
import {API_url_live} from '../Utils/APIconfig'

const Home = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from API
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
            setOrders(result.data)
            console.log(result.data)

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Define table columns
    const columns = [
        { name: "Order ID", selector: (row) => row._id, sortable: true, width: "120px" },
        { name: "Customer", selector: (row) => row.user, sortable: true },
        { name: "Total Price", selector: (row) => `$${row.totalAmount}`, sortable: true },
        { name: "Status", selector: (row) => row.paymentStatus, sortable: true },
        { name: "Date", selector: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    ];

    return (
        <Layout>

            <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg my-20">
                <h2 className="text-2xl font-bold mb-4">All Orders</h2>

                {/* Orders Table */}
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
