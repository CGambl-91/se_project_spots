// utils/Api.js
class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "9a0dcee2-543f-4136-a37a-743512f83279",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
