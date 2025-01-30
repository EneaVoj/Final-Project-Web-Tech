function calculateTotal() {
    const cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : [];
    let total = 0;
    cart.forEach(product => {
        total += product.price * product.quantity;
    });

    const totalElement = document.getElementById('cart-total-price');
    totalElement.textContent = `$${total.toFixed(2)}`;

}

function renderCart() {
    // Get cart items from localStorage
    const cart = localStorage.getItem('cart') !== null ? JSON.parse(localStorage.getItem('cart')) : [];
    const cartContainer = document.getElementById("shopping-products");

    cartContainer.innerHTML = ""; // Clear existing content

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        calculateTotal();
        return;
    }

    cart.forEach(product => {
        let productCard = document.createElement('div');
        productCard.classList.add('shopping-cart-item');

        productCard.innerHTML = `
            <div class="item">
                <div class="close">
                <button class="material-icons delete-btn" data-id="${product["id"]}" type="button">&#xE5CD;</button>
                </div>
                <div class="image m-auto">
                    <img class="cart-product-image" src="http://localhost:3000/images/${product["img"]}" alt="">
                </div>
                <div class="description">
                    <span>${product["name"]}</span>
                </div>
                <div class="quantity">
                    <button class="plus-btn" data-id="${product["id"]}" type="button">+</button>
                    <input type="text" value="${product["quantity"]}">
                    <button class="minus-btn" data-id="${product["id"]}" type="button">-</button>
                </div>
                <div class="total-price">$${product["price"] * product["quantity"]}</div>
            </div>
        `;
        cartContainer.appendChild(productCard);
    });
    calculateTotal();
    checkForPlus();
    checkForMinus();
    checkForDelete();
}



function checkForPlus() {
    document.querySelectorAll('.plus-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling

            // Get current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart.forEach(product => {
                if (product["id"] == e.target.dataset.id) {
                    product["quantity"] = product["quantity"] + 1;
                }
            });

            // Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            renderCart();
        });
    });
}

function checkForMinus() {
    document.querySelectorAll('.minus-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling

            // Get current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart.forEach(product => {
                if (product["id"] == e.target.dataset.id) {
                    product["quantity"] = product["quantity"] - 1;
                    if (product["quantity"] == 0) {
                        cart = cart.filter(item => item.id !== product["id"]);
                    }
                }
            });

            // Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            renderCart();
        });
    });
}

function checkForDelete() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling

            // Get current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Remove the product with the matching ID
            const productId = e.target.dataset.id;
            cart = cart.filter(product => product.id !== productId);

            // Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            renderCart(); // Re-render the cart
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buy-button");
    const loginButton = document.getElementById("login-button");

    const loginData = localStorage.getItem("loginData");

    if (loginData) {
        buyButton.style.display = "inline-block";
        loginButton.style.display = "none";
    } else {
        buyButton.style.display = "none";
        loginButton.style.display = "inline-block";
    }



    loginButton.addEventListener("click", () => {
        window.location.href = "/login.html";
    });
});


// Add event listener for "Add to Cart" buttons
document.getElementById("buy-button").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling

    const cart = localStorage.getItem("cart") || "[]"; // Ensure it's a valid JSON string
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    if (!loginData) {
        alert("Please log in before making a purchase.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: cart,
        redirect: "follow"
    };

    fetch("http://localhost:3000/createOrder", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            showModal();
            localStorage.removeItem("cart");
            renderCart();
            console.log(result);
        })
        .catch((error) => console.error("Order failed:", error));
});


function showModal() {
    const modalBody = document.querySelector('#myModal .modal-body p');
    modalBody.textContent = "Order completed successfully";
    $('#myModal').modal('show');
}

renderCart();

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