
// @mui material components
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox";

import GeneralProposalSettings from "../../components/GeneralProposalSettings";
import ProposalTemplateSettings from "../../components/ProposalTemplateSettings";

function ProposalTab() {

  return (
    <>
      <SoftBox mt={5} mb={3}>
        <Grid container>
            <GeneralProposalSettings />
        </Grid>
      </SoftBox>
      <SoftBox mt={5} mb={3}>
        <Grid container>
            <ProposalTemplateSettings />
        </Grid>
      </SoftBox>
    </>
  );
}

export default ProposalTab;
