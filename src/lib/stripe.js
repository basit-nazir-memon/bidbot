import { loadStripe } from '@stripe/stripe-js';
import { envConfig } from 'env';

// Initialize Stripe
const stripePromise = loadStripe(envConfig.stripePublicKey);

// Function to create a checkout session
export const createCheckoutSession = async (amount, accountType, planType) => {
    try {
        amount = amount.replace('$', '')
        const response = await fetch(`${envConfig.backend}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({
                amount,
                accountType,
                planType,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to create checkout session');
        }

        // Store the subscription info in localStorage for later use
        localStorage.setItem('subscription_info', JSON.stringify({
            accountType: data.accountType,
            startDate: data.startDate,
            endDate: data.endDate
        }));

        // // Redirect to Stripe Checkout
        // const stripe = await stripePromise;
        // const { error } = await stripe.redirectToCheckout({
        //     sessionId: data.id,
        // });

        // if (error) {
        //     throw new Error(error.message);
        // }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

// Function to handle successful payment
export const handleSuccessfulPayment = async (sessionId) => {
    try {
        const response = await fetch(`${envConfig.backend}/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({
                sessionId,
            }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Payment verification failed');
        }

        // Update the subscription info in localStorage
        const subscriptionInfo = JSON.parse(localStorage.getItem('subscription_info') || '{}');
        localStorage.setItem('subscription_info', JSON.stringify({
            ...subscriptionInfo,
            verified: true,
            paymentStatus: 'paid'
        }));

        return result;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

// Function to get current subscription info
export const getSubscriptionInfo = () => {
    try {
        const subscriptionInfo = localStorage.getItem('subscription_info');
        return subscriptionInfo ? JSON.parse(subscriptionInfo) : null;
    } catch (error) {
        console.error('Error getting subscription info:', error);
        return null;
    }
};

// Function to check if subscription is active
export const isSubscriptionActive = () => {
    const subscriptionInfo = getSubscriptionInfo();
    if (!subscriptionInfo) return false;

    const now = new Date();
    const endDate = new Date(subscriptionInfo.endDate);
    return now < endDate && subscriptionInfo.verified && subscriptionInfo.paymentStatus === 'paid';
}; 