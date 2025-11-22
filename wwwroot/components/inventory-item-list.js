const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<table class="user-account">
<thead>
    <tr>
        <th>Item Code</th>
        <th>Year</th>
        <th>Size</th>
    </tr>
</thead>
<tbody></tbody>
</table>
`;

class InventoryItemList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
        await this.refreshListing();
    }

    async refreshListing() {
        const inventoryItemList = await this.getInventoryItemList();
        this.inventoryItemList = inventoryItemList;
    }

    set inventoryItemList(list) {
        // Clear existing light DOM children safely
        // this.replaceChildren(); // NOTE: replaceChildren() removes all light DOM children!

        const tbody = this.shadowRoot.querySelector("tbody");
        tbody.innerHTML = ""; // clear existing rows

        list.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
<td>${user.ItemCode}</td>
<td>${user.Year}</td>
<td>${user.Size}</td>
`;
            tbody.appendChild(tr); // now inside shadow DOM <tbody>
        });
    }

    async getInventoryItemList() {
        const url = `${apiBaseUrl}/${INVENTORY_ITEM_ENDPOINT}`;
        try {

            const response = await fetch(url, {
                method: "GET",
                // body: JSON.stringify({
                //     username: page.usernameInput.value,
                //     password: page.passwordInput.value
                // }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${hciBlazerToken}`
                }
            });


            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

customElements.define("inventory-item-list", InventoryItemList);
