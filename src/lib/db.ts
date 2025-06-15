
'use server';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';

// Singleton database instance
let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), 'velocity.sqlite');
    console.log(`Database path: ${dbPath}`); // For debugging

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Run migrations if tables don't exist
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL 
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        userId INTEGER NOT NULL,
        vehicleId TEXT NOT NULL,
        vehicleName TEXT NOT NULL,
        vehicleImage TEXT,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        totalCost REAL NOT NULL,
        numDays INTEGER NOT NULL,
        bookedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings (userId);
      CREATE INDEX IF NOT EXISTS idx_bookings_bookedAt ON bookings (bookedAt);
    `);
    console.log("Database tables and indexes checked/created.");
  }
  return dbInstance;
}
