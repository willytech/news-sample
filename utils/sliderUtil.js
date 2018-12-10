/**
 * Author: Kazeem Olanipekun
 * Date: 09/12/2018
 * Page: Slider Util
 * @type {Array}
 */

var slideIndex = 0;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slider");
    // var dots = document.getElementsByClassName("dot");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (i = 0; i < slides.length; i++) slides[i].style.display = "none";
    slides[slideIndex - 1].style.display = "block";
}

function showSliders(interval) {
    var i;
    var slides = document.getElementsByClassName("slider");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSliders, interval ? interval * 1000 : 10000); // Change image every 10 seconds
}
