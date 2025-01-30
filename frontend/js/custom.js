// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 6
        }
    }
})

// document.querySelector('.login-form').addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent form from submitting and refreshing the page

//     const username = document.querySelector('input[placeholder="username"]').value.trim();
//     const password = document.querySelector('input[placeholder="password"]').value.trim();

//     if (username === 'admin' && password === 'admin2') {
//         // Redirect to the managerial page
//         window.location.href = 'managerial.html';
//     } else {
//         // Show an error message
//         alert('Invalid username or password. Please try again.');
//     }
// });

function showRegister() {
    document.getElementById("login-form-div").classList.add("hide");
    document.getElementById("register-form-div").classList.remove("hide");
  }

  function showLogin() {
    document.getElementById("register-form-div").classList.add("hide");
    document.getElementById("login-form-div").classList.remove("hide");
  }


  
document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const address = document.getElementById("register-address").value.trim();
    const phone = document.getElementById("register-phone").value.trim();

    if (!name || !email || !password || !address || !phone) {
        alert("Please fill in all fields correctly!");
        return;
    }


    registerCustomerRequest();


    document.getElementById('register-form').reset();
});

function registerCustomerRequest() {
    const registerName = document.getElementById("register-name").value;
    const registerEmail = document.getElementById("register-email").value;
    const registerPassword = document.getElementById("register-password").value;
    const registerAddress = document.getElementById("register-address").value;
    const registerPhone = document.getElementById("register-phone").value;

    //also get file
    console.log(registerName)
    console.log(registerEmail)
    console.log(registerPassword)
    console.log(registerAddress)
    console.log(registerPhone)


    const requestData = {
        customer_name: registerName,
        customer_email: registerEmail,
        customer_password: registerPassword,
        customer_address: registerAddress,
        customer_phone: registerPhone,
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

    fetch(`http://localhost:3000/createCustomer`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
   
    alert('Create register');

}
