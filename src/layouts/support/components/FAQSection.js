"use client"

// @mui material components
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import CircularProgress from "@mui/material/CircularProgress"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftInput from "components/SoftInput"

// React hooks
import { useState, useEffect } from "react"

// Axios for API requests
import axios from "axios"
import { envConfig } from "env"
import { ExpandMore } from "@mui/icons-material"
import SoftButton from "components/SoftButton"

function FAQSection() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await axios.get(`${envConfig.backend}/faqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const faqData = response.data.faqs || []
        setFaqs(faqData)
        setFilteredFaqs(faqData)

        // Extract unique categories
        const uniqueCategories = [...new Set(faqData.map((faq) => faq.category || "General"))]
        setCategories(["all", ...uniqueCategories])

        setLoading(false)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  useEffect(() => {
    let filtered = faqs

    // Filter by category first
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => (faq.category || "General") === selectedCategory)
    }

    // Then filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredFaqs(filtered)
  }, [searchQuery, selectedCategory, faqs])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  if (loading) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress color="info" />
      </SoftBox>
    )
  }

  return (
    <SoftBox>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
          mb: 2,
          background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <SoftBox>
            <SoftTypography variant="h5" fontWeight="bold" color="white">
              Frequently Asked Questions
            </SoftTypography>
            <SoftTypography variant="body2" fontWeight="regular" color="white" opacity={0.8}>
              Find answers to common questions about our platform
            </SoftTypography>

            {/* <SoftBox mt={2}>
              <SoftInput
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 2,
                  "& .MuiInputBase-input": {
                    color: "#344767",
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </SoftBox> */}
          </SoftBox>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              position: "sticky",
              top: 24,
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <SoftTypography variant="h6" fontWeight="medium" mb={1}>
                Categories
              </SoftTypography>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {categories.map((category) => (
                  <SoftButton 
                    key={category}
                    color={selectedCategory === category ? "info" : "dark"}
                    variant={selectedCategory === category ? "gradient" : "text"}
                    size={"small"}
                    onClick={() => handleCategoryChange(category)}
                    sx={{
                          justifyContent: "flex-start",
                          fontWeight: selectedCategory === category ? "bold" : "regular",
                          // "& .MuiChip-label": {
                          //   fontWeight: selectedCategory === category ? "bold" : "regular",
                          // },
                        }}
                  >
                    {category === "all" ? "All Categories" : category}
                  </SoftButton>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {filteredFaqs.length === 0 ? (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <SoftBox textAlign="center" py={3}>
                  <SoftTypography variant="button" color="text">
                    No FAQs found matching your search. Try a different query or create a support ticket.
                  </SoftTypography>
                </SoftBox>
              </CardContent>
            </Card>
          ) : (
            filteredFaqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 1.5,
                  borderRadius: "8px !important",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.15)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-header-${index}`}
                  sx={{
                    minHeight: 56,
                    "&.Mui-expanded": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="medium">
                      {faq.question}
                    </SoftTypography>
                    {faq.category && (
                      <Chip label={faq.category} size="small" color="secondary" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </SoftBox>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {faq.answer}
                  </SoftTypography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Grid>
      </Grid>
    </SoftBox>
  )
}

export default FAQSection

