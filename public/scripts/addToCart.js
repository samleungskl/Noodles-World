$(document).ready(function () {

    $(".addToCartBtn").click(function () {
        const name = $(this).data("name");
        const price = $(this).data("price");
        const object = [{
            name: name,
            price: price,
        }]

        console.log('before', localStorage.cart)
        if (localStorage.cart) {
            const existingCart = JSON.parse(localStorage.cart)
            localStorage.cart = JSON.stringify(existingCart.concat(object))
        } else {
            localStorage.cart = JSON.stringify(object)
        }
        console.log('after', localStorage.cart)

        //update cart size
        const cartSize = (JSON.parse(localStorage.cart)).length
        $("#cart_items_count").text(cartSize);
    });

});