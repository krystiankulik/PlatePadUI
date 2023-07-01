import React from 'react';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Grid)({
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '2rem'
});

const Cell = styled(Grid)({
});

type MacroValuesProps = {
    calories: number;
    fats: number;
    carbs: number;
    proteins: number;
};

export const MacroValues: React.FC<MacroValuesProps> = ({ calories, fats, carbs, proteins }) => {
    return (
        <Container container>
            <Cell item xs={3}>
                <Typography variant="body1"><b>Calories</b></Typography>
                <Typography variant="caption">{calories}</Typography>
            </Cell>
            <Cell item xs={3}>
                <Typography variant="body1"><b>Fats</b></Typography>
                <Typography variant="caption">{fats}</Typography>
            </Cell>
            <Cell item xs={3}>
                <Typography variant="body1"><b>Carbs</b></Typography>
                <Typography variant="caption">{carbs}</Typography>
            </Cell>
            <Cell item xs={3}>
                <Typography variant="body1"><b>Proteins</b></Typography>
                <Typography variant="caption">{proteins}</Typography>
            </Cell>
        </Container>
    );
};
