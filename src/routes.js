// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Homepage from "layouts/homepage";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import ForgotPassword from "layouts/authentication/forgot-password";
import ResetPassword from "layouts/authentication/reset-password";
import Users from "layouts/users";
import UserOnboarding from "layouts/on-boarding/index";
import Accounts from "layouts/accounts";
import LinkAccount from "layouts/link-account";
import UpworkProfile from "layouts/upwork-profile";
import Profile from "layouts/bidbot-profile";
import Overview from "layouts/profile";
import Configuration from "layouts/configuration";
import { AccountBox, AccountCircle, AddLink, ContactSupport, FileCopy, Group, Groups, Insights, ManageAccounts, NotificationImportant, Person, ViewKanban, Work } from "@mui/icons-material";
import { Link } from "@mui/material";
import Jobs from "layouts/jobs";
import Connects from "layouts/connects";
import JobTracking from "layouts/jobs-tracking";
import NotificationItem from "examples/Items/NotificationItem";
import NotificationsPage from "layouts/notifications";
import JobDetails from "layouts/job-details";
import Kanban from "layouts/kanban";
import Team from "layouts/team";
import HelpAndSupport from "layouts/support";
import Reports from "layouts/reports";
import JobProposalReport from "layouts/reports/pages/JobProposalReport";
import UserAccountReport from "layouts/reports/pages/UserAccountReport";
import FinancialReport from "layouts/reports/pages/FinancialReport";
import KanbanProjectsReport from "layouts/reports/pages/KanbanProjectsReport";
import AdminReport from "layouts/reports/pages/AdminReport";
import AnalyticsLogsReport from "layouts/reports/pages/AnalyticsLogsReport";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Virtual Reality",
    key: "virtual-reality",
    route: "/virtual-reality",
    icon: <Cube size="12px" />,
    component: <VirtualReality />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    route: "/rtl",
    icon: <Settings size="12px" />,
    component: <RTL />,
    noCollapse: true,
    show: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages", show: true },
  {
    type: "collapse",
    name: "Profile",
    key: "overview",
    route: "/overview",
    icon: <CustomerSupport size="12px" />,
    component: <Overview />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Configuration",
    key: "configurations",
    route: "/configurations",
    icon: <Settings size="12px" />,
    component: <Configuration />,
    noCollapse: true,
    show: true,
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   route: "/authentication/sign-in",
  //   icon: <Document size="12px" />,
  //   component: <SignIn />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   route: "/authentication/sign-up",
  //   icon: <SpaceShip size="12px" />,
  //   component: <SignUp />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Forgot Password",
  //   key: "forgot-password",
  //   route: "/authentication/forgot-password",
  //   icon: <SpaceShip size="12px" />,
  //   component: <ForgotPassword />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Reset Password",
  //   key: "reset-password",
  //   route: "/authentication/reset-password/:token",
  //   icon: <SpaceShip size="12px" />,
  //   component: <ResetPassword />,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    route: "/users",
    icon: <Group size="12px" />,
    component: <Users />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Account Management",
    key: "accounts",
    route: "/accounts",
    icon: <AccountBox size="12px" />,
    component: <Accounts />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Upwork Jobs",
    key: "jobs",
    route: "/jobs",
    icon: <Work size="12px" />,
    component: <Jobs />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Jobs Details",
    key: "jobDetails",
    route: "/jobs/:id/details",
    icon: <Work size="12px" />,
    component: <JobDetails />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Jobs Tracking",
    key: "tracking",
    route: "/tracking",
    icon: <Insights size="12px" />,
    component: <JobTracking />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Kanban",
    key: "kanban",
    route: "/kanban",
    icon: <ViewKanban size="12px" />,
    component: <Kanban />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Team Management",
    key: "team",
    route: "/team",
    icon: <Groups size="12px" />,
    component: <Team />,
    noCollapse: true,
    show: true,
  },
  // {
  //   type: "collapse",
  //   name: "Roles Management",
  //   key: "Roles",
  //   route: "/roles",
  //   icon: <SpaceShip size="12px" />,
  //   component: <Users />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Account Configuration",
  //   key: "Configuration",
  //   route: "/configurations",
  //   icon: <SpaceShip size="12px" />,
  //   component: <Users />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Connects Management",
  //   key: "Connects",
  //   route: "/connects",
  //   icon: <SpaceShip size="12px" />,
  //   component: <Users />,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Onboarding",
    key: "onboarding",
    route: "/onboarding",
    icon: <ManageAccounts size="12px" />,
    component: <UserOnboarding />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Link Account",
    key: "linkAccount",
    route: "/accounts/link",
    icon: <AddLink size="12px" />,
    component: <LinkAccount />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Upwork Profile",
    key: "upworkProfile",
    route: "/accounts/:id/profile",
    icon: <Person size="12px" />,
    component: <UpworkProfile />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Upwork Profile",
    key: "upworkProfile",
    route: "/accounts/:id/connects",
    icon: <Person size="12px" />,
    component: <Connects />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "BidBot Profile",
    key: "profile",
    route: "/profile",
    icon: <Person size="12px" />,
    component: <Profile />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "BidBot Profile",
    key: "usersProfile",
    route: "users/profile/:id",
    icon: <Person size="12px" />,
    component: <Profile />,
    noCollapse: false,
    show: false,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    route: "/notifications",
    icon: <NotificationImportant size="12px" />,
    component: <NotificationsPage />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports",
    icon: <FileCopy size="12px" />,
    component: <Reports />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/jobs-proposals",
    icon: <FileCopy size="12px" />,
    component: <JobProposalReport />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/user-account",
    icon: <FileCopy size="12px" />,
    component: <UserAccountReport />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/financial",
    icon: <FileCopy size="12px" />,
    component: <FinancialReport />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/kanban-projects",
    icon: <FileCopy size="12px" />,
    component: <KanbanProjectsReport />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/analytics-logs",
    icon: <FileCopy size="12px" />,
    component: <AnalyticsLogsReport />,
    noCollapse: true,
    show: false,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports/admin",
    icon: <FileCopy size="12px" />,
    component: <AdminReport />,
    noCollapse: true,
    show: false,
  },

  {
    type: "collapse",
    name: "Help & Support",
    key: "support",
    route: "/support",
    icon: <ContactSupport size="12px" />,
    component: <HelpAndSupport />,
    noCollapse: true,
    show: true,
  },



];

export default routes;
