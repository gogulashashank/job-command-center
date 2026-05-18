import { NextResponse } from 'next/server';
import { getDocs, addDoc } from '@/lib/db';

export async function GET() {
  try {
    const docs = await getDocs();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const doc = await request.json();
    const newDoc = await addDoc(doc);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
