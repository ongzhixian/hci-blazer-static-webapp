// HTML Templates

const borrowerTemplate = document.createElement("template");
borrowerTemplate.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<style>
.hide {
    display: none;
}
.negative-feedback {
    color: red;
}
</style>
<h3>Borrower</h3>
<fieldset style="text-align:left; margin: 1rem 0;">
    <div class="container">
        <div class="row" style="margin-bottom: 2rem;">
            <div class="column">
                <label for="borrowerIdInput">Borrower ID *</label>
                <input type="text" id="borrowerIdInput" name="borrowerId" placeholder="Example 'SXxxxYyyZ" required value="S1234123Z" />
                <p>would like to borrow blazer with item code <code id="selectedItemCode">HS(123) - S20</code></p>
            </div>
            <div class="column"></div>
        </div>
        
        <div class="row">
            <div class="float-right">
                <button class="button-primary" type="button" id="borrowButton">Borrow</button>
                <button class="button-primary" type="button" id="resetButton">Reset</button>
            </div>
        </div>
        <div class="row">
            <p id="feedbackMessage" class="feedback message"></p>
        </div>
    </div>
</fieldset>
`;


const findInventoryItemTemplate = document.createElement("template");
findInventoryItemTemplate.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
<style>
.hide {
    display: none;
}
</style>
<h2>Find Item to borrow</h2>
<fieldset style="text-align:left; margin: 1rem 0;">
    <div class="container">
        <div class="row" style="margin-bottom: 2rem;">
            <div class="column">
                <label for="itemCodeInput">Item Code *</label>
                <input type="text" id="itemCodeInput" name="inventoryItemCode" placeholder="Example 'HS(14) - S01'" required value="HS(14) - S01" />
            </div>
            <div class="column"></div>
        </div>
        
        <div class="row">
            <div class="float-right">
                <button class="button-primary" type="button" id="findButton">Find</button>
            </div>
        </div>
        <div class="row">
            <p id="feedbackMessage" class="feedback message"></p>
        </div>
    </div>
</fieldset>
<table class="inventory-item hide" id="inventoryItemTable">
<thead>
    <tr>
        <th>Item Code</th>
        <th>Year</th>
        <th>Size</th>
        <th></th>
    </tr>
</thead>
<tbody></tbody>
</table>
`;

////////////////////////////////////////////////////////////////////////////////

class FindInventoryItemXX extends HTMLElement {
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


class SetBorrower extends HTMLElement {

    #itemCode;

    #borrowerIdInput;
    #borrowButton;
    #resetButton;
    #selectedItemCode;
    #feedbackMessage;

    #borrowButtonClickHandler = this.borrowInventoryItem.bind(this);
    #resetButtonClickHandler = this.reset.bind(this);

    set itemCode(itemCode) {
        this.#itemCode = itemCode.ItemCode;
        this.#selectedItemCode.innerHTML = itemCode.ItemCode;
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.appendChild(borrowerTemplate.content.cloneNode(true));

        this.#selectedItemCode = this.shadowRoot.getElementById('selectedItemCode');
        this.#feedbackMessage = this.shadowRoot.getElementById('feedbackMessage');


        this.#borrowerIdInput = this.shadowRoot.getElementById('borrowerIdInput');
        this.#borrowButton = this.shadowRoot.getElementById('borrowButton');
        this.#resetButton = this.shadowRoot.getElementById('resetButton');

        this.#borrowButton.addEventListener('click', this.#borrowButtonClickHandler);
        this.#resetButton.addEventListener('click', this.#resetButtonClickHandler);
    }

    async disconnectedCallback() {
        this.#borrowButton.removeEventListener('click', this.#borrowButtonClickHandler);
        this.#resetButton.removeEventListener('click', this.#resetButtonClickHandler);
    }

    async borrowInventoryItem() {
        console.log('Borrow item');

        const url = `${apiBaseUrl}/inventory-item-loan`;
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    itemCode: this.#itemCode,
                    borrowerId: this.#borrowerIdInput.value,
                })
            });

            if (!response.ok) {
                this.#feedbackMessage.innerHTML = await response.text();
                this.#feedbackMessage.classList.add('negative-feedback');
            }
            else
            {
                this.#feedbackMessage.classList.remove('negative-feedback');
                this.#feedbackMessage.innerHTML = "Registration done.";
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    reset() {
        const resetToFindInventoryItemEvent = new CustomEvent('reset-to-find-inventory-item');
        this.dispatchEvent(resetToFindInventoryItemEvent);
    }
}

class FindInventoryItem extends HTMLElement {

    #itemCodeInput;
    #findButton;
    #inventoryItemTable;
    #findButtonClickHandler = this.findInventoryItem.bind(this);

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.appendChild(findInventoryItemTemplate.content.cloneNode(true));
        this.#itemCodeInput = this.shadowRoot.getElementById('itemCodeInput');
        this.#findButton = this.shadowRoot.getElementById('findButton');
        this.#findButton.addEventListener('click', this.#findButtonClickHandler);

        this.#inventoryItemTable = this.shadowRoot.getElementById('inventoryItemTable');
        this.render();
    }

    async disconnectedCallback() {
        this.#findButton.removeEventListener('click', this.#findButtonClickHandler);
    }

    async findInventoryItem() {
        const inventoryItemList = await this.getInventoryItemSearchResults();

        this.inventoryItemList = inventoryItemList;

        // Assume results
        if (inventoryItemList.length > 0)
            this.#inventoryItemTable.classList.remove("hide")
        else {
            if (!this.#inventoryItemTable.classList.contains("hide"))
                this.#inventoryItemTable.classList.add("hide");
        }

        this.render();
    }

    async getInventoryItemSearchResults() {

        const url = `${apiBaseUrl}/${INVENTORY_ITEM_ENDPOINT}/search?item-code=${encodeURIComponent(this.#itemCodeInput.value)}`;

        try {

            const response = await fetch(url, {
                method: "GET",
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

    set inventoryItemList(list) {
        // Clear existing light DOM children safely
        // this.replaceChildren(); // NOTE: replaceChildren() removes all light DOM children!

        const tbody = this.shadowRoot.querySelector("tbody");
        tbody.innerHTML = ""; // clear existing rows

        list.forEach(record => {
            const tr = document.createElement("tr");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style.display = "flex";
            checkbox.style.margin = "auto"
            checkbox.style.width = "20px";
            checkbox.style.height = "20px";

            checkbox.addEventListener("change", (event) => {
                this.selectInventoryItem(event, record);
            });

            const checkboxCell = document.createElement("td");
            checkboxCell.appendChild(checkbox);

            tr.innerHTML = `
<td>${record.ItemCode}</td>
<td>${record.Year}</td>
<td>${record.Size}</td>
`;
            tr.appendChild(checkboxCell); // Append the cell with the attached listener

            tbody.appendChild(tr); // now inside shadow DOM <tbody>
        });
    }

    selectInventoryItem(event, inventoryItem) {
        const dataToSend = {
            timestamp: new Date().toISOString(),
            value: inventoryItem
        };

        // 1. Create the CustomEvent with a unique name and data in the detail property
        const inventoryItemSelectedEvent = new CustomEvent('inventory-item-selected', {
            detail: dataToSend,
            bubbles: true, // Allow the event to bubble up the DOM tree
            composed: true  // Allow the event to cross the Shadow DOM boundary
        });

        this.dispatchEvent(inventoryItemSelectedEvent);
    }

    render() {
    }
}


class BorrowInventoryItem extends HTMLElement {
    // 1. Private field for internal state
    #count = 0;
    #selectedInventoryItem = null;
    #state = 'FindInventoryItem';

    #findInventoryItemWebComponent;
    #inventoryItemSelectedHandler = this.handleInventoryItemSelected.bind(this);


    #setBorrowerWebComponent;
    #resetToFindInventoryItemHandler = this.resetToFindInventoryItem.bind(this);

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        if (this.#findInventoryItemWebComponent != null)
            this.#findInventoryItemWebComponent.removeEventListener('inventory-item-selected', this.#inventoryItemSelectedHandler);
        if (this.#setBorrowerWebComponent != null)
            this.#setBorrowerWebComponent.addEventListener('reset-to-find-inventory-item', this.#resetToFindInventoryItemHandler);

        if (this.#state === 'FindInventoryItem') {
            this.shadowRoot.innerHTML = `<find-inventory-item></find-inventory-item>`;
            this.#findInventoryItemWebComponent = this.shadowRoot.querySelector('find-inventory-item');
            this.#findInventoryItemWebComponent.addEventListener('inventory-item-selected', this.#inventoryItemSelectedHandler);
        } else {
            this.shadowRoot.innerHTML = `<set-borrwer></set-borrwer>`;
            this.#setBorrowerWebComponent = this.shadowRoot.querySelector('set-borrwer');
            this.#setBorrowerWebComponent.addEventListener('reset-to-find-inventory-item', this.#resetToFindInventoryItemHandler);
            this.#setBorrowerWebComponent.itemCode = this.#selectedInventoryItem;
        }
    }

    resetToFindInventoryItem(event) {
        this.#selectedInventoryItem = null;
        this.#state = "FindInventoryItem"
        this.render();
    }

    handleInventoryItemSelected(event) {
        this.#selectedInventoryItem = event.detail.value;
        this.#state = "SetBorrower"
        this.render();
    }
}


customElements.define("set-borrwer", SetBorrower);
customElements.define("find-inventory-item", FindInventoryItem);
customElements.define("borrow-inventory-item", BorrowInventoryItem);
