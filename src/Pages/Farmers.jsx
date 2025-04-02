import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import Layout from "../Layout/Layout";
import { API_url_live } from "../Utils/APIconfig";

// Validation Schema
const validationSchema = Yup.object({
    name: Yup.string().required("Farmer name is required"),
    address: Yup.string().required("Address is required"),
    contact: Yup.string()
        .matches(/^\d{10}$/, "Contact must be a 10-digit number")
        .required("Contact number is required"),
});

const Farmer = () => {
    const [farmers, setFarmers] = useState([]);

    // Fetch farmers list on component mount
    useEffect(() => {
        getFarmers();
    }, []);

    // API request to add farmer
    const addFarmer = async (values, { setSubmitting, resetForm }) => {
        const formdata = new FormData();
        formdata.append("name", values.name);
        formdata.append("phone", values.contact);
        formdata.append("address", values.address);

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

    // API request to get farmers list
    const getFarmers = async () => {
        try {
            const response = await fetch(`${API_url_live}farmer/all`, {
                method: "GET",
            });
            const result = await response.json();
            console.log("result",result.data);
            
            setFarmers(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Data Table Columns
    const columns = [
        { name: "Farmer ID", selector: (row) => row._id, sortable: true },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Contact", selector: (row) => row.phone, sortable: true },
        { name: "Address", selector: (row) => row.address, sortable: true },
    ];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg my-20">
                <h2 className="text-2xl font-bold mb-4">Farmer Management</h2>
                
                <Formik
                    initialValues={{ name: "", address: "", contact: "" }}
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