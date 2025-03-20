import { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Badge, IconButton, Card, Icon } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationItem from "examples/Items/NotificationItem";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { envConfig } from "env";

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  function timeAgo(date) {
    const now = new Date();
    const postedTime = new Date(date);
    const diffInSeconds = Math.floor((now - postedTime) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (let key in intervals) {
        const value = Math.floor(diffInSeconds / intervals[key]);
        if (value >= 1) {
            return `${value} ${key}${value > 1 ? 's' : ''} ago`;
        }
    }
    return "Just now";
}


  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${envConfig.backend}/notifications`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          },
        });

        console.log(response.data)
        setNotifications(response.data);
        updateUnreadCount(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Example of polling every 30 seconds (replace with WebSocket for real-time updates)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update unread count
  const updateUnreadCount = (notifications) => {
    const unread = notifications.filter((notif) => !notif.isRead).length;
    setUnreadCount(unread);
  };

  // Mark notification as read
  const markAsRead = async (id, redirect_url) => {
    try {
      await axios.post(`${envConfig.backend}/notifications/mark/${id}`,  {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRread: true } : notif
        )
      );
      updateUnreadCount(notifications);

      if (redirect_url) {
        navigate(redirect_url);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`); // API to delete notification
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      updateUnreadCount(notifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3} >
        <Card sx={{ padding: "20px", mx: 2 }}>
          <SoftBox pt={2} px={2} mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <SoftTypography variant="h6">Notifications</SoftTypography>
            <Badge badgeContent={unreadCount} color="primary">
              <SoftTypography variant="button">Unread</SoftTypography>
            </Badge>
          </SoftBox>

          {
            notifications.map((notif, index) => {
              // Check if the title starts with "New" and extract the relevant parts
              const titleParts = notif.title.startsWith("New")
                ? [
                    notif.title.split(" ").slice(0, 2).join(" "), // First two words (e.g., "New message")
                    notif.title.split(" ").slice(2).join(" "),   // Remaining words
                  ]
                : ["", notif.title]; // If not "New", use the entire title as the first part

              return (
                <NotificationItem
                  color={notif.icon ? "secondary" : null}
                  image={
                    notif.icon ? (
                      <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
                        {notif.icon}
                      </Icon>
                    ) : (
                      <img src={notif.image_url} alt="person" />
                    )
                  }
                  title={titleParts} // Pass the dynamically split title
                  date={timeAgo(notif.postedOn)} // Pass the date from the notification object
                  read={notif.isRead}
                  onClick={() => markAsRead(notif._id, notif.redirect_url)}
                  key={index}
                />
              );
            })
          }


          

          {/* {
            notifications.map((notif, index) => (
              
              const titleParts = notif.title.startsWith("New")
      ? [
          notif.title.split(" ").slice(0, 2).join(" "), // First two words (e.g., "New message")
          notif.title.split(" ").slice(2).join(" "),   // Remaining words
        ]
      : [notif.title, ""]; // If not "New", use the entire title as the first part

              <NotificationItem
                color= {notif.icon ? "secondary" : null}
                image={
                  notif.icon ? 
                  ( <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}> {notif.icon} </Icon> ) :
                  ( <img src={notif.image_url} alt="person" /> )
                }
                title={notif.title. ["New message", "from Laur"]}
                date="13 minutes ago"
                read={false}
                onClick={() => markAsRead(notif.id)}
                key={index}
              />
            )) */}

          {/* <NotificationItem
            color="secondary"
            image={
              <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
                payment
              </Icon>
            }
            read={false}
            title={["", ]}
            date="2 days"
            onClick={() => markAsRead(notif.id)}
          /> */}

        </Card>
      </SoftBox>
    </DashboardLayout>
  );
}

export default NotificationsPage;
