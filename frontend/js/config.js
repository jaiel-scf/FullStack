// Usa o backend local durante o desenvolvimento e o Render em produção.
const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8080'
    : 'https://sia-backend3.onrender.com';
