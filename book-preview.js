class BookPreview extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM tree to this instance
        this.attachShadow({ mode: 'open' });

        // Create the component's inner HTML structure
        this.shadowRoot.innerHTML = `
            <style>
                .preview {
                    display: flex;
                    align-items: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin: 5px 0;
                    cursor: pointer;
                    background-color: #f9f9f9;
                }
                .preview__image {
                    width: 50px;
                    height: 75px;
                    object-fit: cover;
                    margin-right: 10px;
                }
                .preview__info {
                    flex-grow: 1;
                }
                .preview__title {
                    font-size: 1.2em;
                    margin: 0;
                }
                .preview__author {
                    font-size: 0.9em;
                    color: #555;
                }
            </style>
            <button class="preview" data-preview="">
                <img class="preview__image" src="" alt="Book Image"/>
                <div class="preview__info">
                    <h3 class="preview__title"></h3>
                    <div class="preview__author"></div>
                </div>
            </button>
        `;
    }

    // Set up properties and attribute handling
    static get observedAttributes() {
        return ['id', 'image', 'title', 'author'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'id') {
            this.shadowRoot.querySelector('.preview').setAttribute('data-preview', newValue);
        } else if (name === 'image') {
            this.shadowRoot.querySelector('.preview__image').src = newValue;
        } else if (name === 'title') {
            this.shadowRoot.querySelector('.preview__title').innerText = newValue;
        } else if (name === 'author') {
            this.shadowRoot.querySelector('.preview__author').innerText = newValue;
        }
    }
}

// Define the new element
customElements.define('book-preview', BookPreview);
