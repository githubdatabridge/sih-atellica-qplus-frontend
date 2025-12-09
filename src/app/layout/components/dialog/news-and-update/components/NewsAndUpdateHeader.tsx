import React, { FC } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

interface INewsAndUpdateHeaderProps {
    title: string;
    subTitle: string;
    paragraph: string;
    isLoading?: boolean;
}

const NewsAndUpdateHeader: FC<INewsAndUpdateHeaderProps> = ({
    isLoading = false,
    title,
    subTitle,
    paragraph
}) =>
    isLoading ? (
        <Box
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ marginLeft: "-80px" }}>
            <CircularProgress size={40} color="primary" />
        </Box>
    ) : (
        <Box>
            <Box pb={1}>
                <Typography fontSize="28px" fontWeight={600}>
                    {title || ""}
                </Typography>
            </Box>
            <Box pb={1}>
                <Typography fontSize="20px" fontWeight={500}>
                    {subTitle || ""}
                </Typography>
            </Box>
            <Box pb={1}>
                <Typography fontSize="16px" fontWeight={500}>
                    {paragraph || ""}
                </Typography>
            </Box>
        </Box>
    );

export default NewsAndUpdateHeader;
