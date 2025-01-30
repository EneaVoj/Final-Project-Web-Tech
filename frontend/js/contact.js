document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const msg = document.getElementById("customer-msg").value.trim();
    if (!name || !email || !phone || !msg) {
        alert("Please fill in all fields correctly!");
        return;
    }

        storeSubs();
    

    document.getElementById('contact-form').reset();
});

function storeSubs() {
    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const customerPhone = document.getElementById("customer-phone").value;
    const customerMsg = document.getElementById("customer-msg").value;

    // Log values for debugging
    console.log(customerName);
    console.log(customerEmail);
    console.log(customerPhone);
    console.log(customerMsg);

    // Create a JSON object
    const requestData = {
        sub_name: customerName,
        sub_email: customerEmail,
        sub_phone: customerPhone,
        sub_msg: customerMsg
    };

    // Configure the request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set content type to JSON
        },
        body: JSON.stringify(requestData), // Convert JSON object to string
        redirect: "follow"
    };

    // Send the POST request
    fetch(`http://localhost:3000/subscribe`, requestOptions)
        .then((response) => response.json()) // Parse the JSON response
        .then((result) => console.log(result)) // Log the result
        .catch((error) => console.error(error)); // Handle errors

        showModal(customerName);
}

function showModal(customerName) {
    const modalBody = document.querySelector('#myModal .modal-body p');
    modalBody.textContent = `${customerName} has subscribed successfully!`;
    $('#myModal').modal('show');
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