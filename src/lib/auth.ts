import { auth } from '@/auth';
import { NextRequest } from 'next/server';

export async function getAuthSession() {
  return await auth();
}
