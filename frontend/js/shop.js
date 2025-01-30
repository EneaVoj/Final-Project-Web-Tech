function renderShopProduct() {

    const url = 'http://localhost:3000/getProducts';

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((results) => {
            if (results !== null && results.length > 0) {
                results.forEach(product => {
                    let productCard = document.createElement('div');
                    productCard.classList.add('col-sm-6');
                    productCard.classList.add('col-md-4');
                    productCard.classList.add('col-lg-3');

                    productCard.innerHTML = `
                        <div class="box">
                            <a href="/single.html#${product["id"]}">
                                <div class="img-box">
                                    <img src="http://localhost:3000/images/${product["product_img_path"]}" alt="">
                                </div>
                                <div class="detail-box">
                                    <h6>
                                    ${product["product_name"]}
                                    </h6>
                                    <h6>
                                        Price
                                        <span>
                                        $${product["product_price"]}
                                        </span>
                                    </h6>
                                </div>
                                <div class="new">
                                    <span>
                                        New
                                    </span>
                                </div>
                            </a>
                            
                            <div class="product-btn-group-s">
                                <div class="button add-cart add-cart-btn" data-id="${product["id"]}" 
                                     data-name="${product["product_name"]}" 
                                     data-price="${product["product_price"]}" 
                                     data-img="${product["product_img_path"]}">
                                    <i class='bx bxs-cart'></i> Add to Cart
                                </div>
                            </div>
                        </div>
                `;
                    document.getElementById("shop-products").appendChild(productCard);
                });


                // Add event listener for "Add to Cart" buttons
                document.querySelectorAll('.add-cart-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent event bubbling

                        const product = {
                            id: e.target.dataset.id,
                            name: e.target.dataset.name,
                            price: e.target.dataset.price,
                            img: e.target.dataset.img,
                            quantity: 1,
                        };

                        // Get current cart from localStorage
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        let foundProduct = false;

                        cart.forEach(product => {
                            if (product["id"] == e.target.dataset.id) {
                                product["quantity"] = product["quantity"] + 1;
                                foundProduct = true;
                            }
                        });

                        if (!foundProduct) {
                            cart.push(product);
                        }

                        // Save updated cart back to localStorage
                        localStorage.setItem('cart', JSON.stringify(cart));

                        showModal(product.name);
                    });
                });
            }
        })
        .catch((error) => console.error(error));
}

function showModal(productName) {
    const modalBody = document.querySelector('#myModal .modal-body p');
    modalBody.textContent = `${productName} has been added to your cart!`;
    $('#myModal').modal('show');
}

renderShopProduct();


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