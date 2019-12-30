const $  = require('jQuery.js');
//Pay with rave
const API_publicKey = "FLWPUBK_TEST-748392a5bb000134182a75d3bcffa41e-X";

    function payWithRave() {
        var x = getpaidSetup({
            PBFPubKey: API_publicKey,
            customer_email: "dselasi4u@gmail.com",
            amount: 2000,
            customer_phone: "233206335155",
            currency: "GHS",
            txref: "rave-123456",
            meta: [{
                metaname: "vello",
                metavalue: "AP1234"
            }],
            onclose: function() {},
            callback: function(response) {
                var txref = response.tx.txRef; // collect txRef returned and pass to a server page to complete status check.
                console.log("This is the response returned after a charge", response);
                if (
                    response.tx.chargeResponseCode == "00" ||
                    response.tx.chargeResponseCode == "0"
                ) {
                    // redirect to a success page
                } else {
                    // redirect to a failure page.
                }

                x.close(); // use this to close the modal immediately after payment.
            }
        });
    }

$(document).ready(function(){
	//Product price increment for product list on feed page
    $('.quantity').each(function() {
      var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        const unitCost = $('#feed-product-price').data('unitCost');
        $('#feed-product-price').text("GHC " + unitCost * newVal);
      });

      btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        const unitCost = $('#feed-product-price').data('unitCost');
        $('#feed-product-price').text("GHC " + unitCost * newVal);
      });

    });


    	//Modal for mobile devices
      const toggleButton = document.querySelectorAll('#modal-toggler'); //Button to trigger event
      const mobileModal = document.getElementById('m-modal'); // Modal
      const mainContent = document.getElementById('main'); // Body

      //opening modal
      toggleButton.forEach(function modalOpener(toggleButton) {
        toggleButton.addEventListener('click', function(){
            mobileModal.style = "display:block";
            mainContent.classList.add( "blur" );
        });
      });
      //Closing mobile modal
      document.getElementById('close').onclick = function modalCloser() {
      document.getElementById('m-modal').style = "display:none";
      document.getElementById("main").classList.remove( "blur" );
        // if(!$(this.target).is('#m-modal')){
        //   $("#main").hide();
        // }
    }

    //Bringing out the original screen on screen blur
    const main = document.getElementById('main');
        if( $('#main').hasClass('blur')){

      window.onclick = function(event){
                  if(event.target.id != $("#m-modal")){
               document.getElementById('m-modal').style = "display:none";
      document.getElementById("main").classList.remove( "blur" );
        }
      }
    }


    	//stories
        $('.feed-card--media').slick({
        // setting-name: setting-value
        // arrows:true,
        // dots: true,
        infinite: false,
        edgeFriction: 0.05,
        // appendDots: $('.er'),
        // dotsClass: 'feed-slider--dots',
        mobileFirst: true,
      });

      let stories = new Zuck('stories', {
      skin: 'facesnap',      // container class
      avatars: true,         // shows user photo instead of last story item preview
      list: false,           // displays a timeline instead of carousel
      openEffect: true,      // enables effect when opening story - may decrease performance
      cubeEffect: false,     // enables the 3d cube effect when sliding story - may decrease performance
      autoFullScreen: false, // enables fullscreen on mobile browsers
      backButton: true,      // adds a back button to close the story viewer
      backNative: false,     // uses window history to enable back button on browsers/android
      previousTap: true,     // use 1/3 of the screen to navigate to previous item when tap the story
      localStorage: true,    // set true to save "seen" position. Element must have a id to save properly.
      // reactive: true,        // set true if you use frameworks like React to control the timeline (see react.sample.html)

  stories: [

          Zuck.buildTimelineItem(
            "ramon",
            "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/1.jpg",
            "Ramon",
            "https://ramon.codes",
            timestamp(),
            [
              ["ramon-1", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/1.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/1.jpg", '', false, false, timestamp()],
              ["ramon-2", "video", 0, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/2.mp4", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/2.jpg", '', false, false, timestamp()],
              ["ramon-3", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/3.png", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/3.png", 'https://ramon.codes', 'Visit my Profile', false, timestamp()]
            ]
          ),
          Zuck.buildTimelineItem(
            "gorillaz",
            "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/2.jpg",
            "Gorillaz",
            "",
            timestamp(),
            [
              ["gorillaz-1", "video", 0, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/4.mp4", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/4.jpg", '', false, false, timestamp()],
              ["gorillaz-2", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/5.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/5.jpg", '', false, false, timestamp()],
            ]
          ),
          Zuck.buildTimelineItem(
            "ladygaga",
            "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/3.jpg",
            "Lady Gaga",
            "",
            timestamp(),
            [
              ["ladygaga-1", "photo", 5, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/6.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/6.jpg", '', false, false, timestamp()],
              ["ladygaga-2", "photo", 3, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/7.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/7.jpg", 'http://ladygaga.com', false, false, timestamp()],
            ]
          ),
          Zuck.buildTimelineItem(
            "starboy",
            "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/4.jpg",
            "The Weeknd",
            "",
            timestamp(),
            [
              ["starboy-1", "photo", 5, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/8.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/8.jpg", '', false, false, timestamp()]
            ]
          ),
          Zuck.buildTimelineItem(
            "riversquomo",
            "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/users/5.jpg",
            "Rivers Cuomo",
            "",
            timestamp(),
            [
              ["riverscuomo", "photo", 10, "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/9.jpg", "https://raw.githubusercontent.com/ramon82/assets/master/zuck.js/stories/9.jpg", '', false, false, timestamp()]
            ]
          )
  ],



});
})
