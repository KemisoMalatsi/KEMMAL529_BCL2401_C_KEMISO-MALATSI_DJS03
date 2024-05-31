// Define the custom book-preview element
class bookPreview extends HTMLElement {
    static get observedAttributes() {
      return ["author", "image", "id", "title"];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    render() {
      const author = this.getAttribute("author");
      const image = this.getAttribute("image");
      const id = this.getAttribute("id");
      const title = this.getAttribute("title");
  
      const template = document.createElement("template");
      template.innerHTML = `
        <style>
          .preview {
            border-width: 0;
            width: 100%;
            font-family: Roboto, sans-serif;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            text-align: left;
            border-radius: 8px;
            border: 1px solid rgba(var(--color-dark), 0.15);
            background: rgba(var(--color-light), 1);
          }
  
          @media (min-width: 60rem) {
            .preview {
              padding: 1rem;
            }
          }
  
          .preview_hidden {
            display: none;
          }
  
          .preview:hover {
            background: rgba(var(--color-blue), 0.05);
          }
  
          .preview__image {
            width: 48px;
            height: 70px;
            object-fit: cover;
            background: grey;
            border-radius: 2px;
            box-shadow: 
              0px 2px 1px -1px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.1), 
              0px 1px 3px 0px rgba(0, 0, 0, 0.1);
          }
  
          .preview__info {
            padding: 1rem;
          }
  
          .preview__title {
            margin: 0 0 0.5rem;
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
          }
  
          .preview__author {
            color: rgba(var(--color-dark), 0.4);
          }
        </style>
  
        <button class="preview" data-preview="${id}">
          <img
              class="preview__image"
              src="${image}"
          />
  
          <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${authors[author]}</div>
          </div>
        </button>
      `;
      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  // Register the custom element
  customElements.define("book-preview", bookPreview);
  
  import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
  
  let page = 1;
  let matches = books;
  
  function renderBooks(books) {
    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
      const element = createBookElement(book);
      fragment.appendChild(element);
    });
    document.querySelector("[data-list-items]").appendChild(fragment);
    showMore();
  }
  
  function createBookElement({ author, id, image, title }) {
    const element = document.createElement("book-preview");
    element.setAttribute("author", author);
    element.setAttribute("id", id);
    element.setAttribute("image", image);
    element.setAttribute("title", title);
    return element;
  }
  
  function renderGenres() {
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = createOptionElement("All Genres", "any");
    genreHtml.appendChild(firstGenreElement);
  
    for (const [id, name] of Object.entries(genres)) {
      const element = createOptionElement(name, id);
      genreHtml.appendChild(element);
    }
  
    document.querySelector("[data-search-genres]").appendChild(genreHtml);
  }
  
  function renderAuthors() {
    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = createOptionElement("All Authors", "any");
    authorsHtml.appendChild(firstAuthorElement);
  
    for (const [id, name] of Object.entries(authors)) {
      const element = createOptionElement(name, id);
      authorsHtml.appendChild(element);
    }
  
    document.querySelector("[data-search-authors]").appendChild(authorsHtml);
  }
  
  function createOptionElement(text, value) {
    const element = document.createElement("option");
    element.value = value;
    element.innerText = text;
    return element;
  }
  
  function applyTheme(theme) {
    const isDark = theme === "night";
    document.querySelector("[data-settings-theme]").value = theme;
    document.documentElement.style.setProperty(
      "--color-dark",
      isDark ? "255, 255, 255" : "10, 10, 20"
    );
    document.documentElement.style.setProperty(
      "--color-light",
      isDark ? "10, 10, 20" : "255, 255, 255"
    );
  }
  
  function filterBooks(books, filters) {
    const filteredBooks = books.filter((book) => {
      let genreMatch = filters.genre === "any";
  
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
  
      return (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      );
    });
  
    return filteredBooks;
  }
  
  function showMore() {
    const button = document.querySelector("[data-list-button]");
    button.disabled = matches.length - page * BOOKS_PER_PAGE < 1;
    button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${
        matches.length - page * BOOKS_PER_PAGE > 0
          ? matches.length - page * BOOKS_PER_PAGE
          : 0
      })</span>`;
  }
  
  // Event listeners
  document.querySelector("[data-search-cancel]").addEventListener("click", () => {
    document.querySelector("[data-search-overlay]").open = false;
  });
  
  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = false;
    });
  
  document.querySelector("[data-header-search]").addEventListener("click", () => {
    document.querySelector("[data-search-overlay]").open = true;
    document.querySelector("[data-search-title]").focus();
  });
  
  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = true;
    });
  
  document.querySelector("[data-list-close]").addEventListener("click", () => {
    document.querySelector("[data-list-active]").open = false;
  });
  
  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      applyTheme(theme);
      document.querySelector("[data-settings-overlay]").open = false;
    });
  
  document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = filterBooks(books, filters);
  
    page = 1;
    matches = result;
  
    const listMessage = document.querySelector("[data-list-message]");
    if (result.length < 1) {
      listMessage.classList.add("list__message_show");
    } else {
      listMessage.classList.remove("list__message_show");
    }
  
    const listItems = document.querySelector("[data-list-items]");
    listItems.innerHTML = "";
    renderBooks(matches.slice(0, BOOKS_PER_PAGE));
  
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });
  
  document.querySelector("[data-list-button]").addEventListener("click", () => {
    renderBooks(
      matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)
    );
    page += 1;
    showMore();
  });
  
  document.querySelector("[data-list-items]").addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    let active = null;
  
    for (const node of pathArray) {
      if (active) break;
  
      if (node?.dataset?.preview) {
        active = books.find(book => book.id === node.dataset.preview);
      }
    }
  
    if (active) {
      const listActive = document.querySelector("[data-list-active]");
      listActive.open = true;
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });
  
  // Initial render calls
  renderBooks(matches.slice(0, BOOKS_PER_PAGE));
  renderGenres();
  renderAuthors();
  
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("night");
  } else {
    applyTheme("day");
  }
  