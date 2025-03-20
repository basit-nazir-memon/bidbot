import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import logoXD from "assets/images/logos/upwork.png";


// Soft UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";
import PropTypes from "prop-types";
import SoftProgress from "components/SoftProgress";


Projects.propTypes = {
  data: PropTypes.array,
};

function Projects({data}) {
  // const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  
  const processData = () => {
    return {
      columns: [
        { name: "jobTitle", align: "left" },
        { name: "budget", align: "center" },
        { name: "type", align: "center" },
        { name: "duration", align: "center" },
        { name: "country", align: "center" },
      ],
  
      rows: data ? data.map(jobItem => {
        return {
          jobTitle: [logoXD, jobItem.job.title],
          budget: (
            <SoftTypography variant="caption" color="text" fontWeight="medium">
              { jobItem.jobType === "fixed" ? `$${jobItem.bidPrice}` : `$${jobItem.hourlyPrice} /hr` }
            </SoftTypography>
          ),
          type: (
            <SoftTypography variant="caption" color="text" fontWeight="medium">
              {jobItem.jobType}
            </SoftTypography>
          ),
          duration: (
            <SoftTypography variant="caption" color="text" fontWeight="medium">
              {jobItem.jobDuration}
            </SoftTypography>
          ),
          country: (
            <SoftTypography variant="caption" color="text" fontWeight="medium">
              {jobItem.job.country}
            </SoftTypography>
          ),
        }
      }) : [],
    }
    
  
  }

  return (
    <Card>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <SoftBox>
          <SoftTypography variant="h6" gutterBottom>
            Projects / Jobs
          </SoftTypography>
          <SoftBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>{ data ? data.length : 0 }</strong> active jobs
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <SoftBox
        sx={{
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            },
          },
        }}
      >
        <Table columns={processData().columns} rows={processData().rows} />
      </SoftBox>
    </Card>
  );
}

export default Projects;
