const paypal = require('paypal-rest-sdk')
const express = require('express')
const paypalRouter = express.Router()

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AS622L2fp8OX3RngScZZiD_Te8wd0qgyfve9N6wUTe3ZAA3fKMI6VI6oF5ro--OpZznKdVLz7pkI3FxM',
    'client_secret': 'ECqBKcFyL2jSldRv9KVTRHH20dOdqlzC8atzgdeqFRVyWpPAwwn4ZYjd4d5x9haYgGsirmY3T-TP0sCf'
  });

  paypalRouter.post('/pay',(req,res)=>{
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/paypal/success",
            "cancel_url": "http://localhost:3000/paypal/failed"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Nahhhhh",
                    "sku": "002",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
           for(let i =0;i<payment.links.length;i++){
               if(payment.links[i].rel==='approval_url'){
                   res.redirect(payment.links[i].href)
               }
           }
        }
    });
  })
  paypalRouter.get('/success',(req,res)=>{
      const payerID = req.query.PayerID
    var execute_payment_json = {
        "payer_id":payerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]
    };
    
    var paymentId = req.query.paymentId;
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
        }
    });
  })
  module.exports = paypalRouter