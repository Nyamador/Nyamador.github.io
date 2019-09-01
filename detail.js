//zoom
$(document).ready(function() {
  $(".img-item a").mouseover(function(e) {
    e.preventDefault();
    $(".imagesku").attr("src", $(this).attr("href"));
  });

  $(".xzoom").xzoom({
    position: "left",
    mposition: "fullscreen",
    lensClass: "xzoom-lens",
    zoomClass: "xzoom-preview"
  });
});

//ajax add-to-cart

// recently viewed products
if (typeOf(Storage) !== "undefined") {
  //getting the localstorage item
  const viewedStorage = localStorage.getItem("Recently_viewed");
  const recentlyViewedSku = document.querySelector("#data-add-to-cart").dataset
    .sku;

  if (viewedstorage === null || undefined) {
    localStorage.setItem("Recently_viewed", `["${recentlyViewed}"]`);
  } else {
    //get the localstorage item
    const existingSkus = localStorage.getItem("Recently_viewed");
    //convert the array into a string
    const stringedValue = JSON.parse();
    //push the new item in the array
    stringedValue.push(stringedValue);
    //Update the existing localstorage array
    localStorage.setItem("Recently_viewed", JSON.stringify(stringedValue));
  }
} else {
  console.log("No web support");
}










<div class="subscription-container -vt-row">
    <div class="subscription-wrapper -vt-row">
      <div class="subscription-logo">
      <img src="vel.png" class="vt-logo-img">
      </div>
      <div class="subscription-form ">
      <form method="" class="-vt-row">
        <input class="subscription-input" placeholder="E-mail address" value="nyamadordesmond@yahoo.com">
        <button value="Subscribe" class="subscription-btn">Subscribe</button>
      </form>
      <p>Sign up to receive reqular email updates on the latest products,deals and more!</p>
      </div>
      </div>
    </div>
  
  
  <nav class="footer-nav -vt-row">
    <ul class="col-3-12">
    <li><span class="footer-head">Get To Know Us</span></li>
    <li><a href="#">About Us</a></li>
    <li><a href="#">Terms & Conditions</a></li>
    <li><a href="#">Privacy Policy</a></li>    
    <li><a href="#">Guidelines</a></li>   
    </ul>
    
    <ul class="col-3-12">
    <li><span class="footer-head">Policy</span></li>
    <li><a href="#">Payments</a></li>
    <li><a href="#">Shipping</a></li>
    <li><a href="#">FAQ</a></li>        
    </ul>

    <ul class="col-3-12">
    <li><span class="footer-head">Help</span></li>
    <li><a href="#">Help Center</a></li>
    <li><a href="#">How To Buy</a></li>
    <li><a href="#">Return Policy</a></li>    
    <li><a href="#">Delivery Timelines</a></li>      
    </ul>   
    
    <ul class="col-3-12">
    <li><span class="footer-head">Social</span></li>
    <li><a href="#" class="-vt-row">
      <svg viewBox="0 0 24 24" id="vty-facebook">
        <g>
          <path id="soc-facebook_a" d="M15.7 12h-2.4v9H9.7v-9H8V8.8h1.7v-2c0-1.5.7-3.8 3.6-3.8H16v3.1h-2c-.3 0-.7.2-.7.9v1.8H16l-.3 3.2z">
          </path>
        </g>
      </svg>
      Facebook
    </a></li>
    <li><a href="#" class="-vt-row">
      <svg viewBox="0 0 24 24" id="vty-instagram">
        <path d="M17.52 3H6.48A3.48 3.48 0 0 0 3 6.48v11.04A3.48 3.48 0 0 0 6.48 21h11.04A3.48 3.48 0 0 0 21 17.52V6.48A3.48 3.48 0 0 0 17.52 3zm1 2.08h.4v3.04l-3.04.01-.01-3.05h2.65zm-9.09 5.07A3.16 3.16 0 0 1 12 8.83 3.16 3.16 0 0 1 15.17 12 3.17 3.17 0 0 1 12 15.17 3.17 3.17 0 0 1 8.83 12c0-.69.23-1.33.6-1.85zm9.82 7.37c0 .95-.78 1.73-1.73 1.73H6.48a1.73 1.73 0 0 1-1.73-1.73v-7.37h2.7A4.89 4.89 0 0 0 7.07 12 4.93 4.93 0 0 0 12 16.92 4.93 4.93 0 0 0 16.92 12c0-.65-.13-1.28-.36-1.85h2.69v7.37z">
        </path>
      </svg>
    Instagram
    </a></li>
    <li><a href="#" class="-vt-row">
    <svg width="18" class="m-r-10" viewBox="0 0 32 32" id="vty-youtube">
      <path fill="white" d="M31.7 9.6c0 0-0.3-2.2-1.3-3.2-1.2-1.3-2.6-1.3-3.2-1.4-4.5-0.3-11.2-0.3-11.2-0.3h0c0 0-6.7 0-11.2 0.3-0.6 0.1-2 0.1-3.2 1.4-1 1-1.3 3.2-1.3 3.2s-0.3 2.6-0.3 5.2v2.4c0 2.6 0.3 5.2 0.3 5.2s0.3 2.2 1.3 3.2c1.2 1.3 2.8 1.2 3.5 1.4 2.6 0.2 10.9 0.3 10.9 0.3s6.7 0 11.2-0.3c0.6-0.1 2-0.1 3.2-1.4 1-1 1.3-3.2 1.3-3.2s0.3-2.6 0.3-5.2v-2.4c0-2.6-0.3-5.2-0.3-5.2zM12.7 20.2v-9l8.6 4.5-8.6 4.5z"> 
      </path></svg>
    You Tube
    </a></li>    
    <li><a href="#" class="-vt-row">
      <svg viewBox="0 0 24 24" id="vty-twitter">
        <path d="M19.6 6.7a4.3 4.3 0 001.8-2.4 8 8 0 01-2.6 1 4 4 0 00-3-1.3c-2.2 0-4 2-4 4.3v1c-3.4-.2-6.4-2-8.4-4.5a4.4 4.4 0 00-.6 2.1c0 1.5.8 2.8 1.9 3.6a4 4 0 01-1.9-.5c0 2.1 1.4 3.8 3.3 4.2a3.9 3.9 0 01-1 .2 3.9 3.9 0 01-.9 0c.6 1.6 2 2.9 3.9 2.9A8 8 0 012 19.1 11.3 11.3 0 008.3 21C15.8 21 20 14.5 20 8.8v-.6A8.5 8.5 0 0022 6a8 8 0 01-2.4.7z">
        </path>
      </svg>   
    Twitter
    </a></li>        
    </ul>     
  </nav>
  </footer>
    <!--Footer//-->

