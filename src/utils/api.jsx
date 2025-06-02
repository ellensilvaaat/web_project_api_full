class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _fetch(url, options = {}) {
    return fetch(`${this._baseUrl}${url}`, {
      headers: this._headers,
      ...options,
    }).then((res) =>
      res.ok ? res.json() : Promise.reject(`Erro: ${res.status}`)
    );
  }

  getUserInfo() {
    return this._fetch("users/me");
  }

  getInitialCards() {
    return this._fetch("cards").then((cards) =>
      cards.map((card) => ({
        ...card,
        likes: Array.isArray(card.likes) ? card.likes : [],
        isLiked: false,
      }))
    );
  }

  setUserInfo(data) {
    return this._fetch("users/me", {
      method: "PATCH",
      headers: {
        ...this._headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  setAvatar(avatar) {
    return this._fetch("users/me/avatar", {
      method: "PATCH",
      headers: {
        ...this._headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    });
  }

  addCard(data) {
    return this._fetch("cards", {
      method: "POST",
      headers: {
        ...this._headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((card) => ({
      ...card,
      likes: Array.isArray(card.likes) ? card.likes : [],
      isLiked: false,
    }));
  }

  deleteCard(cardId) {
    return this._fetch(`cards/${cardId}`, {
      method: "DELETE",
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._fetch(`cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    }).then((card) => ({
      ...card,
      likes: Array.isArray(card.likes) ? card.likes : [],
    }));
  }
}

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1/",
  headers: {
    authorization: "8b28d24e-3d4d-4c18-a1ef-b27d83c8d6dc",
  },
});

export default api;





  
  