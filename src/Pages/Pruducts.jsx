import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import Layout from "../Layout/Layout";
import { API_url_live, getCookie } from "../Utils/APIconfig";

// Validation Schema
const validationSchema = Yup.object({
    product_name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than zero")
        .required("Price is required"),
    image: Yup.mixed().required("Product image is required"),
    category: Yup.string().required("Category is required"),
});

const Product = () => {
    const [products, setProducts] = useState([]); // Store product list
    const categories = ["Fruits", "Vegetables", "Dairy", "Grains"]; // Example categories

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_url_live}product/get`); // API endpoint for fetching products
            const result = await response.json();
            if (result.success) {
                setProducts(result.data); // Store fetched products in state
            } else {
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Error fetching products");
        }
    };


    // Function to handle image upload
    const handleImageUpload = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            // Set the file directly to Formik field
            setFieldValue("image", file);
        }
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("img ==>>", values.image);

        try {
            const formData = new FormData();
            formData.append("product_name", values.product_name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("product_img", values.image); // Ensure this is the correct field name for the image
            formData.append("catagory", values.category); // Adding category to FormData

            const response = await fetch(`${API_url_live}product/add`, {
                method: "POST",
                body: formData,
                redirect: "follow"
            });

            // Check if the response is ok (status code 200)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Try to parse the response as JSON
            const result = await response.json();

            if (result) {
                resetForm();
                alert("Product added successfully!");
                fetchProducts()
            } else {
                alert("Error: No result returned from server");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding product: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;
    
        const accessToken = getCookie("Access_token");
    
        if (!accessToken) {
            alert("Token not found. Please login again.");
            return;
        }
    
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
    
        const formdata = new FormData();
        formdata.append("productId", productId);
    
        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
    
        try {
            const response = await fetch("https://api.khetconnect.xyz/api/v1/product/delete", requestOptions);
            const result = await response.json();
    
            if (result.success) {
                alert("Product deleted successfully!");
                fetchProducts(); // Refresh list
            } else {
                alert(result.message || "Failed to delete product.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting product");
        }
    };
    


    // Data Table Columns
    const columns = [
        { name: "ID", selector: (row) => row._id, sortable: true, width: "80px" },
        {
            name: "Image",
            selector: (row) => row.image,
            cell: (row) => <img src={row.product_img} alt="Product" className="h-12 w-12 object-cover rounded" />,
            sortable: false,
        },
        { name: "Product Name", selector: (row) => row.product_name, sortable: true },
        { name: "Description", selector: (row) => row.description, sortable: true },
        { name: "Price (₹)", selector: (row) => row.price, sortable: true },
        { name: "Category", selector: (row) => row.catagory, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                >
                    Delete
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        
    ];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg my-20">
                <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

                {/* Form to Add Product */}
                <Formik
                    initialValues={{
                        product_name: "",
                        description: "",
                        price: "",
                        image: "",
                        category: "", // Add category field to initial values
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium">Product Name</label>
                                <Field
                                    type="text"
                                    name="product_name"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="product_name"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <Field
                                    type="text"
                                    name="description"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium">Price</label>
                                <Field
                                    type="number"
                                    name="price"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="price"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium">Category</label>
                                <Field as="select" name="category" className="w-full p-2 border rounded">
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="category"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => handleImageUpload(event, setFieldValue)}
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage
                                    name="image"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Image Preview */}
                            {values.image && (
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(values.image)} // Create a preview URL for the file
                                        alt="Preview"
                                        className="h-24 w-24 object-cover rounded border"
                                    />
                                </div>
                            )}


                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Product"}
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Product List Table */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Product List</h3>
                    <DataTable
                        columns={columns}
                        data={products.slice().reverse()}
                        pagination
                        highlightOnHover
                        fixedHeader
                        fixedHeaderScrollHeight="300px"
                        responsive
                        className="border rounded-lg"
                        
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Product;
