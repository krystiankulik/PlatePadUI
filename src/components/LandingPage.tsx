import {Button, styled} from "@mui/material";
import {useNavigate} from "react-router-dom";
import landingPageImage from "../assets/PlatePad_landingPicture.png";
import {Features} from "./Features";
import {Footer} from "../Footer";

const Info = styled("div")(({theme}) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.primary.main,
    fontFamily: "JosefinSans",
    fontWeight: "bold",
    fontSize: "1.4rem",
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

const Container = styled("div")(({theme}) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "3rem",
    paddingBottom: "3rem",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
    },
}));

const Description = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "5rem",
    width: "40%",
    [theme.breakpoints.down("md")]: {
        width: "95%",
        marginRight: "0",
    },
}));

const Image = styled("div")(({theme}) => ({
    width: "500px",
    [theme.breakpoints.down("md")]: {
        width: "400px"
    },
}));

const ExploreButtonContainer = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1rem",
    marginBottom: "2rem"
});

const Img = styled("img")(({theme}) => ({
    width: "500px",
    [theme.breakpoints.down("md")]: {
        width: "400px",
    },
}));


const Title = styled("h1")(({theme}) => ({
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center"
}));

export const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <Info>
            <Container>
                <Description>
                    <Title>Welcome to PlatePad!</Title>
                    Your simple fitness recipe storage
                    <ExploreButtonContainer>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/global-recipes");
                            }}
                        >
                            {"Explore example recipes!"}
                        </Button>
                    </ExploreButtonContainer>
                </Description>
                <Image>
                    <Img
                        src={landingPageImage}
                        alt="landing page"
                    />
                </Image>
            </Container>
            <Features />
            <Footer />
        </Info>
    );
};
