import axios from 'axios';

const API_KEY = process.env.REACT_APP_IBM_CREDENTIAL;

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  auth: {
    username: 'apiKey',
    password: String(API_KEY),
  },
});

export default api;
