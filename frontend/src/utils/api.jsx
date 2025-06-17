class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  // Método privado para tratar a resposta do servidor
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    // Se o servidor retornar um erro, rejeita a promise
    return Promise.reject(`Erro: ${res.status}`);
  }

  // Método privado para obter os cabeçalhos com o token dinâmico
  _getHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  // Obter informações do usuário
  getUserInfo() {
    return fetch(`${this._baseUrl}/api/users/me`, {
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  // Obter os cartões iniciais
  getInitialCards() {
    return fetch(`${this._baseUrl}/api/cards`, {
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  // Atualizar o perfil do usuário
  editProfile({ name, about }) {
    return fetch(`${this._baseUrl}/api/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleResponse);
  }
  
  // Adicionar um novo cartão
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/api/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleResponse);
  }

  // Deletar um cartão
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/api/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  // Adicionar ou remover like
  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? 'PUT' : 'DELETE';
    return fetch(`${this._baseUrl}/api/cards/${cardId}/likes`, {
      method: method,
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  // Atualizar o avatar
  updateAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleResponse);
  }
}

// Instancia a classe Api com uma baseUrl relativa para funcionar em produção
const api = new Api({
  baseUrl: '',
});

export default api;





  
  