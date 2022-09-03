$(document).ready(function () {


  $("#trackOrderBtn").click(function () {
    event.preventDefault()
    const orderPhoneNumber = $('#trackPhoneNumberField').val();
    console.log('orderPhoneNumber', orderPhoneNumber)
    axios.get(`http://localhost:3002/track`, {
      params: {
        orderPhoneNumber: orderPhoneNumber
      }
    })
      .then(function (response) {
        console.log(response.data);
        let resultHTML = ''
        response.data.forEach(element => {
          let table = '';
          let orderSubtotal = 0;
          element.order_line_items.forEach((lineItem) => {
            orderSubtotal+= Number(lineItem.line_item_price)
            table += `<tr>
            <td>${lineItem.line_item_name}</td>
            <td>$${lineItem.line_item_price}</td>
            </tr>`
          })
          let tax = orderSubtotal * 0.05;
          let orderGrandtotal = orderSubtotal + tax;
          resultHTML += `
          <div class="card">
          <h5 class="card-header">Order: #${element.order_id}</h5>
          <div class="card-body">
            <h4>Ordered on: ${element.order_created_on}</h4>
            <h4>Estimated Ready Time: ${element.order_created_on}</h4>
            <h4>Ready on: ${element.order_ready_on}</h4>
            <h4>Fullfilled on: ${element.order_fulfilled_on}</h4>
            <table>
            <thead>
            <tr>
            <th>Item</th>
            <th>Price</th>
            </tr>
            </thead>
            <tbody>
            ${table}
            </tbody>
            <tfoot>
            <tr>
            <th>Subtotal</th>
            <td>$${orderSubtotal.toFixed(2)}</td>
            </tr>
            <tr>
            <th>Tax @5%</th>
            <td>$${tax.toFixed(2)}</td>
            </tr>
            <tr>
            <th>Total</th>
            <td>$${orderGrandtotal.toFixed(2)}</td>
            </tr>
            </tfoot>
            </table>
          </div>
        </div>`
        });
        $("#trackResults").html(`${resultHTML}`);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  })
});