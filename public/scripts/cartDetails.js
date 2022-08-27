$(document).ready(function () {
    const cartData = JSON.parse(localStorage.cart);

    let resultHTML = '';
    cartData.forEach((element,index) => {
        resultHTML += `<tr>
        <td>${index+1}</td>
        <td>${element.name}</td>
        <td><a class="deleteFromCartBtn" data-index="${index}">Delete</a></td>
        <td>\$${element.price}</td>
        </tr>`
    });

    $("#cartDetails").html(resultHTML);

    const cartSubtotal = cartData.reduce((previousValue, currentValue)=>{
        return previousValue + currentValue.price;
    }, 0 )

    const cartSubtotalTax = cartSubtotal *0.05
    const cartGrandTotal = cartSubtotal+cartSubtotalTax
    $("#cartSubTotal").html(`\$${cartSubtotal.toFixed(2)}`);
    $("#cartSubTotalTax").html(`\$${cartSubtotalTax.toFixed(2)}`);
    $("#cartGrandTotal").html(`\$${cartGrandTotal.toFixed(2)}`);
});