import axios from 'axios';
import { URL, URL_PATHS, responseStatus } from '../constants/api.constants';

class Api {
  instance = axios.create({
    baseURL: URL,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  processResponse = (response) => {
    if (response.status < responseStatus.SUCCESS || response.status >= responseStatus.REDIRECT) {
      throw new Error(response.data.message || 'Some error occurred');
    }
    return response.data;
  };

  async get(url, params) {
    const response = await this.instance.get(url, { params });

    return this.processResponse(response);
  }
  async post(url, data) {
    const response = await this.instance.post(url, data);

    return this.processResponse(response);
  }
  async put(url, data) {
    const response = await this.instance.put(url, data);

    return this.processResponse(response);
  }
  async delete(url, data) {
    const response = await this.instance.delete(url, data);

    return this.processResponse(response);
  }
  async logIn(data) {
    const responseData = await this.post(URL_PATHS.login, data);

    return responseData;
  }
  async SignUp(data) {
    const responseData = await this.post(URL_PATHS.signup, data);

    return responseData;
  }
  async postUploadedData(data) {
    const responseData = await this.post(URL_PATHS.transfer, data);

    return responseData;
  }
  async getUploadedData(data) {
    const responseData = await this.get(URL_PATHS.transfer, data);

    return responseData;
  }
}

export default new Api();
