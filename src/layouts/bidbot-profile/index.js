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
import UpworkAccountList from "examples/Lists/UpworkAccountList";

function Profile() {

  const { id } = useParams();

   // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: "-",
    description: "-",
    email: "-",
    role: "-",
    gender: "",
    phone: "-",
    createdAt: "-",
    location: "-",
    accountType: "-",

    username: "-",
    userid: "-",
    avatar: "",
    address: "-",
    timezone: "-",
    skills: [],
    pricePerHour: "-",
    connects: "-",
    totalEarnings: "-",
    totalJobs: "-",
    companyRole: "",
    workHistory: [],
    employmentHistory: [],
    education: [],
    projects: []
  });

  const fetchProfileData = async () => {
    try {
      let response;
      if (id) {
        response = await axios.get(`${envConfig.backend}/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          },
        });
      } else if (location.pathname === "/profile") {
        response = await axios.get(`${envConfig.backend}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          },
        });
      }

      const { profile } = response.data;

      setProfileData({
        ...profileData,
        email: profile.email,
        gender: profile.gender,
        createdAt: profile.createdAt,
        location: profile.localStorage,
        accountType: profile.accountType,
        pricePerHour: profile.pricePerHour,
        totalHoursPerWeek: profile.totalHoursPerWeek,
        upworkAccounts: [...profile.upworkAccounts],

        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        connects: profile.connects,
        totalEarnings: profile.totalEarnings,
        totalJobs: profile.totalJobs,
        workHistory: profile.workHistory,
        employmentHistory: profile.employmentHistory,
        education: profile.education,
        username: profile.username,
        projects: profile.projects,
        role: profile.role,
        companyRole: profile.companyRole,
        userid: profile.userid,
        avatar: profile.avatar,
        description: profile.description,
        timezone: profile.timezone,
        skills: profile.skills,
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
  }, []);


  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DashboardLayout>
      <Header
        name={profileData.name}
        role={(profileData.role === "Company Team Member" ? profileData.companyRole.toLocaleUpperCase() : profileData.role)}
        avatar={profileData.avatar}
        isScrapping={false}
        showScrapeButton={false}
      />
      <SoftBox mt={5} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} xl={6}>
            <ProfileInfoCard
              title="profile information"
              description={profileData.description || "No Description"}
              info={{
                name: profileData.name,
                email: profileData.email,
                role: (profileData.role === "Company Team Member" ? profileData.companyRole.toLocaleUpperCase() : profileData.role),
                gender: profileData.gender,
                phone: profileData.phone,
                joining: profileData.createdAt,
                location: profileData.location,
                type: profileData.accountType,
              }}
              action={id ? null : { route: "", tooltip: "Edit Profile" }}
            />
          </Grid>

          {
            (localStorage.getItem('role') != "Admin" || id) && (
              <Grid item spacing={2} xs={12} md={6} xl={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} xl={12}>
                    <ListCard title="Skills"
                      info={ (profileData.skills || [] ).map((skill, idx) => ({
                        key: idx,
                        label: skill
                      }))}
                      action={id ? null : { route: "", tooltip: "Edit Skills" }}
                    />
                  </Grid>
                  {/* <Grid item xs={12} xl={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} xl={6}>
                        <InfoCard title="Price Per Hour" info = {profileData.pricePerHour} />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6}>
                        <InfoCard title="Connects" info = {profileData.connects} />
                      </Grid>
                    </Grid>
                  </Grid> */}
                  <Grid item xs={12} xl={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} xl={6}>
                        <UpworkAccountList title="Linked Accounts" profiles={profileData.upworkAccounts} />
                      </Grid>
                      <Grid item xs={12} md={6} xl={6}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} xl={12}>
                            <InfoCard title="Price Per Hour" info = {profileData.pricePerHour}/>
                          </Grid>
                          <Grid item xs={12} md={12} xl={12}>
                            <InfoCard title="Hours Per Week" info = {profileData.totalHoursPerWeek}/>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
          
        </Grid>
      </SoftBox>
      {/* <SoftBox mt={2} mb={2}>
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
                ( profileData.education || []).map((edu) => ({
                  title: edu.institute,
                  description: edu.degree
                }))
              }
            />
          </Grid>
        </Grid>
      </SoftBox> */}
      {
        (localStorage.getItem('role') != "Admin" || id) && (
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
                    My Previous Projects
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox p={2}>
                <Grid container spacing={3}>
                  {
                    profileData.projects.map((project, idx) => (
                      <Grid item xs={12} md={6} xl={3} key={idx}>
                        <DefaultProjectCard
                          image={project?.media && project?.media?.length > 0 ? project.media[0] : 'https://shorturl.at/AeYdl'}
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
        )
      }


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

export default Profile;
