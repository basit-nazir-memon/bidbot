// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import ListCard from "examples/Cards/InfoCards/ListCard";
import InfoCard from "examples/Cards/InfoCards/InfoCard";
import Header from "./components/Header";
import InfoArrayCard from "examples/Cards/InfoCards/InfoArrayCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { envConfig } from "env";
import { useParams } from "react-router-dom";

function UpworkProfile() {

  const { id } = useParams();

   // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: "-",
    username: "-",
    role: "-",
    userid: "-",
    avatar: "",
    address: "-",
    description: "-",
    phone: "-",
    timezone: "-",
    skills: [],
    pricePerHour: "-",
    connects: "-",
    totalEarnings: "-",
    totalJobs: "-",
    workHistory: [],
    employmentHistory: [],
    education: [],
    projects: [],
    status: "Stopped"
  });

  const updateProfileStatus = (newStatus) => {
    setProfileData((prevData) => ({
      ...prevData,
      status: newStatus,
    }));
  };
  

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${envConfig.backend}/profile/account/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      const { profile } = response.data;

      console.log(profile);
      // Update profile data based on the response
      setProfileData({
        ...profileData,
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        pricePerHour: profile.per_hour_charge,
        connects: profile.connects,
        totalEarnings: profile.total_earnings,
        totalJobs: profile.total_jobs,
        workHistory: profile.work_history,
        employmentHistory: profile.employment_history,
        education: profile.education,
        username: profile.username,
        projects: profile.projects,
        role: profile.role,
        userid: profile.userid,
        avatar: profile.avatar,
        description: profile.description,
        timezone: profile.timezone,
        skills: profile.skills,
        status: profile.status,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setSnackbarMessage(error?.response?.data?.message || error.message || "An Error Occurred. Please Try Again");
      setOpenSnackbar(true);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const handleStartBot = async () => {
    try {
        const response = await axios.get(`${envConfig.backend}/startbot/account/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
            },
        });

        // Handle success response
        if (response.status === 200) {
            setSnackbarMessage("Bot started successfully!");
            updateProfileStatus("Running")
        } else {
            setSnackbarMessage(response.data.message || "Unexpected response from server.");
        }
        
    } catch (error) {
        console.error("Error starting bot:", error);
        updateProfileStatus("Stopped")
        // Handle error response properly
        const errorMessage = error?.response?.data?.message || error.message || "An error occurred. Please try again.";

        setSnackbarMessage(errorMessage);
    } finally {
        setOpenSnackbar(true);
    }
  };

  const handleStopBot = async () => {
    try {
        const response = await axios.get(`${envConfig.backend}/stopbot/account/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
            },
        });

        // Handle success response
        if (response.status === 200) {
            setSnackbarMessage("Bot Closed successfully!");
            setProfileData({
              ...profileData,
              status: response.data.status
            })
        } else {
            setSnackbarMessage(response.data.message || "Unexpected response from server.");
        }
        
    } catch (error) {
        console.error("Error closing bot:", error);

        // Handle error response properly
        const errorMessage = error?.response?.data?.message || error.message || "An error occurred. Please try again.";

        setSnackbarMessage(errorMessage);
    } finally {
        setOpenSnackbar(true);
    }
  };



  const scrapeProfile = async () => {
    try {
      const response = await axios.get(`${envConfig.backend}/scrape/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      const { account } = response.data;

      console.log(account);
      // Update profile data based on the response
      setProfileData({
        ...profileData,
        name: account.name,
        address: account.address,
        phone: account.phone,
        pricePerHour: account.per_hour_charge,
        connects: account.connects,
        totalEarnings: account.total_earnings,
        totalJobs: account.total_jobs,
        workHistory: account.work_history,
        employmentHistory: account.employment_history,
        education: account.education,
        username: account.username,
        projects: account.projects,
        role: account.role,
        userid: account.userid,
        avatar: account.avatar,
        description: account.description,
        timezone: account.timezone,
        skills: account.skills,
        status: account.status,
      });
    } catch (error) {
      console.error("Error scraping profile:", error);
      setSnackbarMessage(error?.response?.data?.message || error.message || "An Error Occured. Please Try Again");
      setOpenSnackbar(true);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DashboardLayout>
      <Header
        name={profileData.username}
        role={profileData.role}
        avatar={profileData.avatar}
        onScrapeClick={scrapeProfile}
        isScrapping={false}
        status={profileData.status}
        onStartBotClick={handleStartBot}
        onStopBotClick={handleStopBot}
        setStatus={updateProfileStatus}
      />
      <SoftBox mt={5} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} xl={6}>
            <ProfileInfoCard
              title="profile information"
              description={profileData.description}
              info={{
                name: profileData.name,
                upworkUserid: profileData.userid,
                phone: profileData.phone,
                timezone: profileData.timezone,
                address: profileData.address,
              }}
            />
          </Grid>
          <Grid item spacing={2} xs={12} md={6} xl={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} xl={12}>
                <ListCard title="Skills"
                  info={profileData.skills.map((skill, idx) => ({
                    key: idx,
                    label: skill
                  }))}
                />
              </Grid>
              <Grid item xs={12} xl={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} xl={6}>
                    <InfoCard title="Price Per Hour" info = {profileData.pricePerHour} />
                  </Grid>
                  <Grid item xs={12} md={6} xl={6}>
                    <InfoCard title="Connects" info = {profileData.connects} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} xl={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} xl={6}>
                    <InfoCard title="Total Earnings" info = {profileData.totalEarnings}/>
                  </Grid>
                  <Grid item xs={12} md={6} xl={6}>
                    <InfoCard title="Total Jobs" info = {profileData.totalJobs}/>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox mt={2} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} xl={4}>
            <InfoArrayCard
              title="Work History"
              info={
                (profileData.workHistory || []).map(work => ({
                  title: work.title,
                  description: work.duration,
                  subtitle1: work.price,
                  subtitle2: work.type,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <InfoArrayCard
                title="Employment History"
                info={
                  profileData && profileData.employmentHistory ? (
                    profileData.employmentHistory.map((history)=>({
                      title: history.title,
                      description: history.duration,
                    }))
                  ) : []
                  
                }
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <InfoArrayCard
              title="Education"
              info={
                profileData.education.map((edu) => ({
                  title: edu.institute,
                  description: edu.degree
                }))
              }
            />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox mb={3}>
        <Card>
          <SoftBox pt={2} px={2}>
            <SoftBox mb={0.5}>
              <SoftTypography variant="h6" fontWeight="medium">
                Projects
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={1}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Upwork Portfolio Projects
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox p={2}>
            <Grid container spacing={3}>
              {
                (profileData.projects || [] ).map((project, idx) => (
                  <Grid item xs={12} md={6} xl={3} key={idx}>
                    <DefaultProjectCard
                      image={(project.media && project.media.length > 0) ? project.media[0] : 'https://shorturl.at/AeYdl'}
                      label={project.published}
                      title={project.title}
                      description={project.description}
                      action={{
                        type: "internal",
                        route: "/projects",
                        color: "info",
                        label: "view project",
                      }}
                    />
                  </Grid>

                ))
              }
              <Grid item xs={12} md={6} xl={3}>
                <PlaceholderCard title={{ variant: "h5", text: "New project" }} outlined />
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </DashboardLayout>
  );
}

export default UpworkProfile;
