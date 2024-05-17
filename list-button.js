class ListButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const totalBooks = parseInt(this.getAttribute('total-books'), 10);
        const booksPerPage = parseInt(this.getAttribute('books-per-page'), 10);
        const remaining = totalBooks - booksPerPage;

        this.shadowRoot.innerHTML = `
            <style>
            .list__button {
                font-family: Roboto, sans-serif;
                transition: background-color 0.1s;
                border-width: 0;
                border-radius: 6px;
                height: 2.75rem;
                cursor: pointer;
                width: 50%;
                background-color: rgba(var(--color-blue), 1);
                color: rgba(var(--color-force-light), 1);
                font-size: 1rem;
                border: 1px solid rgba(var(--color-blue), 1);
                max-width: 10rem;
                margin: 0 auto;
                display: block;
              }
              
              .list__remaining {
                opacity: 0.5;
              }
              .list__button:not(:disabled) hover {
                background-color: rgba(var(--color-blue), 0.8);
                color: rgba(var(--color-force-light), 1);
              }
              
              .list__button:disabled {
                cursor: not-allowed;
                opacity: 0.2;
              }
            </style>
            <button ${remaining <= 0 ? 'disabled' : ''}>
                <span>Show more</span>
                <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
            </button>
        `;

        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('loadMore', { bubbles: true, composed: true }));
        });
    }
}

customElements.define('list-button', ListButton);
