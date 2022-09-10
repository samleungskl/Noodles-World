$(document).ready(function () {
    const validatePhoneNumber = (phoneNumber) => {
        console.log('phoneNumber.length', phoneNumber.length)
        if (phoneNumber.length != 10) {
            console.log('number is less than 10 digit')
            return false;
        };
        console.log('passed test 1')
        for (let element of phoneNumber) {
            console.log(parseInt(element))
            console.log('parseInt(element)', parseInt(element))
            if (parseInt(element) === 0) {
                element += 1
            }

            if (!parseInt(element)) {
                console.log('return false now')
                return false;
            }
        };
        console.log('passed test 2')
        return true;
    }

    const loadTable = () => {
        console.log('localStorage.cart', localStorage.cart);
        // console.log('localStorage.cart.length ', JSON.parse(localStorage.cart).length)
        if (localStorage.cart) {
            if (JSON.parse(localStorage.cart).length > 0) {
                $("#emptyCart").hide();
                $("#returnHomeBtn").hide();
                const cartData = JSON.parse(localStorage.cart);

                let resultHTML = '';
                cartData.forEach((element, index) => {
                    resultHTML += `<tr>
            <td class="align-baseline">${index + 1}. </td>
            <td>${element.name}<br><a class="deleteFromCartBtn fs-6" data-index="${index}">Delete</a></td>
            <td class="align-baseline">\$${element.price}</td>
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

        $('#stickyAlertContainer').append(`<div id="stickyAlert" class="sticky-bottom alert mx-5 alert-success" role="alert">Item added to cart!</div>`)
        setTimeout(function () {
            $('#stickyAlert').remove()
        }, 1000);
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
        $('#stickyAlertContainer').append(`<div id="stickyAlert" class="sticky-bottom alert mx-5 alert-danger" role="alert">Item removed from cart!</div>`)
        setTimeout(function () {
            $('#stickyAlert').remove()
        }, 1000);
        loadTable()
    });

    $('#customerPhoneNumber').keyup(() => {
        $('#customerPhoneNumber').removeClass('is-invalid')
    });

    $('#customerName').keyup(() => {
        $('#customerName').removeClass('is-invalid')
    });

    $(".placeOrderBtn").click(function () {
        event.preventDefault()
        const customerName = $('#customerName').val().trim();
        console.log('customerName', customerName)
        const customerPhoneNumber = $('#customerPhoneNumber').val();
        const existingCart = localStorage.cart ? JSON.parse(localStorage.cart) : '';
        const isCartValid = existingCart.length
        console.log('isCartValid', isCartValid)
        const isPhoneNumberValid = validatePhoneNumber(customerPhoneNumber);
        const isNameValid = customerName.length;

        if (!isCartValid) {
            window.location.href = '404';
        }

        if (!isPhoneNumberValid) {
            $('#customerPhoneNumber').addClass('is-invalid')
            $('#orderingPhoneNumberFeedback').addClass('invalid-feedback')
            $('#orderingPhoneNumberFeedback').html('Phone number must be 10 digits and only contain numbers.')
        }

        if (!isNameValid) {
            $('#customerName').addClass('is-invalid')
            $('#orderingCustomerNameFeedback').addClass('invalid-feedback')
            $('#orderingCustomerNameFeedback').html('Name cannot be blank.')
        }

        console.log('isPhoneNumberValid && isNameValid', isPhoneNumberValid, isNameValid)
        if (isPhoneNumberValid && isNameValid && isCartValid) {
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

        }
    });
    //initial load
    loadTable()
    loadCart()
});