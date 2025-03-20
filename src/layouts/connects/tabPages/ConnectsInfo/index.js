import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import InfoCard from "examples/Cards/InfoCards/InfoCard";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

function ConnectsInfo() {
  const [formData, setFormData] = useState({
    connectsNumber: "",
    promo: "",
    cardNumber: "",
    firstName: "",
    lastName: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    currency: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const {
      connectsNumber,
      cardNumber,
      firstName,
      lastName,
      expirationMonth,
      expirationYear,
      securityCode,
      country,
      addressLine1,
      city,
      postalCode,
      currency,
    } = formData;

    if (Number(connectsNumber) < 10) {
      setAlert({ open: true, message: "Connects should be at least 10.", severity: "warning" });
      return false;
    }

    if (!/^[0-9]{16}$/.test(cardNumber)) {
      setAlert({ open: true, message: "Invalid card number. Must be 16 digits.", severity: "warning" });
      return false;
    }

    if (Number(expirationMonth) < 1 || Number(expirationMonth) > 12) {
      setAlert({ open: true, message: "Invalid expiration month.", severity: "warning" });
      return false;
    }

    if (Number(expirationYear) < new Date().getFullYear()) {
      setAlert({ open: true, message: "Invalid expiration year.", severity: "warning" });
      return false;
    }

    if (!/^[0-9]{3,4}$/.test(securityCode)) {
      setAlert({ open: true, message: "Invalid security code.", severity: "warning" });
      return false;
    }

    if (!firstName || !lastName || !country || !addressLine1 || !city || !postalCode || !currency) {
      setAlert({ open: true, message: "All required fields must be filled.", severity: "warning" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("/api/purchase", formData, { timeout: 30000 }); // 30s timeout
      setAlert({ open: true, message: "Connects purchased successfully!", severity: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Failed to purchase connects. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = ["USD", "EUR", "GBP", "PKR", "INR"];

  return (
    <>
      <SoftBox mx={3} mt={3} mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <InfoCard title="Connects" info={50} />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard title="Connects Used This Month" info={40} />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard title="Average Connects per Job" info={10} />
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={12}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Purchase Connects
                </SoftTypography>

                <Grid container spacing={2} mt={0}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <SoftBox p={2}>
                        <SoftTypography variant="h6" fontWeight="medium" >
                          Connects Info
                        </SoftTypography>

                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                            Connects Number
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="connectsNumber"
                            type="number"
                            value={formData.connectsNumber}
                            onChange={handleChange}
                            placeholder="Number of Connects"
                          />
                        </SoftBox>
                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                            Promo Code (optional)
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="promo"
                            type="text"
                            value={formData.promo}
                            onChange={handleChange}
                            placeholder="Promo Code (optional)"
                            mt={2}
                          />
                        </SoftBox>

                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                            Currency
                          </SoftTypography>
                          <TextField
                            select
                            fullWidth
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            placeholder="Select Currency"
                          >
                            {currencyOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </SoftBox>
                      </SoftBox>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <SoftBox p={2}>
                        <SoftTypography variant="h6" fontWeight="medium">
                          Card Info
                        </SoftTypography>

                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                            Card Number
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="cardNumber"
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="Card Number"
                          />
                        </SoftBox>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <SoftBox mt={2}>
                            <SoftTypography variant="h6" fontWeight="regular">
                              Expiration Month
                            </SoftTypography>
                              <SoftInput
                                fullWidth
                                name="expirationMonth"
                                type="number"
                                value={formData.expirationMonth}
                                onChange={handleChange}
                                placeholder="Expiration Month"
                              />
                            </SoftBox>
                          </Grid>
                          <Grid item xs={6}>
                            <SoftBox mt={2}>
                              <SoftTypography variant="h6" fontWeight="regular">
                                Expiration Year
                              </SoftTypography>
                              <SoftInput
                                fullWidth
                                name="expirationYear"
                                type="number"
                                value={formData.expirationYear}
                                onChange={handleChange}
                                placeholder="Expiration Year"
                              />
                            </SoftBox>
                          </Grid>
                        </Grid>
                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                            Security Code
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="securityCode"
                            type="text"
                            value={formData.securityCode}
                            onChange={handleChange}
                            placeholder="Security Code"
                            mt={2}
                          />
                        </SoftBox>
                      </SoftBox>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Card>
                      <SoftBox p={2}>
                        <SoftTypography variant="h6" fontWeight="medium">
                          Address Info
                        </SoftTypography>

                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                          Country
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                          />
                        </SoftBox>


                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                          Address Line 1
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="addressLine1"
                            type="text"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            placeholder="Address Line 1"
                            mt={2}
                          />
                        </SoftBox>


                        <SoftBox mt={2}>
                          <SoftTypography variant="h6" fontWeight="regular">
                          Address Line 2 (optional)
                          </SoftTypography>
                          <SoftInput
                            fullWidth
                            name="addressLine2"
                            type="text"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            placeholder="Address Line 2 (optional)"
                            mt={2}
                          />
                        </SoftBox>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>

                            <SoftBox mt={2}>
                              <SoftTypography variant="h6" fontWeight="regular">
                              City
                              </SoftTypography>
                                <SoftInput
                                  fullWidth
                                  name="city"
                                  type="text"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="City"
                              />
                            </SoftBox>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <SoftBox mt={2}>
                              <SoftTypography variant="h6" fontWeight="regular">
                              Postal Code
                              </SoftTypography>
                              <SoftInput
                                fullWidth
                                name="postalCode"
                                type="text"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Postal Code"
                              />
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </SoftBox>
                    </Card>
                  </Grid>

                </Grid>

                <SoftBox mt={4}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Purchase Connects"}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>

        
      </SoftBox>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ConnectsInfo;
