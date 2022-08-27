$(document).ready(function () {
    //update cart size
    const cartSize = (JSON.parse(localStorage.cart)).length
    $("#cart_items_count").text(cartSize);
});