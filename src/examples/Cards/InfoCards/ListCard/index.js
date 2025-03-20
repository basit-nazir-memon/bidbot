// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { Chip } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useState } from "react";

function ListCard({ title, info, action }) {
  
  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  
  const [chipData, setChipData] = useState(info);


  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        {
          action && (
            <SoftTypography component={Link} to={action.route} variant="body2" color="secondary">
              <Tooltip title={action.tooltip} placement="top">
                <Icon>edit</Icon>
              </Tooltip>
            </SoftTypography>
        )}
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
            {
            info.map((data) => {
              let icon;
              return (
                <ListItem key={data.key}>
                  <Chip
                    label={data.label}
                  />
                </ListItem>
              );
          })}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ListCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default ListCard;
