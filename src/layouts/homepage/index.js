import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Images
import heroBg from "assets/images/curved-images/curved-6.jpg";
import feature1 from "assets/images/home-decor-1.jpg";
import feature2 from "assets/images/home-decor-2.jpg";
import feature3 from "assets/images/home-decor-3.jpg";

import ivana from "assets/images/ivana-square.jpg";
import bruce from "assets/images/bruce-mars.jpg";
import marie from "assets/images/marie.jpg";

const MotionCard = motion(Card);

const features = [
  {
    icon: "work",
    title: "Smart Job Management",
    description: "Automatically find, filter, and apply to the best Upwork jobs that match your skills and preferences",
    image: feature1,
  },
  {
    icon: "group",
    title: "Multi-Account Support",
    description: "Manage up to 5 Upwork accounts for your company, all from one powerful dashboard",
    image: feature2,
  },
  {
    icon: "auto_awesome",
    title: "AI-Powered Proposals",
    description: "Generate winning proposals with our advanced AI that learns from your successful applications",
    image: feature3,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Developer",
    content: "Bidbot has transformed how I work on Upwork. I've seen a 300% increase in my job success rate!",
    avatar: ivana,
  },
  {
    name: "Michael Chen",
    role: "Agency Owner",
    content: "Managing multiple Upwork accounts has never been easier. The automation features are incredible.",
    avatar: bruce,
  },
  {
    name: "Emma Davis",
    role: "Digital Marketing Expert",
    content: "The AI proposal generator is a game-changer. It's like having a professional writer on your team.",
    avatar: marie,
  },
];

const pricingPlans = [
  {
    title: "Free Trial",
    price: "$0",
    period: "14 days",
    features: [
      "1 Upwork Account",
      "Basic Job Search",
      "Limited AI Proposals (5/day)",
      "Basic Analytics",
      "Email Support",
      "Job Wishlist",
      "Community Support",
    ],
    highlighted: false,
    trial: true,
  },
  {
    title: "Individual",
    price: "$29",
    period: "month",
    features: [
      "1 Upwork Account",
      "Advanced Job Search & Filtering",
      "Unlimited AI Proposals",
      "Advanced Analytics Dashboard",
      "Priority Email Support",
      "Job Wishlist & Tracking",
      "Spam Detection",
      "Basic Kanban Board",
      "Custom Job Filters",
      "Proposal Templates",
    ],
    highlighted: false,
  },
  {
    title: "Company",
    price: "$99",
    period: "month",
    features: [
      "Up to 5 Upwork Accounts",
      "Team Collaboration Tools",
      "Advanced AI Proposal Generation",
      "Detailed Analytics & Reporting",
      "24/7 Priority Support",
      "Custom Account Preferences",
      "Advanced Spam Protection",
      "Full Kanban Management",
      "Team Performance Metrics",
      "Custom Workflows",
      "API Access",
      "White-label Reports",
    ],
    highlighted: true,
  },
];

const faqItems = [
  {
    question: "What is Bidbot?",
    answer: "Bidbot is an AI-powered Upwork automation tool that helps freelancers and companies find, apply, and win more projects. It automates job searching, proposal generation, and project management.",
  },
  {
    question: "How does the free trial work?",
    answer: "Our 14-day free trial gives you full access to all features with some usage limits. No credit card required. You can upgrade to a paid plan anytime during or after the trial.",
  },
  {
    question: "Can I manage multiple Upwork accounts?",
    answer: "Yes! The Individual plan allows one Upwork account, while the Company plan supports up to 5 accounts with team collaboration features.",
  },
  {
    question: "How does the AI proposal generator work?",
    answer: "Our AI analyzes successful proposals and job descriptions to generate personalized, high-quality proposals. It learns from your feedback and improves over time.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer email support for all plans, with 24/7 priority support for Company plan users. We also have a comprehensive knowledge base and community forum.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and security measures. Your Upwork credentials are encrypted and never stored in plain text.",
  },
];

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Careers", href: "#careers" },
    { name: "Blog", href: "#blog" },
    { name: "Press", href: "#press" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Help Center", href: "#help" },
    { name: "API", href: "#api" },
    { name: "Status", href: "#status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" },
  ],
};

const Homepage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = () => {
    navigate("/authentication/sign-in");
  };

  return (
    <PageLayout background="white">
      <DefaultNavbar
        action={{
          type: "internal",
          route: "/authentication/sign-in",
          label: "Sign In",
          color: "info",
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <SoftTypography
                  variant="h1"
                  color="white"
                  fontWeight="bold"
                  mb={2}
                  sx={{
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    lineHeight: 1.2,
                  }}
                >
                  <Typewriter
                    options={{
                      strings: [
                        "Automate Your Upwork Success",
                        "Win More Projects",
                        "Save Time & Money",
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 50,
                      delay: 50,
                    }}
                  />
                </SoftTypography>
                <SoftTypography
                  variant="h4"
                  color="white"
                  fontWeight="regular"
                  mb={4}
                  sx={{ opacity: 0.9 }}
                >
                  The all-in-one platform that helps you find, apply, and win more Upwork projects with AI-powered automation
                </SoftTypography>
                <SoftButton
                  variant="contained"
                  color="white"
                  size="large"
                  onClick={handleSubscribe}
                  sx={{
                    color: "info.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      backgroundColor: "white",
                      opacity: 0.9,
                    },
                  }}
                >
                  Start Free Trial
                </SoftButton>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src={features[activeFeature].image}
                  alt="Feature Preview"
                  sx={{
                    width: "100%",
                    maxWidth: 600,
                    height: "auto",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <SoftBox py={12} id="features">
        <Container>
          <SoftTypography
            variant="h2"
            textAlign="center"
            fontWeight="bold"
            mb={8}
          >
            Everything You Need to Succeed on Upwork
          </SoftTypography>
          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <SoftBox p={4}>
                    <SoftBox
                      display="flex"
                      justifyContent="center"
                      mb={3}
                    >
                      <Icon
                        sx={{
                          fontSize: 48,
                          color: "info.main",
                          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          borderRadius: "50%",
                          p: 1,
                          boxShadow: "0 10px 20px rgba(33, 150, 243, 0.2)",
                        }}
                      >
                        {feature.icon}
                      </Icon>
                    </SoftBox>
                    <SoftTypography
                      variant="h4"
                      textAlign="center"
                      fontWeight="bold"
                      mb={2}
                    >
                      {feature.title}
                    </SoftTypography>
                    <SoftTypography
                      variant="body1"
                      textAlign="center"
                      color="text"
                    >
                      {feature.description}
                    </SoftTypography>
                  </SoftBox>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SoftBox>

      {/* Testimonials Section */}
      <SoftBox
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          py: 12,
          color: "white",
        }}
      >
        <Container>
          <SoftTypography
            variant="h2"
            textAlign="center"
            fontWeight="bold"
            mb={8}
            color="white"
          >
            What Our Users Say
          </SoftTypography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <SoftBox p={4}>
                    <SoftBox
                      component="img"
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        mb: 3,
                      }}
                    />
                    <SoftTypography
                      variant="h5"
                      fontWeight="bold"
                      mb={1}
                      color="white"
                    >
                      {testimonial.name}
                    </SoftTypography>
                    <SoftTypography
                      variant="body2"
                      color="white"
                      opacity={0.8}
                      mb={3}
                    >
                      {testimonial.role}
                    </SoftTypography>
                    <SoftTypography
                      variant="body1"
                      color="white"
                      sx={{ fontStyle: "italic" }}
                    >
                      {testimonial.content}
                    </SoftTypography>
                  </SoftBox>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SoftBox>

      {/* Pricing Section */}
      <SoftBox py={12} id="pricing" sx={{ bgcolor: "grey.50" }}>
        <Container>
          <SoftTypography
            variant="h2"
            textAlign="center"
            fontWeight="bold"
            mb={2}
          >
            Choose Your Plan
          </SoftTypography>
          <SoftTypography
            variant="h5"
            textAlign="center"
            color="text"
            mb={8}
          >
            Start with a 14-day free trial. No credit card required.
          </SoftTypography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transform: plan.highlighted ? "scale(1.05)" : "none",
                    border: plan.highlighted ? "2px solid" : "none",
                    borderColor: "info.main",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background: plan.highlighted 
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
                    {plan.trial && (
                      <SoftBox
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          bgcolor: "success.main",
                          color: "white",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                          boxShadow: "0 4px 8px rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        Free Trial
                      </SoftBox>
                    )}
                    <SoftTypography
                      variant="h4"
                      textAlign="center"
                      fontWeight="bold"
                      mb={2}
                    >
                      {plan.title}
                    </SoftTypography>
                    <SoftBox
                      display="flex"
                      justifyContent="center"
                      alignItems="baseline"
                      mb={3}
                    >
                      <SoftTypography
                        variant="h2"
                        fontWeight="bold"
                        color="info"
                      >
                        {plan.price}
                      </SoftTypography>
                      <SoftTypography
                        variant="h6"
                        color="text"
                        ml={1}
                      >
                        /{plan.period}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox mb={3}>
                      {plan.features.map((feature, idx) => (
                        <SoftBox
                          key={idx}
                          display="flex"
                          alignItems="center"
                          mb={1.5}
                        >
                          <Icon
                            sx={{
                              color: "success.main",
                              mr: 1.5,
                              fontSize: "1.2rem",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.2)",
                              },
                            }}
                          >
                            check_circle
                          </Icon>
                          <SoftTypography 
                            variant="body2"
                            sx={{
                              transition: "color 0.3s ease",
                              "&:hover": {
                                color: "info.main",
                              },
                            }}
                          >
                            {feature}
                          </SoftTypography>
                        </SoftBox>
                      ))}
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
                        onClick={handleSubscribe}
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
                        {plan.trial ? "Start Free Trial" : "Get Started"}
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SoftBox>

      {/* FAQ Section */}
      <SoftBox py={12} id="faq">
        <Container>
          <SoftTypography
            variant="h2"
            textAlign="center"
            fontWeight="bold"
            mb={8}
          >
            Frequently Asked Questions
          </SoftTypography>
          <Grid container spacing={4}>
            {faqItems.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <SoftBox p={4}>
                    <SoftTypography
                      variant="h5"
                      fontWeight="bold"
                      mb={2}
                    >
                      {item.question}
                    </SoftTypography>
                    <SoftTypography
                      variant="body1"
                      color="text"
                    >
                      {item.answer}
                    </SoftTypography>
                  </SoftBox>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SoftBox>

      {/* Footer */}
      <SoftBox
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: "auto",
          backgroundColor: "background.default",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <SoftBox mb={2}>
                <SoftTypography variant="h6" fontWeight="bold" mb={2}>
                  Bidbot
                </SoftTypography>
                <SoftTypography variant="body2" color="text" mb={2}>
                  The all-in-one platform that helps you find, apply, and win more Upwork projects with AI-powered automation.
                </SoftTypography>
              </SoftBox>
            </Grid>
            {Object.entries(footerLinks).map(([category, links]) => (
              <Grid item xs={6} md={2} key={category}>
                <SoftBox mb={2}>
                  <SoftTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                    mb={2}
                  >
                    {category}
                  </SoftTypography>
                  {links.map((link) => (
                    <SoftBox key={link.name} mb={1}>
                      <SoftTypography
                        component="a"
                        href={link.href}
                        variant="body2"
                        color="text"
                        sx={{
                          textDecoration: "none",
                          "&:hover": {
                            color: "info.main",
                          },
                        }}
                      >
                        {link.name}
                      </SoftTypography>
                    </SoftBox>
                  ))}
                </SoftBox>
              </Grid>
            ))}
          </Grid>
          <SoftBox
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor="divider"
            textAlign="center"
          >
            <SoftTypography variant="body2" color="text">
              © {new Date().getFullYear()} Bidbot. All rights reserved.
            </SoftTypography>
          </SoftBox>
        </Container>
      </SoftBox>
    </PageLayout>
  );
};

export default Homepage; 