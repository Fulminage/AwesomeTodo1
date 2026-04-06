require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./database");

const app = express();
app.use(express.json());

// API Routes
const router = require("./routes");
app.use("/api", router);

// Serve static assets from the client build folder
const buildPath = path.resolve(__dirname, "..", "client", "build");
console.log("Serving static assets from:", buildPath);

app.use(express.static(buildPath));

// Express 5 catch-all fix for SPA routing
app.get(/.*/, (req, res) => {
    const indexPath = path.join(buildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error(`Error sending index.html at ${indexPath}:`, err.message);
            res.status(500).send("Error loading the frontend assets. Please ensure the client is built.");
        }
    });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();