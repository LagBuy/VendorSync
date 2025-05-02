import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

// Sample color palette for categories
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [products, setProducts] = useState([]); // Store products

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://your-backend-api/products"); // Replace with your backend API URL
      const data = await response.json();
      setProducts(data); // Update products state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to calculate total sales per category
  const calculateCategoryDistribution = (products) => {
    const categorySales = {};

    // Group products by category and sum their prices
    products.forEach((product) => {
      if (!categorySales[product.category]) {
        categorySales[product.category] = 0;
      }
      categorySales[product.category] += product.price; // Assuming price is the sales amount
    });

    // Convert the grouped data into an array for the PieChart
    const data = Object.keys(categorySales).map((category) => ({
      name: category,
      value: categorySales[category],
    }));

    return data;
  };

  // Use effect to fetch products when the component mounts
  useEffect(() => {
    fetchProducts(); // Fetch the products on mount
  }, []); // Empty dependency array means this will run once on component mount

  // Use effect to update category distribution whenever the products change
  useEffect(() => {
    if (products.length > 0) {
      const data = calculateCategoryDistribution(products);
      setCategoryData(data); // Recalculate category data and update the chart
    }
  }, [products]); // Re-run this effect whenever `products` changes

  // Function to handle adding or updating a product
  const handleProductChange = async (product) => {
    try {
      if (product.id) {
        // If the product has an `id`, we update it (PUT request)
        const response = await fetch(
          `https://your-backend-api/products/${product.id}`, // Replace with your API endpoint
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );
        if (!response.ok) {
          throw new Error("Error updating product");
        }
        const updatedProduct = await response.json();
        const updatedProducts = products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        );
        setProducts(updatedProducts); // Update the products state
      } else {
        // If the product does not have an `id`, we add a new product (POST request)
        const response = await fetch("https://your-backend-api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });
        if (!response.ok) {
          throw new Error("Error adding product");
        }
        const newProduct = await response.json();
        setProducts([...products, newProduct]); // Add the new product to the state
      }
    } catch (error) {
      console.error("Error handling product change:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Category Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
