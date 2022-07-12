import axios from 'axios';

const BASE_API_URL = 'http://192.168.0.19:7071/api';

export default {
  getBaseApiUrl() {
    return BASE_API_URL;
  },
  createRoom(connectionId) {
    return axios.post(`${BASE_API_URL}/room`, connectionId);
  },
  joinRoom(roomId, connectionId) {
    return axios.post(`${BASE_API_URL}/room/${roomId}/join`, connectionId);
  },
};
