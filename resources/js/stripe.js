import { loadStripe } from '@stripe/stripe-js'
import {placeOrder} from './apiService'
import { CardWidget } from './CardWidget';

export async function initStrip() {

    const stripe = await loadStripe('pk_test_51Jgu6rSDsUDX8JkBPyrgFnANCmdCtntaLFqt1km8j5K4nQSN87VCjuWYNqF9jA4CIGFdB2ivRnoulpWNySg3pT6Q00utLXabDO');
    let card = null;

  /*  function mountWidget() {
        const elements = stripe.elements()

        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };
        card = elements.create('card', { style, hidePostalCode: true })
        card.mount('#card-element')

    }
*/
    const paymentTpye = document.querySelector('#paymentType')
    if(!paymentTpye){
        return;
    }
    paymentTpye.addEventListener('change', (e) => {
        //console.log(e);
        if (e.target.value === 'card') {
            //Display Widget
            card = new CardWidget(stripe)
            card.mount()

            //mountWidget();

        } else {
            card.destroy();
        }
    })
    //Ajax call
    const paymentForm = document.querySelector('#payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if(!card){
                //Ajax
                placeOrder(formObject);
                //console.log(formObject);
                return;
            }
            
           const token = await card.createToken()
           formObject.stripeToken = token._id;
           placeOrder(formObject)

            //verify card
         /* stripe.createToken(card).then((result)=>{
                //console.log(result)
                formObject.stripeToken = result.token.id;
                placeOrder(formObject)
            }).catch((err)=>{
                console.log(err)
            })*/

        })

    }
}