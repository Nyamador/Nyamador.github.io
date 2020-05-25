'use-strict';

// TODOO :CREATE COLLECTIONS (Shipment){fullname, from , to, date, status}

const findPackage = document.querySelector('#find-package');
const tracking = document.querySelector('input[name="tracking"]');
const loadingModal = document.querySelector('#loading_overlay');
const body = document.querySelector('.ov');
const requiredText = document.querySelector('.required-error');
const shipmentScreen = document.querySelector('.shipment-screen');
const newShipment = document.querySelector('#new-shipment');
// Shipment Creation Nodes
const createShipment = document.querySelector('#create-shipment');
const fullName = document.querySelector('input[name=fullname]');
const pickup = document.querySelector('input[name=pickup]');
const destination = document.querySelector('input[name=destination]');
const modal = document.querySelector('#modalResults');
const modalContent = document.querySelector('#modalContent');
const closeModal = document.querySelector('.close');

// Initialize firebase
var firebaseConfig = {
  apiKey: 'AIzaSyC6goPMkZjr_UZUKYykZYkI2QX6R8ydGuA',
  authDomain: 'deployment-240922.firebaseapp.com',
  databaseURL: 'https://deployment-240922.firebaseio.com',
  projectId: 'deployment-240922',
  storageBucket: 'deployment-240922.appspot.com',
  messagingSenderId: '426588903294',
  appId: '1:426588903294:web:9cbb2cae7a4c4c5b1b052f',
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var shipmentRef = db.collection('shipment');

// =======================================
//                Query Firebase
// =======================================
/**
 *
 * @param {string} trackingId
 */
function queryFirebase(trackingId) {
  db.collection('shipment')
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        if (trackingId == doc.id) {
          return doc.data();
          console.log(doc.data());
        } else {
          return false;
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// ========================================
//              Create Document
// ========================================
function createDocument(data) {
  db.collection('shipment')
    .add(data)
    .then(function (docRef) {
      return docRef.id;
    })
    .catch(function (error) {
      console.error(error, 'There was an error');
    });
}

// Mimic URL Change with HTML5 Push State
// =============================================
//                    ROUTING
// ==============================================
newShipment.addEventListener('click', function (event) {
  if (newShipment.textContent === 'Click Here to Find Your Shipment') {
    history.pushState('', '', '/');
    newShipment.textContent = 'Click Here to Create Shipment';
    findPackage.style.display = 'block';
    createShipment.style.display = 'none';
  } else {
    history.pushState('', '', 'new');
    newShipment.textContent = 'Click Here to Find Your Shipment';
    findPackage.style.display = 'none';
    createShipment.style.display = 'block';
  }
});

// =============================================
//              New Shipment
// =============================================
createShipment.addEventListener('submit', function (event) {
  event.preventDefault();
  loadingModal.style.display = 'block';
  body.classList.add('overflow');
  const shipmentAction = document.querySelector('#shipment-action');
  shipmentAction.textContent = 'Creating Shipment';
  shipment = {
    fullname: fullName.value,
    pickup: pickup.value,
    destination: destination.value,
    status: 'Not Picked',
  };
  db.collection('shipment')
    .add(shipment)
    .then(function (docRef) {
      loadingModal.style.display = 'none';
      body.classList.remove('overflow');
      modalContent.innerHTML = `<p> Your Shipment Was Created Successfully</p>
       <strong>${docRef.id} </strong>
       <small>Keep this key safe to help you track the status of
       your shipment
       </small>
      `;
      modal.style.display = 'block';
      console.log(docRef.id);
    })
    .catch(function (error) {
      loadingModal.style.display = 'none';
      body.classList.remove('overflow');
      modalContent.textContent = 'There was an error';
      modal.style.display = 'block';
      console.error(error, 'There was an error');
    });
});

findPackage.addEventListener('submit', function (event) {
  event.preventDefault();
  if (tracking.value == '') {
    tracking.classList.add('is-invalid');
    requiredText.style.display = 'block';
  } else {
    // Display Modal
    tracking.classList.remove('is-invalid');
    requiredText.style.display = 'none';
    loadingModal.style.display = 'block';
    body.classList.add('overflow');

    db.collection('shipment')
      .doc(tracking.value)
      .get()
      .then((doc) => {
        console.log(doc.data());
        results = doc.data();
        loadingModal.style.display = 'none';
        body.classList.remove('overflow');
        modal.style.display = 'block';
        modalContent.innerHTML = `
          <p> Fullname : ${results.fullname} </p>
          <p> Pickup Point : ${results.pickup} </p>
          <p> Destination : ${results.destination} </p>
          <strong style="color: green"> Status : ${results.status} </strong>
        `;
      })
      .catch(function (error) {
        loadingModal.style.display = 'none';
        body.classList.remove('overflow');
        modal.style.display = 'block';
        modalContent.textContent = 'Could Not Find Shipment';
        console.error(error);
      });
  }
});

// Find data from Collection

// ==========================
//        Misc
// ===========================
closeModal.addEventListener('click', function () {
  modal.style.display = 'none';
});
