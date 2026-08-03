import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../scripts/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9a0dcee2-543f-4136-a37a-743512f83279",
    "Content-Type": "application/json",
  },
});

api.getInitialCards().then((cards) => {
  cards.forEach(function (item) {
    const newCardElement = getCardElement(item);
    cardsList.append(newCardElement);
  });
});

const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-profile-modal");
const editCloseButton = editModal.querySelector(".modal__close-button");

const profileTitle = document.querySelector(".profile__title");
const profileSubtitle = document.querySelector(".profile__subtitle");
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

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    imageModalImage.src = data.link;
    imageModalImage.alt = data.name;
    imageModalCaption.textContent = data.name;
    openModal(imageModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = profileNameInput.value;
  profileSubtitle.textContent = profileDescriptionInput.value;
  closeModal(editModal);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    link: newPostImage.value,
    name: newPostCaption.value,
  };

  const newCardElement = getCardElement(inputValues);
  cardsList.prepend(newCardElement);

  closeModal(newPostModal);
  newPostFormElement.reset();
  resetValidation(newPostFormElement, [newPostImage, newPostCaption], settings);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

newPostFormElement.addEventListener("submit", handleNewPostSubmit);

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

modalList.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
