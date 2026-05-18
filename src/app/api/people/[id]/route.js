import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'localDB.json');

function readDB() {
  const file = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(file);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function PUT(request, { params }) {
  const { id } = params;
  const updates = await request.json();
  const db = readDB();
  
  if (!db.people) db.people = [];
  
  const index = db.people.findIndex(p => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Person not found' }, { status: 404 });
  }

  db.people[index] = { ...db.people[index], ...updates };
  writeDB(db);
  
  return NextResponse.json(db.people[index]);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const db = readDB();
  
  if (!db.people) db.people = [];
  db.people = db.people.filter(p => p.id !== id);
  writeDB(db);
  
  return NextResponse.json({ success: true });
}
