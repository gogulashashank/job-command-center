import { NextResponse } from 'next/server';
import { updateStory, deleteStory } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const story = await request.json();
    const updatedStory = await updateStory(id, story);
    return NextResponse.json(updatedStory);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteStory(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
