// src/lib/api.js
const BASE_URL = 'https://684ecd57f0c9c9848d2923ec.mockapi.io/api/v1/notes'; // replace with your full endpoint if needed

export async function getNotes() {
  const res = await fetch(BASE_URL);
  return await res.json();
}

export async function getNote(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return await res.json();
}

export async function createNote(note) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  return await res.json();
}

export async function updateNote(id, updatedNote) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  });
  return await res.json();
}

export async function deleteNote(id) {
  await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
