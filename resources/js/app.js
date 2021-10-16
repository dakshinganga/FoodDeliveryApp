import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
import { initStrip } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let deleteCartItem = document.querySelectorAll('.deleteCartItem')
let sub = document.querySelectorAll('.sub')
let add = document.querySelectorAll('.add')

function updateCart(pizza) {

    axios.post('/update-cart', pizza).then(res => {
        //console.log(res)
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart'
        }).show();

    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        //console.log(e)
        let pizza = JSON.parse(btn.dataset.pizza)
        //console.log(pizza)
        updateCart(pizza)
    })
})

function deleteItem(pizzaid){
    axios.post('/delete-item',pizzaid).then(res => {
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'warning',
            timeout: 2000,
            progressBar: false,
            text: 'Item deleted from cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}
//Deleting item from cart
deleteCartItem.forEach((bt)=>{
    bt.addEventListener('click',(e)=>{
        let pizzaid = JSON.parse(bt.dataset.pizzaid)
        deleteItem(pizzaid)
        //console.log(pizzaid); 
    })
})
//Items increasing and decreasing
function decrease(sub){
    axios.post('/subtraction',sub).then(res => {
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'information',
            timeout: 2000,
            progressBar: false,
            text: 'Item decreases from cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}
sub.forEach((bt1)=>{
    bt1.addEventListener('click',(e)=>{
        let sub = JSON.parse(bt1.dataset.sub)
        decrease(sub)
        //console.log(sub); 
    })
})


function increase(add){
    axios.post('/addition',add).then(res => {
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'information',
            timeout: 2000,
            progressBar: false,
            text: 'Item increases from cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Somthing went wrong'
        }).show();
    })
}
add.forEach((bt2)=>{
    bt2.addEventListener('click',(e)=>{
        let add = JSON.parse(bt2.dataset.add)
        increase(add)
        //console.log(add); 
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order);


initStrip()


// Socket
let socket = io()

// Join
if (order) {
    socket.emit('join', `order_${order._id}`)
}


let adminAreaPath = window.location.pathname  //admin url
if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
