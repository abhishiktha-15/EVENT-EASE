import axios from 'axios';

const API = axios.create({
  baseURL: 'https://event-backend.onrender.com/api',
});


export default API;
