const paypal = require('paypal-rest-sdk')
const express = require('express')
const paypalRouter = express.Router()

paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': 'AdK17DGpBwPAGbTeBcFseupca3-CjTCjvRzxBngTHL98jaA0D8CMnKo5_kQJiQVIBAyOJ076C8Xag7Gu',
    'client_secret': 'EAJoKDr5sIpTPA5DSLoiqCSJbGaNrmy9PQ2kq7ruLbRzhmbEUaeKfkrc9-9690bCSAv3K4hwzRkAtwjY'
  });

  paypalRouter.post('/pay',(req,res)=>{
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://mysterious-spire-07069.herokuapp.com/success",
            "cancel_url": "https://mysterious-spire-07069.herokuapp.com/failed"
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
          res.redirect('/')
        }
    });
  })
  module.exports = paypalRouter