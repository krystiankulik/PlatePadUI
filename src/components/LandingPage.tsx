import { Button, styled } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import landingPageImage from "../assets/PlatePad_landingPicture.png";

const Info = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: theme.palette.primary.main,
  fontFamily: "JosefinSans",
  fontWeight: "bold",
  fontSize: "1.2rem",
  ul: {
    paddingLeft: "0",
    listStyle: "none",
  },
  li: {
    marginBottom: "1rem",
  },
  h2: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
}));

const Container = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
  flexWrap: "wrap",
  alightItems: "center",
  justifyContent: "center",
});

const BulletIcon = styled("span")({
  fontSize: "1.8rem",
});

const Description = styled("div")({
  width: isMobile ? "100%" : "40%",
});

const Image = styled("div")({
  width: isMobile ? "100%" : "500px",
});

const AuthButtonContainer = styled("div")({
  display: "flex",
  width: "100%",
  justifyContent: "center",
});

const AuthButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  margin: "1rem",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const ExploreButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem",
  marginBottom: "2rem"
});


export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Info>
      <h2>🌟Welcome to PlatePad🌟</h2>
      <Container>
        <Image>
          <img
            src={landingPageImage}
            alt="landing page"
            style={{ width: isMobile ? "80%" : "500px" }}
          />
        </Image>
        <Description>
          Your ultimate culinary companion! Dive into a world where:
          <ul>
            <li>
              <BulletIcon>🍲</BulletIcon>
              {" Your cherished recipes are stored, organized, and celebrated."}
            </li>
            <li>
              <BulletIcon>🥗</BulletIcon>
              {
                "Nutrition values are auto-calculated, ensuring you eat right every time."
              }
            </li>
            <li>
              <BulletIcon>📚</BulletIcon>
              {
                "Explore our recipe database and discover even more dishes to elevate your cooking game."
              }
            </li>
          </ul>
          <ExploreButtonContainer>
          <Button
              variant="outlined"
              onClick={() => {
                navigate("/global-recipes");
              }}
            >
              {"Explore example recipes!"}
            </Button>
            </ExploreButtonContainer>
          <AuthButtonContainer>
            <AuthButton
              onClick={() => {
                navigate("/signup");
              }}
            >
              {"Sign Up for free"}
            </AuthButton>
            <AuthButton
              onClick={() => {
                navigate("/login");
              }}
            >
              {"Sign in"}
            </AuthButton>
          </AuthButtonContainer>
        </Description>
      </Container>
    </Info>
  );
};
