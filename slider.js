let index = 0;
function moveSlider() {
    const slides = document.querySelector('.slider');
    index = (index + 1) % 4;
    slides.style.transform = `translateX(-${index * 25}%)`;
}

setInterval(moveSlider, 3000);
