/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

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
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
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
    icon: <SpaceShip size="12px" />,
    component: <Users />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Account Management",
    key: "accounts",
    route: "/accounts",
    icon: <SpaceShip size="12px" />,
    component: <Accounts />,
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
    icon: <SpaceShip size="12px" />,
    component: <UserOnboarding />,
    noCollapse: true,
    show: true,
  },
  {
    type: "collapse",
    name: "Link Account",
    key: "linkAccount",
    route: "/accounts/link",
    icon: <SpaceShip size="12px" />,
    component: <LinkAccount />,
    noCollapse: true,
    show: false,
  }


];

export default routes;
