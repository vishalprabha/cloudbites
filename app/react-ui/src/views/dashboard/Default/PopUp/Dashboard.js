import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Reviews from "./Reviews.js";
import WordCloud1 from "./WordCloud1";
import WordCloud2 from "./WordCloud2";
import Recommendations from "./Recommendation";
import Images from "./Images";
import Info from "./Info";


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Cloudbites
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}


const mdTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#524d4d",
      paper: "#00B3DF",
    },
    text: {
      primary: "#000000",
      secondary: "rgb(0, 10, 10)",
    },
    backgroundColor: {
      default: "#524d4d",
    },
    Typography: {
      lineHeight: 1.3,
      body1: {
        fontSize: 14,
      },
      paragraph: {
        fontSize: '0.8rem',
      },
    },
  },
});


const Dashboard = ({data}) => {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline enableColorScheme />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "110vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Info */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Info data={data}/>
                </Paper>
              </Grid>
              {/* Images */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Images data={data}/>
                </Paper>
              </Grid>
              {/* World Cloud 1 */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <WordCloud1 data={data}/>
                </Paper>
              </Grid>
              {/* Word Cloud 2
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <WordCloud2 />
                </Paper>
              </Grid>*/}
              {/*Reviews */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Reviews data={data} />
                </Paper>
              </Grid>
              {/* Recommendations */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Recommendations data={data} />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// export default function Dashboard() {
//   return <DashboardContent />;
// }
export default Dashboard
