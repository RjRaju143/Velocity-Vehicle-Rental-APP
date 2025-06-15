
'use server';

import { getDb } from '@/lib/db';

export async function resetDatabase(): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  try {
    await db.exec('DELETE FROM bookings');
    await db.exec('DELETE FROM users');
    // The line to reset autoincrement sequence has been removed as per user request.
    // await db.exec("DELETE FROM sqlite_sequence WHERE name='users';");

    console.log('Database reset: All records from users and bookings tables have been deleted.');
    return { success: true, message: 'Database has been reset successfully. All user and booking data cleared.' };
  } catch (err) {
    console.error('Error resetting database:', err);
    return { success: false, message: `Failed to reset database: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

