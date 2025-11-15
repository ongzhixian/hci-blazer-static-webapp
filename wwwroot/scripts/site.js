'use strict';

const hciBlazerToken = localStorage.getItem("hci-blazer-token");

if (!hciBlazerToken){
    console.log('Missing Hci-Blazer bearer token; redirecting to log in page.');
    window.location.href = "./login.html";
}

console.log(`Token retrieved from localstorage: ${hciBlazerToken}`);
