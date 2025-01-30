function renderOrders() {
    const orderTable = document.getElementById("orders_table");

    const loginData = localStorage.getItem("loginData");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:3000/getAllOrders", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const orders = JSON.parse(result).orders;
            for (const [key, value] of Object.entries(orders)) {
                let rowOrder = document.createElement("tr");
                rowOrder.innerHTML = `
                <td>${key}</td>
                    <td><a href="#" class="customer-name" data-customer='${JSON.stringify(value.customer, null, 0)}'>${value.customer.customer_name}</a></td>
                            <td>
                                <select class="status-dropdown">
                                    <option value="pending">Pending</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </td>
                            <td><a href="#" data-products='${JSON.stringify(value.products, null, 0)}' class="view-products">View Products</a></td>
                            <td>$${calculateTotalOrder(value.products)}</td>
                    `;
                orderTable.appendChild(rowOrder);
            }
            renderModals();
        })

        .catch((error) => console.error(error));
}

function calculateTotalOrder(products) {
    let total = 0;

    products.forEach(product => {
        total = total + (product.quantity * product.product_price);
    });

    return total;
}

// Function to update dropdown color based on selected value
function updateDropdownColors() {
    const dropdowns = document.querySelectorAll('.status-dropdown');
    dropdowns.forEach((dropdown) => {
        const value = dropdown.value;

        // Remove existing color classes
        dropdown.classList.remove('pending', 'sold');

        // Add color class based on the value
        if (value === 'pending') {
            dropdown.classList.add('pending');
        } else if (value === 'sold') {
            dropdown.classList.add('sold');
        }
    });
}


function renderModals() {
    // Run the function on page load
    document.addEventListener('DOMContentLoaded', () => {
        updateDropdownColors();

        // Update colors dynamically when dropdown value changes
        document.querySelectorAll('.status-dropdown').forEach((dropdown) => {
            dropdown.addEventListener('change', updateDropdownColors);
        });
    });


    /// Open modal when customer name is clicked
    document.querySelectorAll('.customer-name').forEach((customer) => {
        customer.addEventListener('click', (e) => {
            e.preventDefault();

            const modal = document.getElementById('modal-card-modal');
            const customer = JSON.parse(e.target.dataset.customer);

            // Update the customer name in the modal dynamically
            document.getElementById('modal-customer-name').textContent = customer.customer_name;
            document.getElementById('modal-customer-phone').textContent = customer.customer_phone;
            document.getElementById('modal-customer-email').textContent = customer.customer_email;
            document.getElementById('modal-customer-address').textContent = customer.customer_address;

            // Show the modal by adding the 'active' class
            modal.classList.add('active');
        });
    });

    // Close modal when clicking outside the card
    document.getElementById('modal-card-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-card-modal')) {
            // Remove the 'active' class to hide the modal
            document.getElementById('modal-card-modal').classList.remove('active');
        }
    });



    // Function to render products inside the shopping cart modal
    function renderOrderProducts(products) {
        const shoppingProductsContainer = document.getElementById('shopping-products');
        shoppingProductsContainer.innerHTML = ''; // Clear previous content

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('item');
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

    // Open the cart modal
    document.querySelectorAll('.view-products').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const cartModal = document.getElementById('cart-modal');
            const product = JSON.parse(e.target.dataset.products);

            renderOrderProducts(product); // Replace with dynamic product data
            cartModal.classList.add('active');
        });
    });

    // Close the cart modal
    document.getElementById('close-cart-modal').addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.remove('active');
    });

    // Close modal when clicking outside the cart
    document.getElementById('cart-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('cart-modal')) {
            document.getElementById('cart-modal').classList.remove('active');
        }
    });
}

renderOrders();
renderModals();

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