// Newsletter Subscription Form Handler
document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.querySelector(".newsletter form");
    newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailInput = newsletterForm.querySelector("input[type='email']").value;
        if (emailInput) {
            alert("Thank you for subscribing! 📩");
            newsletterForm.reset();
        }
    });
});
