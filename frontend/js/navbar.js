document.addEventListener("DOMContentLoaded", function () {

    const loginData = localStorage.getItem("loginData");

    const ordersNavItem = document.querySelector(".nav-item-order");

    if (!ordersNavItem) {
        return;
    }

    if (!loginData) {
        ordersNavItem.parentNode.removeChild(ordersNavItem); // Ensure removal
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(loginData);
    } catch (error) {
        return;
    }

    if (!parsedData.userData || typeof parsedData.userData.admin === "undefined") {
        return;
    }

    const isAdmin = parsedData.userData.admin === 1;

    const orderLink = ordersNavItem.querySelector("a.nav-link");
    if (!orderLink) {
        return;
    }

    if (isAdmin) {
        orderLink.textContent = "Orders";
        orderLink.href = "order.html";
    } else {
        orderLink.textContent = "My Orders";
        orderLink.href = "myorders.html";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginData = localStorage.getItem("loginData");
    const managerialNavItem = document.querySelector(".nav-item-managerial");

    if (!managerialNavItem) {
        return;
    }

    if (!loginData) {
        managerialNavItem.remove();
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(loginData);
    } catch (error) {
        return;
    }

    if (!parsedData.userData || typeof parsedData.userData.admin === "undefined") {
        return;
    }

    const isAdmin = parsedData.userData.admin === 1;

    if (!isAdmin) {
        managerialNavItem.remove();
        return;
    }

    const orderLink = managerialNavItem.querySelector("a.nav-link");
    if (!orderLink) {
        return;
    }

    orderLink.textContent = "Managerial";
    orderLink.href = "managerial.html";
});


