import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { TQSheetObject } from "@databridge/qlik-models";
import { useQlikSheetContext } from "@databridge/qlik-providers";

import Filter from "./Filter";

interface IFilterListProp {
    qlikAppId: string;
    sheetId: string;
}

const FilterList: FC<IFilterListProp> = ({ qlikAppId, sheetId }) => {
    const [qlikFilters, setQlikFilters] = useState<TQSheetObject[]>([]);
    const { qSheetMap } = useQlikSheetContext();

    useEffect(() => {
        if (qSheetMap?.size > 0 && qlikAppId && sheetId) {
            const sheets = qSheetMap.get(qlikAppId);
            const sheetTab = sheets?.find(s => s.id === sheetId);
            const filters = sheetTab?.cells.filter(c => c.type === "filterpane");
            setQlikFilters(filters || []);
        }
    }, [sheetId, qlikAppId, qSheetMap]);

    if (qlikFilters.length === 0) return null;

    return (
        <>
            {qlikFilters.map(item => (
                <Box key={`box-${item.id}`} display="flex" flexDirection="row">
                    <Filter key={item.id} qlikAppId={qlikAppId} qlikObjectId={item.id} />
                </Box>
            ))}
        </>
    );
};

export default FilterList;
