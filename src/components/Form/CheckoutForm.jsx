




import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';

import './CheckoutForm.css';
import Button from '../Shared/Button/Button';
import { PropTypes } from 'prop-types';

const CheckoutForm = (
  {closeModal,
  purchaseInfo,
  refetch}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

   
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <div className='flex justify-around mt-2 space-x-3'>
      <Button disabled={!stripe} label={`Pay ${10} $`}/>
      <Button onClick={closeModal} label={'Cancel'}/>
      
      </div>
     
    </form>
  );
};

CheckoutForm.propTypes = {
  closeModal:PropTypes.string,
  refetch:PropTypes.string,
  purchaseInfo:PropTypes.string
}

export default CheckoutForm;