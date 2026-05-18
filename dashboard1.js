// Get stored user details from local storage
let storedUser = JSON.parse(localStorage.getItem("user"));

// If no user is found, redirect to login page
if (!storedUser) {
    alert("Please log in first.");
    window.location.href = "login.html";
} else {
    document.getElementById("user-name").innerText = storedUser.name;
    document.getElementById("user-email").innerText = storedUser.email;
    document.getElementById("user-phone").innerText = storedUser.phone;
}

// Show Edit Profile Form
function showEditProfile() {
    document.getElementById("edit-profile-form").style.display = "block";
    document.getElementById("edit-name").value = storedUser.name;
    document.getElementById("edit-email").value = storedUser.email;
    document.getElementById("edit-phone").value = storedUser.phone;
}

// Hide Edit Profile Form
function hideEditProfile() {
    document.getElementById("edit-profile-form").style.display = "none";
}

// Save Updated Profile
function saveProfile() {
    let updatedName = document.getElementById("edit-name").value;
    let updatedEmail = document.getElementById("edit-email").value;
    let updatedPhone = document.getElementById("edit-phone").value;

    if (updatedName && updatedEmail && updatedPhone) {
        // Update stored user details
        let updatedUser = { name: updatedName, email: updatedEmail, phone: updatedPhone };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update displayed user details
        document.getElementById("user-name").innerText = updatedName;
        document.getElementById("user-email").innerText = updatedEmail;
        document.getElementById("user-phone").innerText = updatedPhone;

        alert("Profile updated successfully!");
        hideEditProfile();
    } else {
        alert("Please fill out all fields.");
    }
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}
