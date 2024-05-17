class GenreAuthorOptions extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const data = JSON.parse(this.getAttribute('data'));
        const type = this.getAttribute('type');

        const container = document.createElement('select');
        container.innerHTML = `
            <option value="any">All ${type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ${Object.entries(data).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
        `;
        this.shadowRoot.appendChild(container);
    }
}

customElements.define('genre-author-options', GenreAuthorOptions);
