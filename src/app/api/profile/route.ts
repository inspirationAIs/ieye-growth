import { NextRequest, NextResponse } from 'next/server';
import { saveProfile, getProfile } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('id');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    const profile = await getProfile(profileId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthdate, gender, parentEmail } = body;

    if (!name || !birthdate || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const profile = {
      id: `child_${Date.now()}`,
      name,
      birthdate,
      gender,
      parentEmail: parentEmail ?? '',
      createdAt: new Date().toISOString(),
    };

    await saveProfile(profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await saveProfile(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
