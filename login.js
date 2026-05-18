// Show Login Page
function showLogin() {
    document.getElementById("login-page").style.display = "block";
    document.getElementById("register-page").style.display = "none";
    document.getElementById("forgot-password-page").style.display = "none";

    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
}

// Show Register Page
function showRegister() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("register-page").style.display = "block";
    document.getElementById("forgot-password-page").style.display = "none";

    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".tab-button:nth-child(2)").classList.add("active");
}

// Show Forgot Password Page
function showForgotPassword() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("register-page").style.display = "none";
    document.getElementById("forgot-password-page").style.display = "block";
}

// Google Login (Mock)
function googleLogin() {
    alert("Redirecting to Google authentication...");
}

// Facebook Login (Mock)
function facebookLogin() {
    alert("Redirecting to Facebook authentication...");
}


// LoginUser() 
function loginUser() {
    const phone=document.getElementById("phone").value.trim();
    const password=document.getElementById("password").value.trim();
    fetch('http://localhost:5000/api/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({phone,password})
    }).then(res=>res.json()).then(data=>{
        alert(data.message);
        localStorage.setItem("currentUser",JSON.stringify(data.user));
        window.location.href='index.html';
    }).catch(err=>alert(err.message));
}



// Register Functionality
function registerUser() {
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let phone = document.getElementById("register-phone").value;
    let password = document.getElementById("register-password").value;

    if (name && email && phone && password) {
        alert("Registration successful! Please login.");
        showLogin();
    } else {
        alert("Please fill out all fields.");
    }
}

// Forgot Password Functionality
function resetPassword() {
    let email = document.getElementById("forgot-email").value;

    if (email) {
        alert("A password reset link has been sent to " + email);
        showLogin();
    } else {
        alert("Please enter your email.");
    }
}

// Set default page to Login on load
document.addEventListener("DOMContentLoaded", showLogin);

function loginLater() {
    alert("You are skipping login and entering as a guest.");
    window.location.href = "index.html"; // Redirect to homepage without login
}
// Back Button Functionality
document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "entrance.html";
});

function resendOTP(){
    const phone=document.getElementById("phone").value.trim();
    fetch('http://localhost:5000/api/forgot-password/send-otp',{
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone})
    }).then(res=>res.json()).then(data=>{
        alert(`New OTP sent: ${data.otp}`);
    });
}