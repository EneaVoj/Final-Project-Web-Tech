document.getElementById("product-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const desc = document.getElementById("product-desc").value.trim();
    const price = parseFloat(document.getElementById("product-price").value.trim());
    const imageFile = document.getElementById("product-image").files[0];

    if (!name || !desc || isNaN(price) || price <= 0 || !imageFile) {
        alert("Please fill in all fields correctly!");
        return;
    }

    isCreate = (document.getElementById("buttonCreate").classList.value == "active")

    if (isCreate) {
        storeProductRequest();
    } else {
        updateProductRequest();
    }

    document.getElementById('product-form').reset();
});

function renderProduct() {

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
                    const productCard = document.createElement("div");
                    productCard.className = "product-card";

                    productCard.id = `product-id-${product["id"]}`;
                    productCard.innerHTML = `
                    <input type="hidden" class="product-id" value="${product["id"]}">
                    <img class="image" src="http://localhost:3000/images/${product["product_img_path"]}" alt="${product["product_name"]}" />
                    <h3 class="name">${product["product_name"]}</h3>
                    <p>Price: $<span class="price">${product["product_price"]}</span></p>
                    <p style="display:none" class="description">${product["product_desc"]}</p>
                    <button onclick="editProduct('${product["id"]}')">Edit</button>
                    <button onclick="deleteProductModal('${product["id"]}')">Delete</button>
                `;

                    document.getElementById("products-grid").appendChild(productCard);
                });
            }


        })
        .catch((error) => console.error(error));
    document.getElementById("products-grid").innerHTML = "";
}

function editProduct(productId) {

    const product_card = document.getElementById(`product-id-${productId}`)

    document.getElementById("product-id").value = productId;
    document.getElementById("product-name").value = product_card.getElementsByClassName("name")[0].innerHTML;
    document.getElementById("product-desc").value = product_card.getElementsByClassName("description")[0].innerHTML;
    document.getElementById("product-price").value = product_card.getElementsByClassName("price")[0].innerHTML;

    const createH = document.getElementById("createHeader");
    const editH = document.getElementById("editHeader");
    createH.classList.remove("show");
    createH.classList.add("hide");
    editH.classList.remove("hide");
    editH.classList.add("show");

    const createButton = document.getElementById("buttonCreate");
    const editButton = document.getElementById("buttonUpdate");
    createButton.classList.replace("active", "nonActive");
    editButton.classList.replace("nonActive", "active");
}

function storeProductRequest() {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);


    const productName = document.getElementById("product-name").value;
    const productDesc = document.getElementById("product-desc").value;
    const productPrice = document.getElementById("product-price").value;
    const imageFile = document.getElementById("product-image").files[0];

    //also get file
    console.log(productName)
    console.log(productDesc)
    console.log(productPrice)
    console.log(imageFile)

    
    const formdata = new FormData();
    formdata.append("file", imageFile, imageFile.name);
    formdata.append("product_name", productName);
    formdata.append("product_desc", productDesc);
    formdata.append("product_price", productPrice);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    fetch(`http://localhost:3000/createProduct`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
   
        showModal(productName);

    renderProduct();
}

function updateProductRequest() {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);

    const productId = document.getElementById("product-id").value;
    const productName = document.getElementById("product-name").value;
    const productDesc = document.getElementById("product-desc").value;
    const productPrice = document.getElementById("product-price").value;
    const imageFile = document.getElementById("product-image").files[0];

    //also get file
    console.log(productId)
    console.log(productName)
    console.log(productDesc)
    console.log(productPrice)
    console.log(imageFile)


    const formdata = new FormData();
    formdata.append("file", imageFile, imageFile.name);
    formdata.append("product_name", productName);
    formdata.append("product_desc", productDesc);
    formdata.append("product_price", productPrice);

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    fetch(`http://localhost:3000/updateProduct/${productId}`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    alert('Edited product ID: ' + productId);

    const createH = document.getElementById("createHeader");
    const editH = document.getElementById("editHeader");
    createH.classList.replace("hide", "show");
    editH.classList.replace("show", "hide");


    const createButton = document.getElementById("buttonCreate");
    const editButton = document.getElementById("buttonUpdate");
    createButton.classList.replace("nonActive", "active");
    editButton.classList.replace("active", "nonActive");

    renderProduct();
}

function deleteProductModal(productId) {
    showModalDeletion(productId);
}

function showModalDeletion(productId) {
    $('#myModalProductDeletion').modal('show');
    const deleteButton = document.getElementById("deleteProductModalButton");

    if (deleteButton) {
        deleteButton.onclick = function () {
            deleteProduct(productId);
        };
    }
}


function deleteProduct(productId) {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginData.accessToken}`);
    
    const url = `http://localhost:3000/deleteProduct/${productId}`;

    // Configure the request options
    const requestOptions = {
        method: "DELETE", // HTTP DELETE method
        headers: myHeaders,
        redirect: "follow",
    };

    // Send the DELETE request
    fetch(url, requestOptions)
        .then((response) => {
            if (response.ok) {
                renderProduct(); // Refresh the product list
            } else {
                throw new Error("Failed to delete the product");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Error deleting the product. Please try again.");
        });

    $('#myModalProductDeletion').modal('hide');

}


function showModal(productName) {
    const modalBody = document.querySelector('#myModalProductCreation .modal-body p');
    modalBody.textContent = `${productName} has been created!`;
    $('#myModalProductCreation').modal('show');
}


renderProduct();

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