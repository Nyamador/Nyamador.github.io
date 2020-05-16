'use-strict';


const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
const pay = document.querySelector('#pay');
const mobilePay = document.querySelector('#mobile-pay');

const loader = `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<path fill="white" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(134.456 25 25)">
  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
  </path>
</svg>`


function toggleModal() {
    modal.classList.toggle("show-modal");
}


function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

function parseFormData(){
    const fullName = document.querySelector('input[name="fullname"]');
    const street = document.querySelector('input[name="street"]');
    const landmark = document.querySelector('input[name="landmark"]');
    const telephone = document.querySelector('input[name="telephone"]');
    const town = document.querySelector('input[name="town"]')
    const url = fullName.dataset.url;

    address_data = {
        fullname : fullName.value,
        street : street.value,
        landmark : landmark.value,
        telephone: telephone.value,
        town : town.value,
    }

    const data = JSON.stringify(address_data);
    pay.innerHTML = loader;
    mobilePay.innerHTML = loader;
    pay.style.pointerEvents = "none";
    mobilePay.style.pointerEvents = "none";
    console.log(data);
}



pay.addEventListener("click", parseFormData);
mobilePay.addEventListener("click", parseFormData);



// trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
