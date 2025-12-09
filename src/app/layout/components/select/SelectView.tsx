import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CircularProgress, Theme } from "@mui/material";

import useSearchParamsQuery from "app/shared/hooks/useSearchParamsQuery";

interface SelectSubViewProp {
    pages: Page[];
    handleOnPageChangeCallback: (view: SetStateAction<string>) => void;
}

export interface Page {
    label: string;
    route: string;
    url?: string;
}

const SelectView: FC<SelectSubViewProp> = ({ pages, handleOnPageChangeCallback }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [views, setViews] = useState<Page[]>([]);
    const [view, setView] = useState<string>(pages[0]?.label || "");
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { classes } = useStyles();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const {
        searchParams: { view: viewUrl }
    } = useSearchParamsQuery();
    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(true);
        const uniquePages = [...new Set(pages)];
        setViews(uniquePages);
        if (uniquePages.length) {
            const currentPage = uniquePages.find(page => page.route === pathname);
            const initialPage = currentPage ? currentPage.label : uniquePages[0].label;
            setView(initialPage);
        }
        setIsLoading(false);
    }, [navigate, pages, pathname]);

    useEffect(() => {
        setIsLoading(true);
        if (viewUrl !== null) {
            setView(pages?.find(p => p?.url === viewUrl)?.label);
        }
        setIsLoading(false);
    }, [pages, viewUrl]);

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        if (event.target.value) {
            handleOnPageChangeCallback(event.target.value);
            setView(event.target.value);
        }
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="view-select-outlined-label" className={classes.inputLabel}>
                {t("sih-subheader-select-view")}
            </InputLabel>
            <Select
                variant="standard"
                labelId="view-select-outlined-label"
                id="view-select-outlined"
                value={view}
                key={view}
                onChange={handleChange}
                label="view"
                disableUnderline
                className={classes.select}>
                <MenuItem value="" className={classes.menuItem}>
                    {isLoading ? (
                        <CircularProgress size={20} color="secondary" />
                    ) : (
                        <em>{t("sih-subheader-select-view-default")}</em>
                    )}
                </MenuItem>
                {views?.map((item, _i) => (
                    <MenuItem value={item.label} className={classes.menuItem} key={item.label}>
                        <Link className={classes.link} to={item.route}>
                            {item.label}
                        </Link>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectView;

const useStyles = makeStyles()((theme: Theme) => ({
    loaderControl: {
        minWidth: "100%"
    },
    link: {
        display: "flex",
        flex: 1,
        textDecoration: "none",
        color: theme?.palette.common.primaryText
    },
    formControl: {
        width: "100%",
        height: "45px",
        backgroundColor: theme?.palette.common.highlight5,
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        marginLeft: "10px",
        borderBottom: `1px solid ${theme?.palette.common.primaryText}`
    },
    select: {
        textAlign: "left",
        height: "30px",
        fontSize: "15px",
        fontWeight: 600,
        paddingLeft: "10px"
    },
    menuItem: {
        height: "30px",
        padding: "6px 0 6px 16px"
    },
    inputLabel: {
        height: "30px",
        marginTop: "-15px",
        marginLeft: "-5px",
        fontSize: "12px",
        color: theme?.palette.common.secondaryText,
        transform: "translate(14px, 18px) scale(1)",
        border: "0px solid"
    }
}));
