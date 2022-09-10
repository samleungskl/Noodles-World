const {validatePhoneNumber} = require('./validatePhoneNumber.js');
 
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

  $('#trackPhoneNumberField').keyup(() => {
    const orderPhoneNumber = $('#trackPhoneNumberField').val();
    $('#trackPhoneNumberField').removeClass('is-invalid')
  });

  $("#trackOrderBtn").click(function () {
    event.preventDefault()
    $("#trackResults").hide();
    const orderPhoneNumber = $('#trackPhoneNumberField').val();
    const isPhoneNumberValid = validatePhoneNumber(orderPhoneNumber)
    console.log('isPhoneNumberValid', isPhoneNumberValid)
    if (isPhoneNumberValid) {
      axios.get(`http://localhost:3002/track`, {
        params: {
          orderPhoneNumber: orderPhoneNumber
        }
      })
        .then(function (response) {
          console.log(response.data);

          $("#trackResults").show();
          let resultHTML = ''
          if (response.data.length === 0) {
            resultHTML = 'There are no records associated with this phone number.'
          } else {
            response.data.forEach(element => {
              let table = '';
              let orderSubtotal = 0;
              element.order_line_items.forEach((lineItem) => {
                orderSubtotal += Number(lineItem.line_item_price)
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
          }

          $("#trackResults").html(`${resultHTML}`);
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    } else {
      console.log('showing stickyAlert')
      $('#trackPhoneNumberField').addClass('is-invalid')
      $('#trackingPhoneNumberFeedback').addClass('invalid-feedback')
      $('#trackingPhoneNumberFeedback').html('Phone number must be 10 digits and only contain numbers.')
    }
  })
});