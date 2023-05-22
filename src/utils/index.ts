import { fetchVisitorToken } from './../api/api';

export const setStaringChatUID = (id: string) => {
  return localStorage.setItem('STARING_CHAT_UID', id);
};

export const getStaringChatUID = () => {
  return localStorage.getItem('STARING_CHAT_UID');
};

export const regenerateToken = async () => {
  const uid = getStaringChatUID() || generateUID();
  setStaringChatUID(uid);

  const result = await fetchVisitorToken(uid);

  if (result?.code === 200) {
    const token = result.data.token;
    return token;
  }
};

export const queryStringify = (params: Record<string, any>) => {
  if (!params) return '';

  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
};

export const queryParse = (search: string) => {
  const query: Record<string, any> = {};

  new URLSearchParams(search).forEach((value, key) => (query[key] = value));

  return query;
};

export const generateUID = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  );
};
