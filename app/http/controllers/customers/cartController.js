const { update } = require("../../../models/menu")

function cartController() {
    return {
        index(req, res) {

            res.render('customers/cart')
        },
        
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            //for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            //console.log(cart)

            //check if items does not exist in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] =
                {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }

            return res.json({ totalQty: req.session.cart.totalQty })
            
        },
        delete(req,res)
        {
            //console.log(req.body._id)
            //console.log(req.session.cart.items)
            if(req.session.cart.items[req.body._id])
            {
               
                req.session.cart.totalQty = req.session.cart.totalQty - req.session.cart.items[req.body._id].qty

                req.session.cart.totalPrice = req.session.cart.totalPrice - req.body.price * req.session.cart.items[req.body._id].qty

               delete req.session.cart.items[req.body._id]
               
            }
           return res.json({ totalQty: req.session.cart.totalQty})

            //return res.json({data:'deleted'})
        },
        decrease(req,res)
        {
            if(req.session.cart.items[req.body._id] && req.session.cart.items[req.body._id].qty != 1)
            {
               
                req.session.cart.items[req.body._id].qty = req.session.cart.items[req.body._id].qty - 1
                req.session.cart.totalQty = req.session.cart.totalQty - 1
                req.session.cart.totalPrice = req.session.cart.totalPrice - req.body.price
               
            }
           return res.json({ totalQty: req.session.cart.totalQty})

        },
        increase(req,res)
        {
            if(req.session.cart.items[req.body._id])
            {
               
                req.session.cart.items[req.body._id].qty = req.session.cart.items[req.body._id].qty + 1
                req.session.cart.totalQty = req.session.cart.totalQty + 1
                req.session.cart.totalPrice = req.session.cart.totalPrice + req.body.price
               
            }
           return res.json({ totalQty: req.session.cart.totalQty})
            
          //  return res.json({data:'add'})
        }
    }
}

    module.exports = cartController