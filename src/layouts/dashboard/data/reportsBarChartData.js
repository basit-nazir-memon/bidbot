const reportsBarChartData = {
  chart: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: { label: "Projects", data: [2, 5, 3, 1, 3, 4, 2, 3, 5] },
  },
  items: [
    {
      icon: { color: "primary", component: "library_books" },
      label: "Web Dev",
      progress: { content: "6", percentage: 60 },
    },
    {
      icon: { color: "info", component: "touch_app" },
      label: "Gen AI",
      progress: { content: "8", percentage: 90 },
    },
    {
      icon: { color: "warning", component: "payment" },
      label: "Blockchain",
      progress: { content: "3", percentage: 30 },
    },
    {
      icon: { color: "error", component: "extension" },
      label: "Desktop",
      progress: { content: "4", percentage: 50 },
    },
  ],
};

export default reportsBarChartData;
