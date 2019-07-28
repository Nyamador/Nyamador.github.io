//checking for service worker compatibility
// if('serviceWorker' in navigator){
//   window.addEventListener('load', () =>{
//   navigator.serviceWorker
//   .register('/serviceworker.js')
//   .then(reg => console.log('service worker registered')) 
//     .catch(err => console.log(`Service Worker: Error : ${err}`));     
//   });
// }


// var slideIndex = 1;
// showSlides(slideIndex);

// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }

// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

// function showSlides(n) {
//   var i;
//   var slides = document.getElementsByClassName("blogSlides");
//   var dots = document.getElementsByClassName("blogSlider__dots--dot");
//   if (n > slides.length) {
//     slideIndex = 1
//   }
//   if (n < 1) {
//     slideIndex = slides.length
//   }
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex - 1].style.display = "block";
//   dots[slideIndex - 1].className += " active";
// }
// bb = document.getElementById("bn");         
// document.addEventListener('load', () => {       
//             bb.style.opacity = "1"   ;                                  
//              });