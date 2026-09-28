const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const cors = require("cors");

require("dotenv").config();

const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
});

app.use(corsHandler);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));

app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
