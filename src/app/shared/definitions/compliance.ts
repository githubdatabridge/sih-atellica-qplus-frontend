import { TFunction } from "i18next";
import { Theme } from "@mui/material";
import { QplusActionEnum } from "@databridge/qplus-types";

import { DASHBOARD_VIEW_URL } from "app/shared/constants/constants";
import { View } from "../models/View";

export const getComplianceDefinition = (
    t: TFunction<"translation", undefined, "translation">,
    height?: number,
    theme?: Theme
): View[] => [
    {
        view: t("sih-subheader-select-view-compliance-dashboard"),
        url: DASHBOARD_VIEW_URL.DASHBOARD,
        actions: [
            {
                name: QplusActionEnum.SELECT_VALUE_EXPR,
                value: "=num(Date(Floor(now())-1))",
                key: "MeasurementDate",
                isNum: true
            }
        ],
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-dashboard"),
                layout: [
                    [
                        {
                            title: t("sih-subheader-select-view-compliance-qc-performance"),
                            view: DASHBOARD_VIEW_URL.QC,
                            xs: 12,
                            sm: 12,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "xkkCMUj",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "pzyGyzJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "aByhrH",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "wmRhX",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-compliance-operators"),
                            view: DASHBOARD_VIEW_URL.OPERATORS,
                            xs: 12,
                            sm: 4,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "CVHdEFj",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "JQzA",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "cqjkv",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },

                                {
                                    id: "YjuxCa",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-compliance-workload"),
                            view: DASHBOARD_VIEW_URL.WORKLOAD,
                            xs: 12,
                            sm: 12,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "nPXuX",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "pLmhQb",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ULVHq",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "BnHZDpy",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        }
                    ],
                    [
                        {
                            title: t("sih-subheader-select-view-compliance-patient-measurement"),
                            view: DASHBOARD_VIEW_URL.PATIENT,
                            xs: 12,
                            sm: 12,
                            md: 8,
                            lg: 8,
                            xl: 8,
                            grid: [
                                {
                                    id: "CSeZKhe",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "WCvWdz",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "RgzjfeV",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "CFLpq",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ZPrdey",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "WxzUx",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-compliance-device-events"),
                            view: DASHBOARD_VIEW_URL.DEVICE_EVENTS,
                            xs: 12,
                            sm: 12,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "ardvYrQ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.8)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "SdpJSSf",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 6) * 0.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "WwsTkHd",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "FjMBMpf",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 5) * 1.7)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        }
                    ]
                ]
            }
        ]
    },
    {
        view: t("sih-subheader-select-view-compliance-qc"),
        url: DASHBOARD_VIEW_URL.QC,
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-qc"),
                tabs: [
                    {
                        title: t("sih-compliance-qc-tab-trending"),
                        url: DASHBOARD_VIEW_URL.TRENDING,
                        sheetId: "284968f1-14d3-4112-bcff-f37d89aee781",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionWG",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        filters: [
                            {
                                variableOptions: [
                                    {
                                        isTriggerOnInit: false,
                                        type: "select",
                                        variableName: "vTimeResolutionWG",
                                        isNum: false,
                                        defaultValue: t("sih-compliance-tab-trending-select"),
                                        values: [
                                            {
                                                key: "MeasurementDate",
                                                value: t("sih-compliance-tab-trending-select-daily")
                                            },
                                            {
                                                key: "MeasurementWeek",
                                                value: t(
                                                    "sih-compliance-tab-trending-select-weekly"
                                                )
                                            },
                                            {
                                                key: "MeasurementMonth",
                                                value: t(
                                                    "sih-compliance-tab-trending-select-monthly"
                                                )
                                            },
                                            {
                                                key: "MeasurementYear",
                                                value: t(
                                                    "sih-compliance-tab-trending-select-yearly"
                                                )
                                            }
                                        ],
                                        css: {
                                            borderRadius: "4px",
                                            height: "40px",
                                            minWidth: "115px",
                                            paddingTop: "5px",
                                            marginRight: "10px",
                                            marginLeft: "10px",
                                            backgroundColor: "#e0e0e0"
                                        }
                                    }
                                ]
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "WYyvMe",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ekBZx",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "mdsCFq",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-qc-tab-non-compliance-investigation"),
                        url: DASHBOARD_VIEW_URL.NON_COMPLIANCE_INVESTIGATION,
                        sheetId: "ec7e0445-65e2-480a-90dc-65dedf974451",
                        layout: [
                            [
                                {
                                    id: "ZGfvY",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "jrbjXpJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "YWpxcCF",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWestgardDimension2",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "JsPHXnh",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWestgardDimension3",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    id: "AmsPYb",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "select",
                                            variableName: "vWestgardDimension5",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-qc-tab-performance"),
                        url: DASHBOARD_VIEW_URL.PERFORMANCE,
                        sheetId: "bf78bf55-947a-49f4-a74b-4aff085ef319",
                        layout: [
                            [
                                {
                                    id: "4c0994f5-2a6f-4342-abf9-1a8fc6df6910",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "2a3e5db8-01ef-4c47-acd5-88287f01f63d",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "b357f37c-11cf-4cc0-b7cb-424e14050963",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "bd201b78-b1ff-40d8-be97-814717236eec",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "c69e10fb-e2d5-4242-9913-45ecb34cf9cd",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "YEEmDU",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `72px`,
                                    type: "visualization",
                                    isFilter: true,
                                    isPanelVisible: false
                                }
                            ],
                            [
                                {
                                    id: "nJMpaj",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor(height - 50)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWestgardDimension4",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "aDkKpw",
                                    xs: 12,
                                    sm: 12,
                                    md: 8,
                                    lg: 8,
                                    xl: 8,
                                    height: `${Math.floor(height - 50)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-qc-tab-details"),
                        url: DASHBOARD_VIEW_URL.DETAILS,
                        sheetId: "5b48e530-ad7e-41e6-9bbc-383b4f8317e8",
                        layout: [
                            [
                                {
                                    id: "UjaMvV",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-row"),
                                            variableName: "vShowMaxCountOfRecordsWG",
                                            isNum: true,
                                            defaultValue: 10000,
                                            adornment: "=",
                                            isTriggeredOnInit: false
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-qc-update-meand-and-sd"),
                        url: DASHBOARD_VIEW_URL.UPDATE_QC_MEAN_AND_SD,
                        /*  sheetId: "171f3a3b-0491-4d2f-8cff-db52f8759e85", */
                        layout: [
                            [
                                {
                                    id: "4c0994f5-2a6f-4342-abf9-1a8fc6df6910",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "2a3e5db8-01ef-4c47-acd5-88287f01f63d",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "b357f37c-11cf-4cc0-b7cb-424e14050963",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "bd201b78-b1ff-40d8-be97-814717236eec",
                                    xs: 12,
                                    sm: 12,
                                    md: 1.5,
                                    lg: 1.5,
                                    xl: 1.5,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "c69e10fb-e2d5-4242-9913-45ecb34cf9cd",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 4)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "SYpxxN",
                                    xs: 12,
                                    sm: 12,
                                    md: 2,
                                    lg: 2,
                                    xl: 2,
                                    height: `75px`,
                                    type: "visualization",
                                    isFilter: true,
                                    isPanelVisible: false
                                },
                                {
                                    id: "adFZL",
                                    xs: 12,
                                    sm: 12,
                                    md: 2,
                                    lg: 2,
                                    xl: 2,
                                    height: `75px`,
                                    type: "visualization",
                                    isFilter: true,
                                    isPanelVisible: false
                                },
                                {
                                    id: "jAvfvpe",
                                    xs: 12,
                                    sm: 12,
                                    md: 2,
                                    lg: 2,
                                    xl: 2,
                                    height: `75px`,
                                    type: "visualization",
                                    isFilter: true,
                                    isPanelVisible: false
                                },
                                {
                                    id: "kurgnP",
                                    xs: 12,
                                    sm: 12,
                                    md: 2,
                                    lg: 2,
                                    xl: 2,
                                    height: `75px`,
                                    type: "visualization",
                                    isFilter: true,
                                    isPanelVisible: false
                                },

                                {
                                    id: "xMJxAS",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `75px`,
                                    type: "visualization",
                                    isFilter: true
                                }
                            ],
                            [
                                {
                                    id: "rJuPmA",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height - 50)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWestgardDimensionEditSD",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    },
    {
        view: t("sih-subheader-select-view-compliance-workload"),
        url: DASHBOARD_VIEW_URL.WORKLOAD,
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-workload"),
                tabs: [
                    {
                        title: t("sih-compliance-workload-tab-trending"),
                        url: DASHBOARD_VIEW_URL.TRENDING,
                        sheetId: "0279408a-f68b-478c-99f5-a5ae03b99846",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionWL",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "Jbjzt",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "XdXWU",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-workload-tab-non-compliance-investigation"),
                        url: DASHBOARD_VIEW_URL.NON_COMPLIANCE_INVESTIGATION,
                        sheetId: "23f9ebb6-bba2-45c8-8e49-49f046e9b940",
                        layout: [
                            [
                                {
                                    id: "hQKPGj",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "Brjhzx",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "fxCfTJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWorkloadDimension2",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },

                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "JaPfHC",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWorkloadDimension3",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    id: "uUppM",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWorkloadDimension7",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ],
                                            css: {
                                                borderRight: `1px solid ${theme?.palette.common.highlight10}`,
                                                paddingRight: "5px"
                                            }
                                        },
                                        {
                                            type: "select",
                                            variableName: "vMeasurements",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "0",
                                                    value: t(
                                                        "sih-compliance-tab-measurements-select-measurement"
                                                    )
                                                },
                                                {
                                                    key: "1",
                                                    value: t(
                                                        "sih-compliance-tab-measurements-select-result"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-workload-tab-by-location"),
                        url: DASHBOARD_VIEW_URL.BY_LOCATION,
                        sheetId: "339ebcb6-bd71-4c12-aa7d-687de47caa9d",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vMeasurements",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-chart-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "0",
                                        value: t("sih-compliance-tab-measurements-select-result")
                                    },
                                    {
                                        key: "1",
                                        value: t(
                                            "sih-compliance-tab-measurements-select-measurement"
                                        )
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "BZSCybt",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWorkloadDimension4",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "TranslationDataType.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-category"
                                                    )
                                                }
                                            ],
                                            css: {
                                                borderRight: `1px solid ${theme?.palette.common.highlight10}`,
                                                paddingRight: "5px"
                                            }
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-workload-tab-over-time"),
                        url: DASHBOARD_VIEW_URL.OVER_TIME,
                        sheetId: "e046b247-9d5a-4f3b-975a-be5cf75aacf3",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vWorkloadDimension6",
                                isNum: false,
                                isTriggeredOnInit: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            },
                            {
                                type: "select",
                                variableName: "vMeasurements",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-chart-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "0",
                                        value: t("sih-compliance-tab-measurements-select-result")
                                    },
                                    {
                                        key: "1",
                                        value: t(
                                            "sih-compliance-tab-measurements-select-measurement"
                                        )
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "SgnsvZ",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "0da60aba-3a9c-41f1-88b8-bed5dc925ad0",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vWorkloadDimension5",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "QCLevel",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclevel"
                                                    )
                                                },
                                                {
                                                    key: "QCLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-qclotnr"
                                                    )
                                                },
                                                {
                                                    key: "SubLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sublotnr"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "TranslationDataType.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-measurement-result-type"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-workload-tab-details"),
                        url: DASHBOARD_VIEW_URL.DETAILS,
                        sheetId: "0024e0f5-1695-4823-a739-232491ee4714",
                        layout: [
                            [
                                {
                                    id: "84069ae0-b5ad-4410-afc3-a181c8c4f0e7",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsWL",
                                            isNum: false,
                                            defaultValue: "10000",
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    },
    {
        view: t("sih-subheader-select-view-compliance-patient"),
        url: DASHBOARD_VIEW_URL.PATIENT,
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-patient"),
                tabs: [
                    {
                        title: t("sih-compliance-patient-tab-trending"),
                        url: DASHBOARD_VIEW_URL.TRENDING,
                        sheetId: "6e450820-5ee1-47ca-86cf-703fddbba1c3",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionPE",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "652f7690-cd79-4665-8e2c-ec802c859cfd",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "DRVjXZ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "UxVga",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ATAzR",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-patient-tab-non-compliance-investigation"),
                        url: DASHBOARD_VIEW_URL.NON_COMPLIANCE_INVESTIGATION,
                        sheetId: "98801f1f-9bee-49a5-a186-9af457da2182",
                        layout: [
                            [
                                {
                                    id: "8c184d04-d258-4fd9-a376-e356dca5b358",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ac76d119-c6c5-4fbd-a5e2-c695a5e9ff8e",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "93ca28ee-3534-4790-88dc-15db15da83f3",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vPatientErrorsDimension2",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTransmissionErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-transmission-error-id"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTechnicalErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-technical-error-id"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "3f4f51f0-da73-4edd-8897-c9dcc45e04b4",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vPatientErrorsDimension3",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },
                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTransmissionErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-transmission-error-id"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTechnicalErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-technical-error-id"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    id: "a70fd7b0-6a78-43a2-b5bf-17315c812747",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vPatientErrorsDimension4",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "SampleType",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-sample-type"
                                                    )
                                                },
                                                {
                                                    key: "Analyte",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-analyte"
                                                    )
                                                },

                                                {
                                                    key: "ReagentLotNr",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-reagentlotnr"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTransmissionErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-transmission-error-id"
                                                    )
                                                },
                                                {
                                                    key: "TranslationTechnicalErrorID.$(vLanguage)",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-translation-technical-error-id"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-patient-tab-details"),
                        url: DASHBOARD_VIEW_URL.DETAILS,
                        sheetId: "ac8b221c-84d2-40cf-b01c-326c1e83b1f8",
                        layout: [
                            [
                                {
                                    id: "KNkxJR",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsPE",
                                            isNum: false,
                                            defaultValue: "10000",
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    },
    {
        view: t("sih-subheader-select-view-compliance-device-events"),
        url: DASHBOARD_VIEW_URL.DEVICE_EVENTS,
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-device-events"),
                tabs: [
                    {
                        title: t("sih-compliance-device-events-tab-trending"),
                        url: DASHBOARD_VIEW_URL.TRENDING,
                        sheetId: "c8625666-4a52-4835-a5e8-fdcc9a5b6999",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionDE",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "rpbRuJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "MPyzK",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "hatP",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "xWLCL",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-device-events-tab-non-compliance-investigation"),
                        url: DASHBOARD_VIEW_URL.NON_COMPLIANCE_INVESTIGATION,
                        sheetId: "953e8f39-1854-4ac7-a837-e46745913754",
                        layout: [
                            [
                                {
                                    id: "KuSNTGL",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "HHzPpJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "XyPm",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vDeviceEventsDimension2",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "MessageText",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-message-text"
                                                    )
                                                },
                                                {
                                                    key: "ErrorCode",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-error-code"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "kXxWZt",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vDeviceEventsDimension3",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "MessageText",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-message-text"
                                                    )
                                                },
                                                {
                                                    key: "ErrorCode",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-error-code"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    id: "yLZbTPJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vDeviceEventsDimension4",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Device",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-device"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t("sih-compliance-tab-chart-select-ward")
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                },
                                                {
                                                    key: "MessageText",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-message-text"
                                                    )
                                                },
                                                {
                                                    key: "ErrorCode",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-error-code"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-device-events-tab-details"),
                        url: DASHBOARD_VIEW_URL.DETAILS,
                        sheetId: "d3239f75-2fb9-4c07-9684-e54d6e1fb0cd",
                        layout: [
                            [
                                {
                                    id: "UfZZp",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsDE",
                                            isNum: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    },
    {
        view: t("sih-subheader-select-view-compliance-operators"),
        url: DASHBOARD_VIEW_URL.OPERATORS,
        subViews: [
            {
                title: t("sih-subheader-select-view-compliance-operators"),
                tabs: [
                    {
                        title: t("sih-compliance-operators-tab-metrics"),
                        url: DASHBOARD_VIEW_URL.METRICS,
                        sheetId: "9892e50b-ae4d-48fa-84f4-4e0b598fa4a7",
                        layout: [
                            [
                                {
                                    id: "KWTZw",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 8) * 1.5)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "YZfmAFP",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 8) * 1.5)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "Xxm",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "pdayw",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "GDsqAzB",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "yqcenJP",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "BDLrZ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "jEtuR",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "GXEfp",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                },
                                {
                                    id: "FJZQDg",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 8)}px`,
                                    type: "visualization"
                                }
                            ],

                            [
                                {
                                    id: "pjbG",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height / 8) * 3.5)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "nUaMaeT",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor((height / 8) * 3.5)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "TYsSRrC",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor((height / 8) * 3.5)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-certified-trending"),
                        url: DASHBOARD_VIEW_URL.CERTIFIED_TRENDING,
                        sheetId: "c68a31be-26cd-45b8-b53b-ccb45c3d7f39",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionOTS",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),
                                isTriggeredOnInit: false,
                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "pJsmQc",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "cdHDQs",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-certification-details"),
                        url: DASHBOARD_VIEW_URL.CERTIFICATIONS_DETAILS,
                        sheetId: "531c99f0-b6f3-4989-9aa8-a717e6a73b94",
                        layout: [
                            [
                                {
                                    id: "60e3061c-d0e7-487e-af1d-077e8e3622df",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsOTS",
                                            isNum: true,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-certification-expiration-trending"),
                        url: DASHBOARD_VIEW_URL.CERTIFICATION_EXPIRATION_TRENDING,
                        sheetId: "b20652b9-aa4d-4114-887c-c2cabc93b52f",
                        switcher: [
                            {
                                type: "select",
                                variableName: "vTimeResolutionOT",
                                isNum: false,
                                defaultValue: t("sih-compliance-tab-trending-select"),

                                values: [
                                    {
                                        key: "MeasurementDate",
                                        value: t("sih-compliance-tab-trending-select-daily")
                                    },
                                    {
                                        key: "MeasurementWeek",
                                        value: t("sih-compliance-tab-trending-select-weekly")
                                    },
                                    {
                                        key: "MeasurementMonth",
                                        value: t("sih-compliance-tab-trending-select-monthly")
                                    },
                                    {
                                        key: "MeasurementYear",
                                        value: t("sih-compliance-tab-trending-select-yearly")
                                    }
                                ],
                                css: {
                                    background: "white",
                                    color: theme?.palette.common.primaryText
                                }
                            }
                        ],
                        layout: [
                            [
                                {
                                    id: "NBUmt",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "jFcUta",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-non-compliance-investigation"),
                        url: DASHBOARD_VIEW_URL.NON_COMPLIANCE_INVESTIGATION,
                        sheetId: "c23969ab-40d5-4869-bc78-8e0f686000fa",
                        layout: [
                            [
                                {
                                    id: "25c05d8f-1af4-419e-baa6-bbe012d89204",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "8e5a2d8a-d051-4deb-bce7-1246ec8d43db",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "a91bd175-d8c3-4d43-90ec-add99c5b5cdf",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vOTrainingsDimension2",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-ward"
                                                    )
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "5acac757-e9c9-4886-a952-2d3a71380379",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vOTrainingsDimension3",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-ward"
                                                    )
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    id: "56aada13-c7f5-47fa-98f8-9f5e35840d1b",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height - 50) / 2)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            isTriggeredOnInit: false,
                                            type: "select",
                                            variableName: "vOTrainingsDimension4",
                                            isNum: false,
                                            defaultValue: t("sih-compliance-tab-chart-select"),
                                            values: [
                                                {
                                                    key: "Model",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-model"
                                                    )
                                                },
                                                {
                                                    key: "Hospital",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-hospital"
                                                    )
                                                },
                                                {
                                                    key: "Department",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-department"
                                                    )
                                                },
                                                {
                                                    key: "Ward",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-key-ward"
                                                    )
                                                },
                                                {
                                                    key: "UserName",
                                                    value: t(
                                                        "sih-compliance-tab-chart-select-username"
                                                    )
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-planning-details"),
                        url: DASHBOARD_VIEW_URL.PLANNING_DETAILS,
                        sheetId: "2eaf3062-9991-4864-8b8f-af2ae422c919",
                        layout: [
                            [
                                {
                                    id: "Kesq",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsOTS",
                                            defaultValue: 10000,
                                            adornment: "=",
                                            isTriggeredOnInit: false
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-compliance-operators-tab-worktime-details"),
                        url: DASHBOARD_VIEW_URL.WORKTIME_DETAILS,
                        sheetId: "bfcc2419-0c32-4376-b29b-c004bbb4af40",
                        layout: [
                            [
                                {
                                    id: "bYtcyJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height + 20)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "aef2fab2-5ad6-4dc1-ac04-1557894122a3",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height + 20)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-compliance-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsBCS",
                                            isNum: true,
                                            defaultValue: 10000,
                                            adornment: "=",
                                            isTriggeredOnInit: false
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    }
];
