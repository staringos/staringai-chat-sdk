import { get, post } from './request';

const STARING_CHAT_BACKEND = process.env.STARING_CHAT + '/api';

export const fetchCSInfo = (id: string, token: string) => {
  return get(
    `${STARING_CHAT_BACKEND}/chatbot/${id}`,
    {},
    {
      headers: {
        ['Authorization']: `Bearer ${token}`,
      },
    }
  );
};

export const fetchVisitorToken = (visitorId: string) => {
  return post(`${STARING_CHAT_BACKEND}/auth/visitor`, {
    visitorId,
  });
};

export const checkVisitorToken = () => {
  return post(`${STARING_CHAT_BACKEND}/auth/check`);
};
