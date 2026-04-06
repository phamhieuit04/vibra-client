import axios from 'axios';

const apiHelper = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
});

export { apiHelper };
export default apiHelper;
