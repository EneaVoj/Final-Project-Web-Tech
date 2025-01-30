function renderOrders() {
    const orderTable = document.getElementById("orders_table");

    const loginData = JSON.parse(localStorage.getItem("loginData"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3000/getOrders", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const orders = JSON.parse(result).orders;
            for (const [key, value] of Object.entries(orders)) {
                let rowOrder = document.createElement("tr");
                rowOrder.innerHTML = `
                    <td>${key}</td>
                    <td>
                        <select class="status-dropdown">
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                        </select>
                    </td>
                    <td><a href="#" data-products='${JSON.stringify(value)}' class="view-products">View Products</a></td>
                    <td>$${calculateTotalOrder(value)}</td>
                `;
                orderTable.appendChild(rowOrder);
            }
            updateDropdownColors();
            attachProductViewListeners();
        })
        .catch((error) => console.error(error));
}

function calculateTotalOrder(products) {
    let total = 0;
    products.forEach(product => {
        total += product.quantity * product.product_price;
    });
    return total;
}

function updateDropdownColors() {
    const dropdowns = document.querySelectorAll(".status-dropdown");
    dropdowns.forEach((dropdown) => {
        const value = dropdown.value;

        // Remove existing color classes
        dropdown.classList.remove("pending", "sold");

        // Add color class based on the value
        if (value === "pending") {
            dropdown.classList.add("pending");
        } else if (value === "sold") {
            dropdown.classList.add("sold");
        }
    });

    // Add event listeners to handle color updates dynamically
    dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("change", updateDropdownColors);
    });
}

function attachProductViewListeners() {
    document.querySelectorAll(".view-products").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const cartModal = document.getElementById("cart-modal");
            const products = JSON.parse(e.target.dataset.products);

            renderOrderProducts(products);
            cartModal.classList.add("active");
        });
    });

    document.getElementById("close-cart-modal").addEventListener("click", () => {
        const cartModal = document.getElementById("cart-modal");
        cartModal.classList.remove("active");
    });

    document.getElementById("cart-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("cart-modal")) {
            document.getElementById("cart-modal").classList.remove("active");
        }
    });
}

function renderOrderProducts(products) {
    const shoppingProductsContainer = document.getElementById("shopping-products");
    shoppingProductsContainer.innerHTML = ""; // Clear previous content

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("item");
        productElement.innerHTML = `
            <div class="image">
                <img class="cart-product-image" src="http://localhost:3000/images/${product.product_img_path}" alt="${product.product_name}">
            </div>
            <div class="description">
                <span>${product.product_name}</span>
            </div>
            <div class="quantity">
                ${product.quantity}
            </div>
            <div class="total-price">$${product.product_price * product.quantity}</div>
        `;
        shoppingProductsContainer.appendChild(productElement);
    });
}

// Initialize the orders rendering
renderOrders();


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
        window.location.href = "login.html"; // Redirect to login page
      });
    } else {
      // If no loginData, ensure default "Login" appearance
      loginText.textContent = "Login";
      loginLink.style.color = ""; // Reset to default color if needed
      loginLink.href = "login.html"; // Redirect to login page
    }
  });