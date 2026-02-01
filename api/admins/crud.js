import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = "mongodb+srv://dev-user1:NsDXtHtpEsAGNUcd@kabarangay-system-db.qkeqxvv.mongodb.net/?appName=Kabarangay-system-db";

const client = new MongoClient(uri);
const DB_NAME = "Kabarangay-system-db";
const COLLECTION_NAME = "admins";



// POST - Login admin
export async function loginAdmin(username, password) {
  const database = client.db(DB_NAME);
  const collection = database.collection(COLLECTION_NAME);
  console.log("Attempting login for username:", username);
  
  try {
    const admin = await collection.findOne({ username: username });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (isMatch) {
        console.log("Login successful for username:", username);
        return { success: true, admin: admin };
      } else {
        console.log("Login failed for username not matched:", username);
        return { success: false, message: "Invalid username or password" };
      }
    } else {
      console.log("Login failed for username:", username);
      return { success: false, message: "Invalid username or password" };
    }
  } catch (err) {
    console.error("Error during admin login:", err);
    throw err;
  }
}
export async function getAdminByUsername(username) {
  const database = client.db(DB_NAME);
  const collection = database.collection(COLLECTION_NAME);
  console.log("Fetching administrator with username:", username);
  
  try {
    const admin = await collection.findOne({ username: username });
    if (admin) {
      console.log("Administrator found:", admin);
    } else {
      console.log("No administrator found with username:", username);
    }
    return admin;
  } catch (err) {
    console.error("Error retrieving administrator:", err);
    throw err;
  }
}
