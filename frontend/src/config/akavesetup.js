import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000';

export async function akavesetup(method, endpoint, data) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}