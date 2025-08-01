<template>
  <div class="w-full max-w-md mx-auto bg-white p-4 rounded shadow">
    <h2 class="text-xl font-semibold mb-2">Vue 3 Chat</h2>

    <div class="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50">
      <div v-for="msg in messages" :key="msg._id" class="mb-1">
        <strong>{{ msg.username }}:</strong> {{ msg.text }}
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input
        v-model="text"
        placeholder="Type message..."
        class="flex-1 border rounded px-2 py-1"
      />
      <button class="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const username = prompt('Enter your name') || 'Anonymous';
const text = ref('');
const messages = ref([]);

// Fetch history
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/messages');
  messages.value = res.data;

  socket.on('chat message', (msg) => {
    messages.value.push(msg);
  });
});

function sendMessage() {
  if (!text.value.trim()) return;
  socket.emit('chat message', { username, text: text.value });
  text.value = '';
}
</script>
