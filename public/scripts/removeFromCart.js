$(document).ready(function () {

    $("#cartTable").on("click", ".deleteFromCartBtn", function () {
        const existingCart = JSON.parse(localStorage.cart)
        const deleteIndex = $(this).data("index");
        existingCart.splice(deleteIndex, 1)
        console.log(deleteIndex)
        localStorage.cart = JSON.stringify(existingCart)
        $(this).closest("tr").remove();
        //update cart size
        const cartSize = (JSON.parse(localStorage.cart)).length
        
        const cartData = JSON.parse(localStorage.cart);

        let resultHTML = '';
        cartData.forEach((element,index) => {
            resultHTML += `<tr>
            <td>${index+1}</td>
            <td>${element.name}</td>
            <td>\$${element.price}</td>
            <td><button class="deleteFromCartBtn" data-index="${index}">Delete</button></td>
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

});