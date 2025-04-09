




import {CardElement, useElements, useStripe, totalQuant} from '@stripe/react-stripe-js';

import './CheckoutForm.css';
import Button from '../Shared/Button/Button';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = (
  {closeModal,
  purchaseInfo,
  refetch}) => {
const navigate = useNavigate()
const axiosSecure = useAxiosSecure()
const [clientSecret, setClientSecret] = useState('') ;
const [processing, setProcessing] = useState(false)
  useEffect(() => {
     getPaymentIntent()
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseInfo])
//console.log(clientSecret)
  const getPaymentIntent = async()=>{
    try{
const {data} = await axiosSecure.post('/create-payment-intent',{
  quantity:purchaseInfo?.quantity,
  plantId: purchaseInfo?.plantId,
})

setClientSecret(data.clientSecret)
    }catch(err){
      console.log(err)
    }
  }
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    setProcessing(true)
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

   
    const card = elements.getElement(CardElement);

    if (card == null) {
      setProcessing(false)
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setProcessing(false)
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
//confirm payment
 const {paymentIntent}= await stripe.confirmCardPayment({clientSecret}, {
    payment_method: {
      card: card,
      billing_details: {
        name:purchaseInfo?.customer?.name,
        email:purchaseInfo?.customer?.email
      },
    },
  })

  if(paymentIntent.status === 'succeeded')
    try{
      await axiosSecure.post('/order',{...purchaseInfo, transactionId:paymentIntent?.id,} )
      await axiosSecure.patch(`plants/quantity/${purchaseInfo?.plantId}`, {
        quantityToUpdate: totalQuant,
        status:'decrease',
      })
      toast.success('Order SuccessFull')
      refetch();
      navigate('/dashboard/my-orders')
    }catch (err) {
      console.log(err)
    }finally{
      setProcessing(false)
      closeModal()
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
      <Button disabled={!stripe ||!clientSecret || processing}
      type='submit'
       label={`Pay ${purchaseInfo?.price} $`}/>
      <Button outline={true} onClick={closeModal} label={'Cancel'}/>
      
      </div>
     
    </form>
  );
};

CheckoutForm.propTypes = {
  closeModal:PropTypes.string,
  refetch:PropTypes.string,
  purchaseInfo:PropTypes.object,
  totalQuant:PropTypes.number
}

export default CheckoutForm;