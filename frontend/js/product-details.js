const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productData = JSON.parse(localStorage.getItem(productId));

if (productData) {
    const { name, desc, price, image } = productData;

    const productDetails = document.getElementById("product-details");
    productDetails.innerHTML = `
        <img src="${image}" alt="${name}" />
        <h1>${name}</h1>
        <p>${desc}</p>
        <p><strong>Price:</strong> $${price}</p>
    `;
} else {
    document.getElementById("product-details").innerHTML = `<p>Product not found!</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Check localStorage for loginData
    const loginData = localStorage.getItem("loginData");

    // Get the DOM elements for modification
    const loginLink = document.getElementById("login-link");
    const loginText = document.getElementById("login-text");

    if (!loginLink || !loginText) {
      console.error("Elements with IDs 'login-link' or 'login-text' are not found in the DOM.");
      return;
    }

    if (loginData) {
      // If loginData exists, change text to "Logout" and color to red
      loginText.textContent = "Logout";
      loginLink.style.color = "red";

      // Add event listener to handle logout
      loginLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior
        localStorage.removeItem("loginData"); // Remove loginData from localStorage
        alert("You have been logged out.");
        window.location.href = "login.html"; // Redirect to login page
      });
    } else {
      // If no loginData, ensure default "Login" appearance
      loginText.textContent = "Login";
      loginLink.style.color = ""; // Reset to default color if needed
      loginLink.href = "login.html"; // Redirect to login page
    }
  });
