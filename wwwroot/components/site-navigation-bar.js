class NavItem extends HTMLElement {

    static observedAttributes = ["componentName", "active"];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('.nav-item').addEventListener('click', () => {
            console.log(`NavItem clicked: ${this.getAttribute('componentName')}`);
            const isActive = this.getAttribute('active') === 'true';
            this.setAttribute('active', isActive ? 'false' : 'true');
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`NavItem Attribute ${name} changed from ${oldValue} to ${newValue}`);
    }

    render() {
        this.shadowRoot.innerHTML = `
<style>
span.nav-item {
    cursor: pointer;
}
span.nav-item:hover {
        color: #ffffff;
    }
span.nav-item.active {
    color: #fff275;
    font-weight: bold;
}
</style>
<span class='nav-item ${this.getAttribute("active") === "true" ? "active" : ""}'>${this.textContent}</span>`;

    }
}


class SiteNavigationBar extends HTMLElement {
    //static observedAttributes = ["color", "size"];

    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        //console.log("SiteNavigationBar added to page.");
        this.render();
    }

    disconnectedCallback() {
        //console.log("SiteNavigationBar removed from page.");
    }

    connectedMoveCallback() {
        //console.log("SiteNavigationBar moved with moveBefore()");
    }

    adoptedCallback() {
        //console.log("SiteNavigationBar moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute ${name} has changed.`);
    }

    render() {
        this.shadowRoot.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<nav style="display: flex; gap: 2rem; justify-content: center;">
    <a href="/index.html">Home</a>
    <a href="/user-account/index.html">User Account</a>
    <a href="/inventory/index.html">Inventory</a>
    <a href="/reports/index.html">Reports</a>
</nav>`;
    }
}


// Define the custom elements

customElements.define('nav-item', NavItem);
customElements.define('site-navigation-bar', SiteNavigationBar);
