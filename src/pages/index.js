import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9a0dcee2-543f-4136-a37a-743512f83279",
    "Content-Type": "application/json",
  },
});

const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-profile-modal");
const editCloseButton = editModal.querySelector(".modal__close-button");

const profileTitle = document.querySelector(".profile__title");
const profileSubtitle = document.querySelector(".profile__subtitle");
const profileAvatar = document.querySelector(".profile__avatar");
const profileFormElement = editModal.querySelector(".modal__form");
const profileNameInput = editModal.querySelector("#profile-name-input");
const profileDescriptionInput = editModal.querySelector(
  "#profile-description-input",
);

const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostFormElement = newPostModal.querySelector(".modal__form");
const newPostImage = newPostModal.querySelector("#card-image-input");
const newPostCaption = newPostModal.querySelector("#card-caption-input");

const avatarModalButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarImage = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCloseButton = deleteModal.querySelector(".modal__close-button");
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-button");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const imageModal = document.querySelector("#image-modal");
const imageCloseButton = imageModal.querySelector(
  ".modal__close-button_type_preview",
);
const imageModalImage = imageModal.querySelector(".modal__image");
const imageModalCaption = imageModal.querySelector(".modal__image-title");
const modalList = document.querySelectorAll(".modal");

let selectedCard, selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImage.addEventListener("click", () => {
    imageModalImage.src = data.link;
    imageModalImage.alt = data.name;
    imageModalCaption.textContent = data.name;
    openModal(imageModal);
  });

  return cardElement;
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      profileTitle.textContent = data.name;
      profileSubtitle.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

newPostFormElement.addEventListener("submit", handleNewPostSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .createCard({
      name: newPostCaption.value,
      link: newPostImage.value,
    })
    .then((data) => {
      const newCardElement = getCardElement(data);
      cardsList.prepend(newCardElement);

      closeModal(newPostModal);
      newPostFormElement.reset();

      resetValidation(
        newPostFormElement,
        [newPostImage, newPostCaption],
        settings,
      );
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarImage.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api
    .handleLike(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

editButton.addEventListener("click", function () {
  openModal(editModal);
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileSubtitle.textContent;
  resetValidation(
    profileFormElement,
    [profileNameInput, profileDescriptionInput],
    settings,
  );
});

editCloseButton.addEventListener("click", function () {
  closeModal(editModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

imageCloseButton.addEventListener("click", () => {
  closeModal(imageModal);
});

avatarCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarModalButton.addEventListener("click", function () {
  openModal(avatarModal);
});

deleteCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

modalList.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const newCardElement = getCardElement(item);
      cardsList.append(newCardElement);
    });

    profileTitle.textContent = userInfo.name;
    profileSubtitle.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

enableValidation(settings);
