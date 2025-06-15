<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import {
    getNotes,
    createNote,
    updateNote,
    deleteNote
  } from './lib/api.js';

  let notes = [];
  let title = '';
  let content = '';
  let loading = true;
  let deletingId = null;
  let error = '';
  let currentPage = 1;
  const notesPerPage = 5;
  let searchQuery = '';

  let editingId = null;
  let editTitle = '';
  let editContent = '';

  async function loadNotes() {
    loading = true;
    try {
      notes = await getNotes();
    } catch (e) {
      error = 'Failed to fetch notes';
    }
    loading = false;
  }

  onMount(loadNotes);

  async function addNote() {
    if (!title || !content) return;
    loading = true;
    await createNote({ title, content });
    title = '';
    content = '';
    await loadNotes();
  }

  function startEdit(note) {
    editingId = note.id;
    editTitle = note.title;
    editContent = note.content;
  }

  async function saveEdit(id) {
    loading = true;
    await updateNote(id, { title: editTitle, content: editContent });
    editingId = null;
    await loadNotes();
  }

  async function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this note?')) {
      deletingId = id;
      await deleteNote(id);
      deletingId = null;
      await loadNotes();
    }
  }

  $: filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  $: paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );
</script>

<div class="min-h-screen bg-blue-50 p-6">
  <h1 class="text-3xl font-bold text-center mb-6 text-blue-800">📝 Notes App</h1>

  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
    <input type="text" placeholder="Search by title..." bind:value={searchQuery}
      class="w-full p-2 border rounded-md" />

    <input
      type="text"
      placeholder="Title"
      bind:value={title}
      class="w-full p-2 border rounded-md"
    />
    <textarea
      placeholder="Content"
      bind:value={content}
      class="w-full p-2 border rounded-md"
    ></textarea>
    <button
      on:click={addNote}
      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
    >Create</button>

    {#if loading}
      <p class="text-center text-gray-500">Loading...</p>
    {:else if paginatedNotes.length === 0}
      <p class="text-center text-gray-500">No notes found.</p>
    {:else}
      <div class="space-y-4">
        {#each paginatedNotes as note (note.id)}
          <div class="border p-4 rounded-md shadow-md" in:fade out:fade>
            {#if editingId === note.id}
              <input
                type="text"
                bind:value={editTitle}
                class="w-full p-1 border mb-2"
              />
              <textarea
                bind:value={editContent}
                class="w-full p-1 border mb-2"
              ></textarea>
              <button on:click={() => saveEdit(note.id)} class="mr-2 bg-blue-500 text-white px-3 py-1 rounded">Save</button>
              <button on:click={() => (editingId = null)} class="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
            {:else}
              <h2 class="text-xl font-semibold text-blue-700">{note.title}</h2>
              <p class="text-gray-700">{note.content}</p>
              <div class="mt-2 space-x-2">
                <button on:click={() => startEdit(note)} class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button on:click={() => confirmDelete(note.id)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">{deletingId === note.id ? 'Deleting...' : 'Delete'}</button>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="flex justify-center mt-4 space-x-2">
        {#each Array(totalPages) as _, i}
          <button
            class="px-3 py-1 rounded border text-sm font-medium hover:bg-blue-200 {currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'}"
            on:click={() => (currentPage = i + 1)}
          >{i + 1}</button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  body {
    margin: 0;
    font-family: system-ui;
  }
</style>
