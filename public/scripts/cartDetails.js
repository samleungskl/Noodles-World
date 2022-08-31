$(document).ready(function () {

    const loadTable = () => {
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

        //update cart size
        const cartSize = (JSON.parse(localStorage.cart)).length
        $("#cart_items_count").text(cartSize);
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
    });
    //initial load
    loadTable()
});