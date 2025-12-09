import React, { FC } from "react";
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

interface TNewsItems {
    date: string;
    messages: string[];
}

interface INewsAndUpdateDetailsProps {
    items: TNewsItems[];
}

const NewsAndUpdateDetails: FC<INewsAndUpdateDetailsProps> = ({ items }) => {
    if (!items && items.length === 0) return null;

    return (
        <Box>
            <List
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    maxHeight: "350px",
                    minHeight: "200px",
                    overflow: "auto",
                    bgcolor: "background.paper"
                }}>
                {items.map((item, i) => (
                    <>
                        <Typography key={i} sx={{ fontSize: "0.925rem", fontWeight: 600 }}>
                            {item.date}
                        </Typography>
                        {item.messages.map((msg, j) => (
                            <ListItem key={j} sx={{ padding: 0 }}>
                                <ListItemAvatar
                                    sx={{
                                        minWidth: "30px",
                                        maxWidth: "30px"
                                    }}>
                                    <CircleIcon sx={{ width: "0.825rem", height: "5px" }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${msg}`}
                                    primaryTypographyProps={{
                                        fontSize: "0.825rem"
                                    }}
                                />
                            </ListItem>
                        ))}
                    </>
                ))}
            </List>
        </Box>
    );
};

export default NewsAndUpdateDetails;
