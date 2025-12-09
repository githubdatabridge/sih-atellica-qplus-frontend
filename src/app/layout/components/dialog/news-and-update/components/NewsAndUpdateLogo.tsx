import { FC } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface Props {
    title: string;
    version: string;
}

const NewsAndUpdateLogo: FC<Props> = ({ title, version }): JSX.Element => {
    const theme = useTheme();

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <Box pl={2}>
                <Box>
                    <Typography
                        display="inline"
                        fontWeight="bold"
                        fontSize="50px"
                        sx={{ color: theme.palette.primary.contrastText }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ marginTop: "-4px" }}>
                    <Typography
                        display="inline"
                        fontSize="16px"
                        fontWeight={500}
                        sx={{ color: theme.palette.primary.contrastText }}>
                        {version}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default NewsAndUpdateLogo;
