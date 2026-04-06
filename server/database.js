require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const dns = require("dns");

// Mandatory fix for local networks that fail to resolve the MongoDB cluster
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_URI;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

let client;

const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = await MongoClient.connect(uri, options);
      console.log("Successfully connected to MongoDB (database: todosdb)");
    } catch (error) {
      console.error("Failed to connect to MongoDB. Likely a DNS or IP whitelist issue.");
      console.error("Error Detail:", error.message);
      throw error;
    }
  }
  return client;
};

const getConnectedClient = () => client;

module.exports = { connectToMongoDB, getConnectedClient };