import React from 'react';
import {Box, Container, Typography, Grid, Paper, styled} from '@mui/material';
import {Palette, CalculateOutlined, RestaurantMenu} from '@mui/icons-material';

const FeatureContainer = styled(Container)(({theme}) => ({
    paddingTop: "4rem",
    paddingBottom: "8rem",
    backgroundColor: "#cbcfcf",
    fontFamily: "JosefinSans",
    fontWeight: "bold",
    fontSize: "1.4rem",
}));

const FeatureItem = styled(Paper)(({theme}) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    backgroundColor: "#3C4247",
    color: "white",
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[4],
    },
}));

const IconWrapper = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '50%',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),

}));


const Title = styled('h1')(({theme}) => ({
    fontSize: "3rem",
    textAlign: "center",
    color: "#3C4247"

}));

const features = [
    {
        title: 'Simple, Minimalistic Design',
        description: 'Clean and intuitive interface for effortless recipe management.',
        icon: <Palette fontSize="large"/>,
    },
    {
        title: 'Auto Calculated Macros',
        description: 'Instantly view nutritional information for your recipes.',
        icon: <CalculateOutlined fontSize="large"/>,
    },
    {
        title: 'Add Your Own Ingredients',
        description: 'Customize your recipe database with personal ingredients.',
        icon: <RestaurantMenu fontSize="large"/>,
    },
];

export const Features = () => {
    return (
        <FeatureContainer maxWidth={false}>
            <Container>
                <Title>
                    Features
                </Title>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <FeatureItem elevation={2}>
                                <IconWrapper>
                                    {feature.icon}
                                </IconWrapper>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2">
                                    {feature.description}
                                </Typography>
                            </FeatureItem>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </FeatureContainer>
    );
}