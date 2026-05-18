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

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.people || []);
}

export async function POST(request) {
  const person = await request.json();
  const db = readDB();
  
  if (!db.people) db.people = [];
  
  const newPerson = {
    ...person,
    id: person.id || `PPL-${Date.now()}`
  };
  
  db.people.push(newPerson);
  writeDB(db);
  
  return NextResponse.json(newPerson, { status: 201 });
}
