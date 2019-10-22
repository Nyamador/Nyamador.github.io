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
