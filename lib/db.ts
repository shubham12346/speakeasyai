// lib/db.js
import { Client } from "pg";

let client: any;

const getDbClient = () => {
  if (client) {
    return client; // Return existing connection
  }

  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client.connect(); // Establish a new connection if it's not already connected
  return client;
};

export { getDbClient };
