
'use server';

import { getDb } from '@/lib/db';
import type { Booking } from '@/lib/types';

export async function addBookingDb(bookingData: Omit<Booking, 'id' | 'bookedAt'> & { userId: number }): Promise<Booking | { error: string }> {
  const db = await getDb();
  const bookedAt = new Date().toISOString();
  const bookingId = `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;

  const newBooking: Booking = {
    ...bookingData,
    id: bookingId,
    bookedAt,
  };

  try {
    await db.run(
      'INSERT INTO bookings (id, userId, vehicleId, vehicleName, vehicleImage, startDate, endDate, totalCost, numDays, bookedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      newBooking.id,
      newBooking.userId,
      newBooking.vehicleId,
      newBooking.vehicleName,
      newBooking.vehicleImage,
      newBooking.startDate,
      newBooking.endDate,
      newBooking.totalCost,
      newBooking.numDays,
      newBooking.bookedAt
    );
    return newBooking;
  } catch (err) {
    console.error('Error adding booking to DB:', err);
    return { error: 'Failed to save booking to the database. Please try again.' };
  }
}

export async function getBookingsDb(userId: number): Promise<Booking[] | { error: string }> {
  const db = await getDb();
  try {
    const bookings = await db.all<Booking[]>('SELECT * FROM bookings WHERE userId = ? ORDER BY bookedAt DESC', userId);
    return bookings;
  } catch (err) {
    console.error('Error fetching bookings from DB:', err);
    return { error: 'Failed to retrieve bookings from the database.' };
  }
}

