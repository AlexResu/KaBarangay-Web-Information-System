const { MongoClient } = require("mongodb");

// STEP 1: Connection string
const uri = "mongodb+srv://dev-user1:NsDXtHtpEsAGNUcd@kabarangay-system-db.qkeqxvv.mongodb.net/?appName=Kabarangay-system-db";

const client = new MongoClient(uri);

async function testConnection() {
  try {
    // STEP 2: Connect & verify
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

testConnection();
