import { Box, Container, Typography, Paper } from "@mui/material";

export default function ImprintPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Imprint
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Responsible Party
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          André Butkevich
          <br />
          andreb722@web.de
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Legal Disclaimer
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The content of this website has been compiled with great care. However, we cannot assume
          any liability for the accuracy, completeness, or timeliness of the content. As a service
          provider, we are responsible for our own content on these pages in accordance with
          applicable law. We are not obligated to monitor transmitted or stored external information
          or to investigate circumstances that indicate unlawful activity.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Liability for Links
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our site contains links to external websites. We are not responsible for the content of
          linked pages. We have no influence on the design and content of linked pages. The
          inclusion of links does not imply that we endorse the content behind the link.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Copyright
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The content and works on this website are subject to copyright protection. Any
          reproduction, processing, distribution, or any form of utilization outside the scope of
          copyright law requires the written permission of the author or creator.
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          Data Protection
        </Typography>
        <Typography variant="body1" color="text.secondary">
          For information on the processing of personal data, please refer to our{" "}
          <Box
            component="a"
            href="/privacy"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Privacy Policy
          </Box>
          .
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 4, display: "block" }}
        >
          Last updated: July 2026
        </Typography>
      </Paper>
    </Container>
  );
}
