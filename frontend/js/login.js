document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();


    if (!email || !password) {
        alert("Please fill in all fields correctly!");
        return;
    }


    loginCustomerRequest();


    document.getElementById('login-form').reset();
});


function loginCustomerRequest() {
    const loginEmail = document.getElementById("login-email").value;
    const loginPassword = document.getElementById("login-password").value;

    console.log(loginEmail);
    console.log(loginPassword);

    const requestData = {
        customer_email: loginEmail,
        customer_password: loginPassword,
    };


    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
        redirect: "follow"
    };

    fetch(`http://localhost:3000/login`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            console.log(result);

            const {
                accessToken,
                userData
            } = result;

            if (accessToken && userData) {
                const combinedData = {
                    accessToken,
                    userData
                };

                localStorage.setItem('loginData', JSON.stringify(combinedData));

                console.log("AccessToken and UserData stored in localStorage");
                if (userData.admin === 1) {
                    window.location.replace(
                        "/managerial.html",
                    );

                } else {
                    window.location.replace(
                        "/index.html",
                    );

                }

                alert('Login Successful');
            } else {
                alert('Login failed: Invalid response from server');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('Login failed: Unable to process the request');
        });
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