import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import Layout from "../Layout/Layout";
import { API_url_live, getCookie } from "../Utils/APIconfig";

// Validation Schema
const validationSchema = Yup.object({
    name: Yup.string().required("Farmer name is required"),
    address: Yup.string().required("Address is required"),
    contact: Yup.string()
        .matches(/^\d{10}$/, "Contact must be a 10-digit number")
        .required("Contact number is required"),
    landSize: Yup.string().required("Land size is required"),
    crops: Yup.string().required("What you grow is required"),
});

const Farmer = () => {
    const [farmers, setFarmers] = useState([]);

    useEffect(() => {
        getFarmers();
    }, []);

    // API request to add farmer
    const addFarmer = async (values, { setSubmitting, resetForm }) => {
        const formdata = new FormData();
        formdata.append("name", values.name);
        formdata.append("phone", values.contact);
        formdata.append("address", values.address);
        formdata.append("landSize", values.landSize);
        formdata.append("crops", values.crops);

        try {
            const response = await fetch(`${API_url_live}farmer/add`, {
                method: "POST",
                body: formdata,
            });
            const result = await response.json();
            console.log(result);
            alert("Farmer added successfully!");
            resetForm();
            getFarmers(); // Refresh farmer list
        } catch (error) {
            console.error(error);
            alert("Error adding farmer");
        } finally {
            setSubmitting(false);
        }
    };

    const getFarmers = async () => {
        try {
            const response = await fetch(`${API_url_live}farmer/all`, {
                method: "GET",
            });
            const result = await response.json();
            console.log(result);
            
            setFarmers(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFarmer = async (farmerId) => {
        const token = getCookie("Access_token");
        if (!token) {
            alert("You are not authenticated. Please log in.");
            return;
        }
    
        const formdata = new FormData();
        formdata.append("id", farmerId);
    
        try {
            const response = await fetch(`${API_url_live}farmer/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // No need to manually set Content-Type for FormData
                },
                body: formdata,
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Farmer deleted successfully!");
                getFarmers(); // Refresh list
            } else {
                alert(result?.message || "Error deleting farmer");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting farmer");
        }
    };
    
    

    const columns = [
        { name: "Farmer ID", selector: (row) => row._id, sortable: true },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Contact", selector: (row) => row.phone, sortable: true },
        { name: "Address", selector: (row) => row.address, sortable: true },
        { name: "Land Size (acres)", selector: (row) => row.landSize, sortable: true },
        { name: "What You Grow", selector: (row) => row.crops, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => deleteFarmer(row._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <Layout>
            <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg my-20">
                <h2 className="text-2xl font-bold mb-4">Farmer Management</h2>

                <Formik
                    initialValues={{ name: "", address: "", contact: "", landSize: "", crops: "" }}
                    validationSchema={validationSchema}
                    onSubmit={addFarmer}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Farmer Name</label>
                                <Field type="text" name="name" className="w-full p-2 border rounded" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <Field type="text" name="address" className="w-full p-2 border rounded" />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Contact Number</label>
                                <Field type="text" name="contact" className="w-full p-2 border rounded" />
                                <ErrorMessage name="contact" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Land Size (acres)</label>
                                <Field type="text" name="landSize" className="w-full p-2 border rounded" />
                                <ErrorMessage name="landSize" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">What You Grow</label>
                                <Field type="text" name="crops" className="w-full p-2 border rounded" />
                                <ErrorMessage name="crops" component="div" className="text-red-500 text-sm" />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Farmer"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Farmers List</h3>
                    <DataTable
                        columns={columns}
                        data={farmers}
                        pagination
                        highlightOnHover
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        responsive
                        className="border rounded-lg"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Farmer;
