const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const cors = require('cors');

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

const maintenanceRoutes = require("./routes/maintenanceRoutes")
const propertyRoutes = require("./routes/propertyRoutes")
const amenityRoutes = require("./routes/amenityRoutes")
const bookingRoutes = require("./routes/bookingRouter")
const dashboardRoutes = require("./routes/dashboardRoutes")

dbConnect();

const app = express();

// ✅ Add CORS BEFORE other middleware and routes
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  credentials: true
}));

// Then your other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.json());

//routes
//user routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//maintenance routes
app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/property", propertyRoutes)

app.use("/api/amenity", amenityRoutes)
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use('/uploads', express.static('uploads'));
//start server

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
