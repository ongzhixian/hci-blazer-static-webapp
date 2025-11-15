'use strict';

const localDevelopment = window.location.hostname === 'localhost';
const apiBaseUrl = localDevelopment ? "http://localhost:7265/api" : "http://localhost:7265/api";

if (window.location.pathname != '/login.html')
{
    const hciBlazerToken = localStorage.getItem("hci-blazer-token");

    if (!hciBlazerToken) {
        console.log('Missing Hci-Blazer bearer token; redirecting to log in page.');
        window.location.href = "./login.html";
    }

    console.log(`Token retrieved from localstorage: ${hciBlazerToken}`);
}

