import fs from 'fs';
import path from 'path';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DB_FILE = path.join(process.cwd(), 'localDB.json');
const defaultData = { jobs: [], docs: [], stories: [] };

// --- LOCAL JSON FALLBACK FUNCTIONS ---
function getLocalDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!data.stories) {
      data.stories = [];
      saveLocalDb(data);
    }
    return data;
  } catch (e) {
    return defaultData;
  }
}

function saveLocalDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- SUPABASE CLIENT SETUP ---
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

// --- EXPORTED DB WRAPPERS ---

export async function getJobs() {
  const supabase = getSupabase();
  if (!supabase) return getLocalDb().jobs;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return []; // Must be logged in

  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function addJob(job) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    if (!job.id) job.id = 'APP-' + Date.now();
    db.jobs.unshift(job);
    saveLocalDb(db);
    return job;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Map to Supabase columns (exclude any fields that aren't in schema if needed)
  const { id, ...jobData } = job;
  
  const { data, error } = await supabase
    .from('jobs')
    .insert([{ ...jobData, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJob(id, updatedJob) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    const index = db.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      db.jobs[index] = { ...db.jobs[index], ...updatedJob };
      saveLocalDb(db);
      return db.jobs[index];
    }
    throw new Error('Not found');
  }

  const { id: _, ...jobData } = updatedJob; // remove id from payload
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJob(id) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    db.jobs = db.jobs.filter(j => j.id !== id);
    saveLocalDb(db);
    return true;
  }

  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function getDocs() {
  const supabase = getSupabase();
  if (!supabase) return getLocalDb().docs;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from('docs').select('*').order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function addDoc(doc) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    if (!doc.id) doc.id = 'DOC-' + Date.now();
    db.docs.unshift(doc);
    saveLocalDb(db);
    return doc;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { id, ...docData } = doc;
  
  const { data, error } = await supabase
    .from('docs')
    .insert([{ ...docData, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDoc(id, updatedDoc) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    const index = db.docs.findIndex(d => d.id === id);
    if (index !== -1) {
      db.docs[index] = { ...db.docs[index], ...updatedDoc };
      saveLocalDb(db);
      return db.docs[index];
    }
    throw new Error('Not found');
  }

  const { id: _, ...docData } = updatedDoc;
  const { data, error } = await supabase
    .from('docs')
    .update(docData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDoc(id) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    db.docs = db.docs.filter(d => d.id !== id);
    saveLocalDb(db);
    return true;
  }

  const { error } = await supabase.from('docs').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function getStories() {
  const supabase = getSupabase();
  if (!supabase) return getLocalDb().stories || [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function addStory(story) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    if (!story.id) story.id = 'STRY-' + Date.now();
    db.stories.unshift(story);
    saveLocalDb(db);
    return story;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { id, ...storyData } = story;
  
  const { data, error } = await supabase
    .from('stories')
    .insert([{ ...storyData, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStory(id, updatedStory) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    const index = db.stories.findIndex(s => s.id === id);
    if (index !== -1) {
      db.stories[index] = { ...db.stories[index], ...updatedStory };
      saveLocalDb(db);
      return db.stories[index];
    }
    throw new Error('Not found');
  }

  const { id: _, ...storyData } = updatedStory;
  const { data, error } = await supabase
    .from('stories')
    .update(storyData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStory(id) {
  const supabase = getSupabase();
  if (!supabase) {
    const db = getLocalDb();
    db.stories = db.stories.filter(s => s.id !== id);
    saveLocalDb(db);
    return true;
  }

  const { error } = await supabase.from('stories').delete().eq('id', id);
  if (error) throw error;
  return true;
}
