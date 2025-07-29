import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// WARNING: Hardcoding credentials is NOT recommended for production.
// Use environment variables (e.g., process.env.MONGODB_URI) instead.
const uri = "mongodb+srv://vgxurl:<123>@xyz.6qtinr9.mongodb.net/?retryWrites=true&w=majority&appName=xyz";
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db("sample_mflix"); // Using the database name from the provided URI
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const chats = await db.collection("chats").find({}).sort({ timestamp: 1 }).toArray();
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const { message, sender, timestamp, userIp } = await req.json();

    if (!message || !sender || !timestamp || !userIp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db.collection("chats").insertOne({
      message,
      sender,
      timestamp: new Date(timestamp), // Ensure timestamp is a Date object
      userIp,
    });

    return NextResponse.json({ message: "Message sent", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
