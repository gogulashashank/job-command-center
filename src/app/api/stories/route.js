import { NextResponse } from 'next/server';
import { getStories, addStory } from '@/lib/db';

export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const story = await request.json();
    const newStory = await addStory(story);
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
