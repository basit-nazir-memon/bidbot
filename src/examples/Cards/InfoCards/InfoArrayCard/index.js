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

function InfoArrayCard({ title, info, action }) {
  // Render the card info items
  const renderItems = () => {
    return info.map((row, index) => (
      <SoftBox key={index} mb={3}>
        {
          row.title && (
            <SoftBox>
              <SoftTypography variant="button" fontWeight="bold" textTransform="capitalize" color="dark">
                {row.title}
              </SoftTypography>
            </SoftBox>
          )
        }
        {
          row.description && (
            <SoftBox>
              <SoftTypography variant="button" fontWeight='regular' color='dark'>
                {row.description}
              </SoftTypography>
            </SoftBox>
          )
        }
        {
          (row.subtitle1 || row.subtitle2) && (
            <SoftBox>
              {
                row.subtitle1 && (
                  <SoftTypography variant="button" fontWeight='light' color="text">
                    {row.subtitle1} &nbsp;
                  </SoftTypography>
                )
              }
              {
                row.subtitle2 && (
                  <SoftTypography variant="button" fontWeight='light' color="text">
                      &#8226; &nbsp; {row.subtitle2} &nbsp;
                  </SoftTypography>
                )
              }
            </SoftBox>
          )
        }

      </SoftBox>
    ));
  };

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        {action && (
          <SoftTypography component={Link} to={action.route} variant="body2" color="secondary">
            <Tooltip title={action.tooltip} placement="top">
              <Icon>edit</Icon>
            </Tooltip>
          </SoftTypography>
        )}
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox mb={2} lineHeight={1}>
          {
              info.length <= 0 ? (
                <SoftTypography variant="button" fontWeight='regular' color='dark'>
                  No Data
                </SoftTypography>
              ) : renderItems()
          }
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the InfoArrayCard
InfoArrayCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default InfoArrayCard;
