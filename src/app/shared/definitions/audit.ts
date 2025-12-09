import { TFunction } from "i18next";

import { DASHBOARD_VIEW_URL } from "app/shared/constants/constants";
import { View } from "../models/View";

export const getAuditDefinition = (
    t: TFunction<"translation", undefined, "translation">,
    height?: number
): View[] => [
    {
        view: t("sih-subheader-select-view-audit-dashboard"),
        url: DASHBOARD_VIEW_URL.DASHBOARD,
        subViews: [
            {
                title: t("sih-subheader-select-view-audit-dashboard"),
                layout: [
                    [
                        {
                            title: t("sih-subheader-select-view-audit-model-and-device"),
                            view: DASHBOARD_VIEW_URL.MODEL_AND_DEVICE,
                            tab: DASHBOARD_VIEW_URL.MODEL_AND_DEVICE,
                            xs: 12,
                            sm: 12,
                            md: 8,
                            lg: 8,
                            xl: 8,
                            grid: [
                                {
                                    id: "BDadue",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "BZZAa",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "Fejmpq",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "zHkd",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        },
                        {
                            xs: 12,
                            sm: 12,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "aGvKYp",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 3.62)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    title: t(
                                        "sih-subheader-select-view-audit-model-and-device-and-other"
                                    ),
                                    view: DASHBOARD_VIEW_URL.MODEL_AND_DEVICE,
                                    tab: DASHBOARD_VIEW_URL.MODEL_AND_DEVICE,
                                    showTitles: false
                                },
                                {
                                    id: "YKtBd",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 3.62)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    title: t("sih-subheader-select-view-audit-eqa-distributions"),
                                    view: DASHBOARD_VIEW_URL.QUALITY,
                                    tab: DASHBOARD_VIEW_URL.QUALITY_EQA_DISTRIBUTIONS,
                                    showTitles: false
                                }
                            ]
                        }
                    ],
                    // END OF FIRST ROW
                    // START OF SECOND ROW
                    [
                        {
                            title: t("sih-subheader-select-view-compliance-operators"),
                            view: DASHBOARD_VIEW_URL.OPERATOR,
                            xs: 12,
                            sm: 12,
                            md: 12,
                            lg: 12,
                            xl: 12,
                            grid: [
                                {
                                    id: "huMRu",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "UjVMKH",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "tDhumKy",
                                    xs: 12,
                                    sm: 12,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "uHcXcrF",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "DFKx",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        }
                    ],
                    // END OF SECOND ROW
                    // START OF THIRD ROW
                    [
                        {
                            title: t("sih-subheader-select-view-audit-qc-measurements"),
                            view: DASHBOARD_VIEW_URL.QUALITY,
                            tab: DASHBOARD_VIEW_URL.QUALITY_QC_MEASUREMENTS,
                            xs: 12,
                            sm: 12,
                            md: 6,
                            lg: 6,
                            xl: 6,
                            grid: [
                                {
                                    id: "ZhssSAE",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "HBuBup",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-audit-eqa-measurements"),
                            view: DASHBOARD_VIEW_URL.QUALITY,
                            tab: DASHBOARD_VIEW_URL.QUALITY_EQA_MEASUREMENTS,
                            xs: 12,
                            sm: 12,
                            md: 3,
                            lg: 3,
                            xl: 3,
                            grid: [
                                {
                                    id: "zkpvee",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 2.81)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    showTitles: false
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-audit-linearity-measurements"),
                            view: DASHBOARD_VIEW_URL.QUALITY,
                            tab: DASHBOARD_VIEW_URL.QUALITY_LINEARITY,
                            xs: 12,
                            sm: 12,
                            md: 3,
                            lg: 3,
                            xl: 3,
                            grid: [
                                {
                                    id: "VTknAa",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 2.81)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    showTitles: false
                                }
                            ]
                        }
                    ],
                    // END OF THIRD ROW
                    // START OF FOURTH ROW
                    [
                        {
                            title: t("sih-subheader-select-view-audit-measurement-comments"),
                            view: DASHBOARD_VIEW_URL.QUALITY,
                            tab: DASHBOARD_VIEW_URL.QUALITY_COMMENTS,
                            xs: 12,
                            sm: 12,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            grid: [
                                {
                                    id: "AJjPjAm",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor(height / 2.81)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    showTitles: false
                                }
                            ]
                        },
                        {
                            title: t("sih-subheader-select-view-audit-patients"),
                            view: DASHBOARD_VIEW_URL.PATIENTS,
                            xs: 12,
                            sm: 12,
                            md: 8,
                            lg: 8,
                            xl: 8,
                            grid: [
                                {
                                    id: "gujGJJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "MNqRxzs",
                                    xs: 12,
                                    sm: 12,
                                    md: 6,
                                    lg: 6,
                                    xl: 6,
                                    height: `${Math.floor(height / 3)}px`,
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
        view: t("sih-subheader-select-view-audit-model-and-device"),
        url: "model-and-device",
        subViews: [
            {
                title: t("sih-subheader-select-view-audit-model-and-device"),
                tabs: [
                    {
                        title: t("sih-audit-model-and-device-tab-model-configuration"),
                        url: "model-configuration",
                        sheetId: "ca917ab5-d63e-4522-b75c-95015356632a",
                        layout: [
                            [
                                {
                                    id: "775205bb-3e6f-46f9-83d7-277b8742c9da",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "47dd29c4-71ba-4385-8852-71a99063b8c3",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "2b2333c6-40f6-452b-8158-acc5e0df3ae5",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "4f6617c8-7a1f-4129-9709-17420251c0ac",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    calculationCondition: "=$(cExistUpdatesZLog_Model)>0",
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "fe8801f0-e64d-44f1-bccd-16f3822f9077",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsWG",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t(
                            "sih-audit-model-device-configuration-settings-tab-model-configuration"
                        ),
                        url: "model-device-configuration-settings",
                        sheetId: "1b992673-0de4-4bca-8fee-fa1d6546db0c",
                        layout: [
                            [
                                {
                                    id: "wubpEDJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "cMWLV",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "HsjaD",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "8a3584e2-da1f-4566-8143-509672279b86",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_ConfigurationSettings)>0",
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "1f0826bd-f463-47c1-a7c6-35986c9689e5",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsModel",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-model-and-device-tab-device-configuration"),
                        url: "device-configuration",
                        sheetId: "94781139-dcb7-4fd7-8d3a-b37845fce2be",
                        layout: [
                            [
                                {
                                    id: "gmAPc",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "MhcbmZ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "mMJXpj",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "24c8604e-b60c-4b18-aff3-a9577f20d7a5",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "$(cExistUpdatesZLog_Devices)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "e8ee26ee-8532-462d-951f-09ebf0330224",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsDevices",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-model-and-device-tab-device-additional-information"),
                        url: "device-additional-information",
                        sheetId: "5762112b-9f81-4f0c-b312-df86403a5a01",
                        layout: [
                            [
                                {
                                    id: "SshTUN",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "CQdzFN",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "hjgaQjP",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "8d6af606-662d-446b-9bf5-b37d932ab471",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_DevicePorts)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "36ce2ed4-d731-489e-8840-5a5d53dd6689",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsDevicePorts",
                                            isNum: true,
                                            isTriggeredOnInit: false,
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
        view: t("sih-subheader-select-view-audit-activation-deactivation"),
        url: "activation-deactivation",
        subViews: [
            {
                title: t("sih-audit-activation-deactivation-tab-model-device-lotnumbers"),
                tabs: [
                    {
                        title: t("sih-audit-activation-deactivation-tab-model-device-lotnumbers"),
                        url: "model-device-and-consumable-lot-numbers",
                        sheetId: "5da718fe-24fc-4a10-a3c3-1fe7f6897770",
                        layout: [
                            [
                                {
                                    id: "vLHqaW",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ygfeJD",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "fvcBPr",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ApPpMr",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "70e2436e-f14d-4861-ae2f-ca88ab077d3e",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsDateActivating",
                                            isNum: true,
                                            isTriggeredOnInit: false,
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
        view: t("sih-subheader-select-view-audit-operator"),
        url: "operator",
        subViews: [
            {
                title: t("sih-subheader-select-view-audit-operator"),
                tabs: [
                    {
                        title: t("sih-audit-operator-tab-setup"),
                        url: "operator-setup",
                        sheetId: "3d5890e6-c88c-4e81-93ea-baa40c3cf91a",
                        layout: [
                            [
                                {
                                    id: "qqJJjk",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "DzyuN",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "FbyDbm",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "4e8787aa-de67-496a-9b6e-6fc25798af5d",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_UserTbl)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "66332aa3-3924-463c-addf-ee7ab87c210b",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsUserTbl",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-operator-tab-location-assignment"),
                        url: "operator-local-assignment",
                        sheetId: "d5fc4030-308a-4b55-a9f7-158086742c32",
                        layout: [
                            [
                                {
                                    id: "epWKg",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "mzPezyn",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "eYsUE",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "3a36d337-8604-4c0d-9b7f-c8af398cdc53",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_UserLocRights)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "39ac2053-4253-4b67-81bc-8accf92fa695",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsUserLocRights",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-operator-tab-model-certifications"),
                        url: "operator-model-certifications",
                        sheetId: "d1942bfb-237b-4a92-b87a-c2320c198831",
                        layout: [
                            [
                                {
                                    id: "DnTArsq",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "bZPvp",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "Cpn",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "a5eccf5b-59e8-4862-93e3-d696782f5adc",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_UserModelRights)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "267a59df-1a66-4537-aec5-1d6341039b2f",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsUserModelRights",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-operator-tab-elearning-results"),
                        url: "operator-e-learning-results",
                        sheetId: "cd526503-dfbc-43cf-9a28-045756516243",
                        layout: [
                            [
                                {
                                    id: "nmzr",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "QCpVAg",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "kmXd",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "152ea80b-273f-4c2c-9090-7fde2e2479b6",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_LearningResults)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "5526b071-6d3c-457c-ab3c-7763af076585",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsLearningResults",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-operator-tab-auto-recertifications"),
                        url: "operator-auto-recertification",
                        sheetId: "5d37db88-02a6-4510-ad29-f0d654c37917",
                        layout: [
                            [
                                {
                                    id: "2d8852c7-a461-40b8-9d16-b1d125c8e45c",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "BFUtMhs",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "b3885d2f-b1a0-40f1-8968-26f4a7c1b4da",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "43312489-cbc1-4d8a-af62-5e1790903f4d",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_UserAutoRecertificationPeriods)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "22dba538-b3e1-486f-9c22-f526a2ba9818",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName:
                                                "vShowMaxCountOfRecordsUserAutoRecertificationPeriods",
                                            isNum: true,
                                            isTriggeredOnInit: false,
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
        view: t("sih-subheader-select-view-audit-quality"),
        url: "quality",
        subViews: [
            {
                title: t("sih-subheader-select-view-audit-quality"),
                tabs: [
                    {
                        title: t("sih-audit-quality-tab-qc-measurement"),
                        url: "quality-qc-measurements",
                        sheetId: "584de422-9e4b-411b-982c-bf0dc8d13538",
                        layout: [
                            [
                                {
                                    id: "GNpLNr",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "ywpQc",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "pjhnmf",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "3dc83520-a25b-4e60-b3b2-a5bf9296e717",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_QC_Results)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "648435cc-84ef-4e99-b4a0-dc3b1de2a11e",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsUserQC_Results",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-quality-tab-incomplete-qc"),
                        url: "quality-incomplete-qc",
                        sheetId: "b8d53af0-005b-4c90-b9e6-bbd9fd9f8a23",
                        layout: [
                            [
                                {
                                    id: "BaperQ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "nvYXxF",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "cpmSj",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "fdd80fd3-6419-4225-9ee0-7e3e6ffb8673",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_QC_ErrorResults)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "6820e388-48c6-46ff-844e-fa1b82704ee6",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsQC_ErrorResults",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-quality-tab-linearity"),
                        url: "quality-linearity",
                        sheetId: "8c74e6ec-f10f-4288-9c74-7731e225431c",
                        layout: [
                            [
                                {
                                    id: "KjFgh",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "vewPjpA",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "Ejbux",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "21f6f5c5-b762-4c57-9f3d-1c72f56b7042",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_LinearityMeasurementResults)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "bf84a3fd-f975-4eb5-8d1c-02ddc09e2423",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName:
                                                "vShowMaxCountOfRecordsLinearityMeasurementResults",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-quality-tab-comments"),
                        url: "quality-comments",
                        sheetId: "3a4a92b7-289a-4930-b0c7-63da8b958f05",
                        layout: [
                            [
                                {
                                    id: "cxEyVYW",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "fPbMqy",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "CxVm",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "4560bb42-43b3-46c4-a678-76117a4fba73",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_MeasurementComments)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "ca3448d6-89e5-4630-a7b3-740fb310e6c3",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName:
                                                "vShowMaxCountOfRecordsMeasurementComments",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-quality-tab-eqa-distributions"),
                        url: "quality-eqa-distributions",
                        sheetId: "d6661c31-74f3-4ffa-80bc-0c2be04a41bb",
                        layout: [
                            [
                                {
                                    id: "a6244ada-12e3-4cd3-8f45-65a0c1ca0f5f",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "1e2a9ce1-df10-45bd-b00a-adec908abfe2",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "27ca2f3a-2ac0-4d62-aedb-d0c763f5e90b",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "55fd3d38-f87e-4aa4-940e-16d993c4dc1c",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_EQA_Distributions)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "ecf100b9-d451-4677-ac3c-940d503b33dc",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsEQA_Distributions",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-quality-tab-eqa-measurements"),
                        url: "quality-eqa-measurements",
                        sheetId: "c9dff0d2-d5ef-4490-b70e-0fb85aa10242",
                        layout: [
                            [
                                {
                                    id: "AjjGj",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "HaYQ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "MdLKNp",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "768392d5-4dcf-4af4-b81f-6d717fc63f4f",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition: "=$(cExistUpdatesZLog_EQA_Results)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "b4685346-ef5d-4488-90d3-89fcffb7132a",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName: "vShowMaxCountOfRecordsEQA_Results",
                                            isNum: true,
                                            isTriggeredOnInit: false,
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
        view: t("sih-subheader-select-view-audit-patients"),
        url: "patients",
        subViews: [
            {
                title: t("sih-subheader-select-view-audit-patients"),
                tabs: [
                    {
                        title: t("sih-audit-patients-tab-demographics"),
                        url: "patients-demographics",
                        sheetId: "6badf93b-e301-4591-bf76-b2bc96353786",
                        layout: [
                            [
                                {
                                    id: "naPCpJ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "STgmgg",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "UpgTmYL",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "b01ee4ea-47f0-4d72-b9c1-dd33239ffef2",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_PatientIdentification)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "202b5f01-f25d-434f-8889-90562ff2a471",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName:
                                                "vShowMaxCountOfRecordsPatientIdentification",
                                            isNum: true,
                                            isTriggeredOnInit: false,
                                            defaultValue: 10000,
                                            adornment: "="
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        title: t("sih-audit-patients-tab-results"),
                        url: "patients-results",
                        sheetId: "b61b9222-6881-4836-ae25-52dc98d4307c",
                        layout: [
                            [
                                {
                                    id: "NbVKZ",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "cXgnRGH",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "JdcVPxP",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"]
                                },
                                {
                                    id: "63f6f3dc-c605-48a9-9e57-7d7a5cac87f9",
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    height: `${Math.floor(height / 3)}px`,
                                    type: "visualization",
                                    calculationCondition:
                                        "=$(cExistUpdatesZLog_PatientMeasurementResults)>0",
                                    export: ["xlsx", "png", "pdf"]
                                }
                            ],
                            [
                                {
                                    id: "1c3cf6ce-24db-4f60-a6ba-7a99b56cc135",
                                    xs: 12,
                                    sm: 12,
                                    md: 12,
                                    lg: 12,
                                    xl: 12,
                                    height: `${Math.floor((height / 4) * 3)}px`,
                                    type: "visualization",
                                    export: ["xlsx", "png", "pdf"],
                                    variableOptions: [
                                        {
                                            type: "input",
                                            placeHolder: t("sih-audit-tab-chart-input-rows"),
                                            variableName:
                                                "vShowMaxCountOfRecordsPatientMeasurementResults",
                                            isNum: true,
                                            isTriggeredOnInit: false,
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
    }
];
