import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Grid, Box, Icon, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { createCheckoutSession, handleSuccessfulPayment } from "lib/stripe";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const MotionCard = motion(Card);

const individualPlans = [
  {
    name: "Free",
    price: "$0",
    period: "14 days",
    priceId: "price_free",
    planType: "free",
    features: [
      "Basic job search",
      "Manual proposal submission",
      "Limited job tracking",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Individual",
    price: "$29",
    period: "per month",
    priceId: "price_individual",
    planType: "individual",
    features: [
      "Advanced job search",
      "AI-powered proposals",
      "Unlimited job tracking",
      "Advanced analytics",
      "Priority support",
      "Custom templates",
    ],
    highlighted: true,
  },
];

const companyPlans = [
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    priceId: "price_enterprise",
    planType: "enterprise",
    features: [
      "Everything in Individual plan",
      "Up to 5 team members",
      "Team collaboration tools",
      "Advanced reporting",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    highlighted: true,
  },
];

const SubscriptionPlans = ({ accountType, onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const plans = accountType === "individual" ? individualPlans : companyPlans;

  const handlePlanSelect = (plan) => {
    if (paymentComplete && selectedPlan) {
      return;
    }
    
    setSelectedPlan(plan);
    if (plan.name == "Free") {
      handleFreePlanSelect(plan);
    } else {
      setShowSummary(true);
    }
  };

  const handleFreePlanSelect = async (plan) => {
    setLoading(true);
    try {
      await createCheckoutSession(plan.price, accountType, plan.planType);
      setPaymentComplete(true);
      setSelectedPlan(plan);
      onPlanSelect(plan);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        throw new Error(error.message);
      }

      await createCheckoutSession(selectedPlan.price, accountType, selectedPlan.planType);
      setPaymentComplete(true);
      setSelectedPlan(selectedPlan);
      onPlanSelect(selectedPlan);
      setShowSummary(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSummary(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} md={6} lg={6} key={plan.name}>
            <MotionCard
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: plan.highlighted
                  ? "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)"
                  : "white",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: plan.highlighted ? "scale(1.08)" : "translateY(-10px)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                  "&::before": {
                    opacity: 1,
                  },
                  "& .MuiButton-root": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                },
              }}
            >
              <SoftBox p={4} sx={{ position: "relative", zIndex: 1 }}>
                <SoftBox mb={2}>
                  <SoftTypography variant="h5" fontWeight="bold">
                    {plan.name}
                  </SoftTypography>
                  <SoftBox display="flex" alignItems="baseline" mt={1}>
                    <SoftTypography variant="h3" fontWeight="bold" color="info">
                      {plan.price}
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text" ml={1}>
                      /{plan.period}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>

                <SoftBox
                  sx={{
                    mt: "auto",
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <SoftButton
                    variant={plan.highlighted ? "contained" : "outlined"}
                    color="info"
                    fullWidth
                    onClick={() => handlePlanSelect(plan)}
                    disabled={loading || (paymentComplete && selectedPlan?.name === plan.name)}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                      },
                    }}
                  >
                    {loading && selectedPlan?.name === plan.name 
                      ? "Processing..." 
                      : paymentComplete && selectedPlan?.name === plan.name 
                        ? "Selected" 
                        : "Select Plan"}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showSummary} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <SoftTypography variant="h5" fontWeight="bold">
            Complete Your Subscription
          </SoftTypography>
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <SoftBox>
              <SoftBox mb={3}>
                <SoftTypography variant="h6" fontWeight="bold" mb={2}>
                  Order Summary
                </SoftTypography>
                <SoftBox display="flex" justifyContent="space-between" mb={1}>
                  <SoftTypography variant="body2">Plan:</SoftTypography>
                  <SoftTypography variant="body2" fontWeight="bold">
                    {selectedPlan.name}
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="space-between" mb={1}>
                  <SoftTypography variant="body2">Billing Period:</SoftTypography>
                  <SoftTypography variant="body2" fontWeight="bold">
                    {selectedPlan.period}
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="space-between" mb={2}>
                  <SoftTypography variant="body2">Total:</SoftTypography>
                  <SoftTypography variant="h6" color="info" fontWeight="bold">
                    {selectedPlan.price}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>

              <SoftBox mb={3}>
                <SoftTypography variant="h6" fontWeight="bold" mb={2}>
                  Payment Details
                </SoftTypography>
                <SoftBox
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
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
                </SoftBox>
              </SoftBox>
            </SoftBox>
          )}
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleClose} color="secondary">
            Cancel
          </SoftButton>
          <SoftButton
            onClick={handleSubscribe}
            color="info"
            variant="gradient"
            disabled={loading || !stripe}
          >
            {loading ? "Processing..." : `Pay ${selectedPlan?.price}`}
          </SoftButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

SubscriptionPlans.propTypes = {
  accountType: PropTypes.oneOf(["individual", "company"]).isRequired,
  onPlanSelect: PropTypes.func.isRequired,
};

export default SubscriptionPlans; 