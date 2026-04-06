const { getConnectedClient } = require("../database");

const getCollection = () => {
  const client = getConnectedClient();
  if (!client) {
    throw new Error("Client is not connected. Call connectToMongoDB first.");
  }
  return client.db("todosdb").collection("todos");
};

module.exports = { getCollection };
