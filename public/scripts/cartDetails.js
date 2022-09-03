$(document).ready(function () {

    const loadTable = () => {
        console.log('localStorage.cart', localStorage.cart)
        if (localStorage.cart) {
            $("#emptyCart").hide();
            $("#returnHomeBtn").hide();
            const cartData = JSON.parse(localStorage.cart);

            let resultHTML = '';
            cartData.forEach((element, index) => {
                resultHTML += `<tr>
            <td>${index + 1}</td>
            <td>${element.name}</td>
            <td><a class="deleteFromCartBtn" data-index="${index}">Delete</a></td>
            <td>\$${element.price}</td>
            </tr>`
            });

            $("#cartDetails").html(resultHTML);

            const cartSubtotal = cartData.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.price;
            }, 0)

            const cartSubtotalTax = cartSubtotal * 0.05
            const cartGrandTotal = cartSubtotal + cartSubtotalTax
            $("#cartSubTotal").html(`\$${cartSubtotal.toFixed(2)}`);
            $("#cartSubTotalTax").html(`\$${cartSubtotalTax.toFixed(2)}`);
            $("#cartGrandTotal").html(`\$${cartGrandTotal.toFixed(2)}`);
        } else {
            $("#cartDetailsSection").hide();
            $("#emptyCart").show();
            $("#returnHomeBtn").show();
        }
    }

    const loadCart = () => {
        if (localStorage.cart) {
            const cartSize = (JSON.parse(localStorage.cart)).length
            $("#cart_items_count").text(cartSize);
            console.log('cart loaded')
        } else {
            $("#cart_items_count").text('0');

        }
    }

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

        loadCart()
    });

    $("#cartTable").on("click", ".deleteFromCartBtn", function () {
        const existingCart = JSON.parse(localStorage.cart)
        const deleteIndex = $(this).data("index");
        existingCart.splice(deleteIndex, 1)
        console.log(deleteIndex)
        localStorage.cart = JSON.stringify(existingCart)
        $(this).closest("tr").remove();
        //update cart size
        const cartSize = (JSON.parse(localStorage.cart)).length

        loadTable()
    });

    $(".placeOrderBtn").click(function () {
        event.preventDefault()
        const customerName = $('#customerName').val();
        const customerPhoneNumber = $('#customerPhoneNumber').val();
        const existingCart = JSON.parse(localStorage.cart)

        const dataToPost = {
            order_customer_name: customerName,
            order_customer_phone_number: customerPhoneNumber,
            resturant_id: 1,
            existingCart: existingCart,
        }
        console.log(dataToPost)
        axios.post('http://localhost:3002/orders', dataToPost)
            .then((response) => {
                console.log('here!', response.data.orderId)
                $("#cartDetailsSection").hide();
                $("#receivedMessage").html(`<div class='text-center'><h2>Thank you for your order.</h2><h2>Your order id is #${response.data.orderId}.</h2> <h2>You can track your order status here.</h2> <h2>We will text you when your order is ready for pick up.</h2><a class='btn btn-warning' href='/'>Return to Home</a></div>`);
                localStorage.clear();
                loadCart();
            })
            .catch(function (error) {
                console.log(error);
            });
    });
    //initial load
    loadTable()
    loadCart()
});