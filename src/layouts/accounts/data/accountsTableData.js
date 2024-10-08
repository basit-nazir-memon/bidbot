import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import upworkImage from "assets/images/logos/upwork.png"

function Author({ image, name, email }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <SoftAvatar src={image} alt={name} size="sm" variant="rounded" />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {email}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

function Function({ job, org }) {
  return (
    <SoftBox display="flex" flexDirection="column">
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {job}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        {org}
      </SoftTypography>
    </SoftBox>
  );
}

Author.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

Function.propTypes = {
  job: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
};

const rowsData = [
  {
    account: { image: upworkImage, name: "Upwork Account" },
    username: "Basit Nazir Memon",
    status: { badgeContent: "active", color: "success" },
    connects: 40,
  },
];


function RenderRows() {
  return rowsData.map((row, index) => (
    {
      account: <Author image={row.account.image} name={row.account.name} />,
      username: <Function job={row.username} />,
      status: (
        <SoftBadge variant="gradient" badgeContent={row.status.badgeContent} color={row.status.color} size="xs" container />
      ),
      connects: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {row.connects}
        </SoftTypography>
      ),
      action: (
        <SoftTypography
          component="a"
          href="#"
          variant="caption"
          color="secondary"
          fontWeight="medium"
        >
          Details
        </SoftTypography>
      ),
    }
  ));
}

const accountsTableData = {
  columns: [
    { name: "account", align: "left" },
    { name: "username", align: "left" },
    { name: "status", align: "center" },
    { name: "connects", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: RenderRows()
};

export default accountsTableData;
