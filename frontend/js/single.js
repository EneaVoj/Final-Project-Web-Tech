function getProductId() {
    var productId = window.location.hash.substr(1);
    return productId;
}


function renderSingleProduct() {

    const productId = getProductId();

    const url = `http://localhost:3000/getProductById/${productId}`;

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result !== null && result !== undefined) {
                let productCard = document.createElement('div');
                productCard.classList.add('row-s');

                productCard.innerHTML = `
                    <div class="col-6-s">
                        <div class="product-image-s">
                            <div class="product-image-main-s">
                                <img src="http://localhost:3000/images/${result["product_img_path"]}" alt="" id="product-main-image">
                            </div>
                        </div>
                    </div>
                    <div class="col-6-s">
                        <div class="product-s">
                            <div class="product-title-s">
                                <h2>${result["product_name"]}</h2>
                            </div>
                            <div class="product-price-s">
                                <span class="sale-price-s">$${result["product_price"]}</span>
                            </div>
        
                            <div class="product-details-s">
                                <h3>Description</h3>
                                <p>${result["product_desc"]}</p>
                            </div>
                    
                            <span class="divider"></span>
        
                            <div class="product-btn-group-s">
                                <div class="button add-cart add-cart-btn" data-id="${result["id"]}" 
                                     data-name="${result["product_name"]}" 
                                     data-price="${result["product_price"]}" 
                                     data-img="${result["product_img_path"]}">
                                    <i class='bx bxs-cart'></i> Add to Cart
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById("single-product").appendChild(productCard);


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

renderSingleProduct();

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