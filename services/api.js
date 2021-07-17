// import http from "../http-common";

import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class DataService {
    getAll(query) {
        return axios.get(`/${query}`);
    }

    get(query, id) {
        return axios.get(`/${query}/${id}`);
    }

    create(query, data) {
        return axios.post(`/${query}`, data);
    }

    update(query, id, data) {
        return axios.put(`/${query}/${id}`, data);
    }

    delete(query, id) {
        return axios.delete(`/${query}/${id}`);
    }

    deleteImage(query, data) {
        return axios.post(`/${query}`, data);
    }

    deleteAll(query) {
        return axios.delete(`/${query}`);
    }

    login(data) {
        return axios.post('login', data)
    }
}

export default new DataService();
