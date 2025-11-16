const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<table class="user-account">
<thead>
    <tr>
        <th>Username</th>
        <th>Name</th>
        <th>Create At</th>
        <th>Create By</th>
    </tr>
</thead>
<tbody></tbody>
</table>
`;

class UserAccountList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
        await this.refreshListing();
    }

    async refreshListing() {
        const userAccountList = await this.getUserAccountList();
        this.userAccountList = userAccountList;
    }

    set userAccountList(list) {
        // Clear existing light DOM children safely
        // this.replaceChildren(); // NOTE: replaceChildren() removes all light DOM children!

        const tbody = this.shadowRoot.querySelector("tbody");
        tbody.innerHTML = ""; // clear existing rows

        list.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
<td>${user.Username}</td>
<td>${user.Email}</td>
<td>${user.CreateAt}</td>
<td>${user.CreateBy}</td>
`;
            tbody.appendChild(tr); // now inside shadow DOM <tbody>
        });
    }

    async getUserAccountList() {
        const url = `${apiBaseUrl}/user-account`;
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

customElements.define("user-account-list", UserAccountList);
