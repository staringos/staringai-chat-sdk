import { queryStringify } from '../utils';

const request = (url: string, options: RequestInit = {}) => {
  const { method = 'GET', headers = {}, body = null } = options;
  const fetchOptions: RequestInit = { method, headers };

  if (body) {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body);
  }

  return fetch(url, fetchOptions)
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const get = (
  url: string,
  params?: Record<string, any>,
  options?: RequestInit
) => {
  const queryString = queryStringify(params);
  const requestUrl = `${url}?${queryString}`;
  return request(requestUrl, options);
};

export const post = (url: string, data?: any) => {
  return request(url, { method: 'POST', body: data });
};
