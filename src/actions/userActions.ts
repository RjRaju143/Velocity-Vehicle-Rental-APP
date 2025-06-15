
'use server';

import { getDb } from '@/lib/db';
import type { User } from '@/lib/types';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function registerUser(name: string, email: string, password: string): Promise<User | { error: string }> {
  const db = await getDb();
  try {
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
    if (existingUser) {
      return { error: 'Email already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      name,
      email.toLowerCase(),
      hashedPassword
    );

    if (result.changes === 1 && result.lastID) {
      return { id: result.lastID, name, email: email.toLowerCase() };
    }
    console.error('Registration failed: DB insert result issue. Details:', result);
    return { error: 'Registration failed. Please try again or contact support if the issue persists.' };
  } catch (err) {
    console.error('Registration error:', err);
    return { error: 'An unexpected error occurred during registration.' };
  }
}

export async function loginUser(email: string, password: string): Promise<User | { error: string }> {
  const db = await getDb();
  try {
    // Fetch user with password hash, aliasing 'password' to 'passwordHash'
    const userWithPassword = await db.get<{ id: number; name: string; email: string; passwordHash: string }>(
      'SELECT id, name, email, password AS passwordHash FROM users WHERE email = ?',
      email.toLowerCase()
    );
    
    if (!userWithPassword || !userWithPassword.passwordHash) {
      return { error: 'Invalid email or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, userWithPassword.passwordHash);

    if (passwordMatch) {
      // Return user object without the password hash
      const { passwordHash: _, ...userToReturn } = userWithPassword;
      return userToReturn;
    }
    
    return { error: 'Invalid email or password.' };
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'An unexpected error occurred during login.' };
  }
}
