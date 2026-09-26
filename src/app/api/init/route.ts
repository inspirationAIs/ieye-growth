import { NextResponse } from 'next/server';
import { initializeSpreadsheet } from '@/lib/google-sheets';

export async function POST() {
  try {
    await initializeSpreadsheet();
    return NextResponse.json({ success: true, message: 'Spreadsheet initialized' });
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
    return NextResponse.json({ error: 'Failed to initialize spreadsheet' }, { status: 500 });
  }
}
