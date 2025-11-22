'use strict';

const useProductionApi = true;
const localDevelopment = window.location.hostname === 'localhost' && !useProductionApi;
const apiBaseUrl = localDevelopment ? "http://localhost:7265/api" : "https://hci-blazer.azure-api.net/api/v1";

const hciBlazerToken = localStorage.getItem("hci-blazer-token");

if (window.location.pathname != '/login.html')
{
    if (!hciBlazerToken) {
        console.log('Missing Hci-Blazer bearer token; redirecting to log in page.');
        window.location.href = "./login.html";
    }

    console.debug('Token retrieved from localstorage.');
}

// API ENDPOINTS

const USER_ACCOUNT_ENDPOINT = 'user-account';
const INVENTORY_ITEM_ENDPOINT = 'inventory-item';
