class SitePageHeader extends HTMLElement {

    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<header style="margin: 2rem auto;width: 76rem;text-align: center;">
    <div style="display: flex; justify-content: space-between;">
        <div></div>
        <div>
            <button id="logoutButton" class="button button-clear no-margin">Log out of application</button>
        </div>
    </div>
    <h1>Hci-Blazer</h1>
    <site-navigation-bar></site-navigation-bar>
</header>`;

        const logoutButton = this.shadowRoot.getElementById('logoutButton')
        logoutButton.addEventListener('click', this.logout.bind(this));
    }

    logout() {
        localStorage.removeItem('hci-blazer-token');
        window.location.reload();
    }
}

// Define the custom elements

customElements.define('site-page-header', SitePageHeader);
