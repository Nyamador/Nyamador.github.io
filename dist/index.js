'use-strict';

// TODOO :CREATE COLLECTIONS (Shipment){fullname, from , to, date, status}

const findPackage = document.querySelector('#find-package');
const tracking = document.querySelector('input[name="tracking"]');
const loadingModal = document.querySelector('#loading_overlay');
const body = document.querySelector('.ov');
const requiredText = document.querySelector('.required-error');
const shipmentScreen = document.querySelector('.shipment-screen');

findPackage.addEventListener('submit', function (event) {
  event.preventDefault();
  if (tracking.value == '') {
    tracking.classList.add('is-invalid');
    requiredText.style.display = 'block';
  } else {
    tracking.classList.remove('is-invalid');
    requiredText.style.display = 'none';
    loadingModal.style.display = 'block';
    body.classList.add('overflow');
    console.log(tracking.value);
  }
});

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: 'AIzaSyC6goPMkZjr_U   ZUKYykZYkI2QX6R8ydGuA',
  authDomain: 'deployment-240922.firebaseapp.com',
  databaseURL: 'https://deployment-240922.firebaseio.com',
  projectId: 'deployment-240922',
  storageBucket: 'deployment-240922.appspot.com',
  messagingSenderId: '426588903294',
  appId: '1:426588903294:web:9cbb2cae7a4c4c5b1b052f',
});
// // Initialize Firebase
// // const defaultProject = firebase.initializeApp(firebaseConfig);



// var db = firebase.firestore();

// db.collection('users').add({
//     name : 'Desmond',
//     born: 1999
// }).then(function(docRef){
//     console.log(docRef.id)
// }).catch(function(error){
//     console.error(error)
// });
