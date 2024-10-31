import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export const Footer= () => {
    return (
        <Box
            component="footer"
            sx={{
                paddingTop: 8,
                paddingBottom: 4,
                px: 2,
                width: "100%",
                mt: 'auto',
                backgroundColor: "#3C4247",
                color: "white",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Typography variant="body2" color="lightgray">
                © {new Date().getFullYear()} PlatePad. All rights reserved.
            </Typography>
            <Link
                href="https://krystiankulik.com"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "lightgray" }}
            >
                <Typography variant="body2" component="h3">
                    Author
                </Typography>
            </Link>
        </Box>
    );
};
