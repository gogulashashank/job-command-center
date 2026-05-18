import { useState, useEffect } from 'react';
import { normalizeJob } from './utils';

export function useJCCData() {
  const [jobs, setJobs] = useState([]);
  const [docs, setDocs] = useState([]);
  const [stories, setStories] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data.map(normalizeJob));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      setDocs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories');
      const data = await res.json();
      setStories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPeople = async () => {
    try {
      const res = await fetch('/api/people');
      const data = await res.json();
      setPeople(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([fetchJobs(), fetchDocs(), fetchStories(), fetchPeople()]).then(() => setLoading(false));
  }, []);

  const addJob = async (job) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (res.ok) await fetchJobs();
  };

  const updateJob = async (job) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (res.ok) await fetchJobs();
  };

  const deleteJob = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchJobs();
  };

  const addDoc = async (doc) => {
    const res = await fetch('/api/docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (res.ok) await fetchDocs();
  };

  const updateDoc = async (doc) => {
    const res = await fetch(`/api/docs/${doc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (res.ok) await fetchDocs();
  };

  const deleteDoc = async (id) => {
    const res = await fetch(`/api/docs/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchDocs();
  };

  const addStory = async (story) => {
    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story),
    });
    if (res.ok) await fetchStories();
  };

  const updateStory = async (story) => {
    const res = await fetch(`/api/stories/${story.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story),
    });
    if (res.ok) await fetchStories();
  };

  const deleteStory = async (id) => {
    const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchStories();
  };

  const addPerson = async (person) => {
    const res = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    if (res.ok) await fetchPeople();
  };

  const updatePerson = async (person) => {
    const res = await fetch(`/api/people/${person.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    if (res.ok) await fetchPeople();
  };

  const deletePerson = async (id) => {
    const res = await fetch(`/api/people/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchPeople();
  };

  const seedJobs = async (starterJobs) => {
    for (const job of starterJobs) {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
    }
    await fetchJobs();
  };

  const seedDocs = async (starterDocs) => {
    for (const doc of starterDocs) {
      await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
    }
    await fetchDocs();
  };
  
  const clearJobs = async () => {
    // In a real app we might not want to delete all, but for this port:
    for (const job of jobs) {
      await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' });
    }
    await fetchJobs();
  };

  const clearDocs = async () => {
    for (const doc of docs) {
      await fetch(`/api/docs/${doc.id}`, { method: 'DELETE' });
    }
    await fetchDocs();
  };

  return {
    jobs, docs, stories, people, loading,
    addJob, updateJob, deleteJob, seedJobs, clearJobs,
    addDoc, updateDoc, deleteDoc, seedDocs, clearDocs,
    addStory, updateStory, deleteStory,
    addPerson, updatePerson, deletePerson
  };
}
