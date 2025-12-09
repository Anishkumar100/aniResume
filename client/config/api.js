import axios from "axios";


// this file is to configure the axios instance with base url. So u dont have to write full url every time while making api calls

const api = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL 
})


export default api;