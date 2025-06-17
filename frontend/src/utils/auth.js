export const BASE_URL = '';

const handleResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Erro: ${res.status}`);
};

// As chamadas agora incluem o prefixo /api/
export const register = (email, password) => {
  return fetch(`${BASE_URL}/api/signup`, { // Adicionado /api/
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/api/signin`, { // Adicionado /api/
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/api/users/me`, { // Adicionado /api/
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};
