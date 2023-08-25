import { apiClient } from '../utils/apiClient';

class HttpService {
  #endPoint;
  constructor(apiEndPoint) {
    this.#endPoint = apiEndPoint;
  }

  getAll() {
    return apiClient.get(this.#endPoint + 'list');
  }

  add(payload) {
    return apiClient.post(this.#endPoint + 'add', payload);
  }

  getOne(id) {
    return apiClient.get(this.#endPoint + 'detail/' + id);
  }

  update(id, payload) {
    return apiClient.put(this.#endPoint + 'edit/' + id, payload);
  }

  delete(id) {
    return apiClient.delete(this.#endPoint + 'delete/' + id);
  }
}

export default function create(endPoint) {
  return new HttpService(endPoint);
}
