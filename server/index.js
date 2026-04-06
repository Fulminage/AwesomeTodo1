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
app.use(express.static(buildPath));

// Express 5 catch-all fix:
// Using a regex (/.*/) instead of the string "*" to avoid any
// "Missing originalPath" errors in Express 5.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err) {
            console.error("Error sending index.html:", err.message);
            res.status(500).send("Error loading the frontend assets.");
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