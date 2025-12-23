/**
 * @public
 * @param {{qThousandSep: string, qDecimalSep: string, qMoneyThousandSep: string, qMoneyDecimalSep: string, qMoneyFmt: string,
 * qTimeFmt: string, qDateFmt: string, qTimestampFmt: string, qFirstWeekDay: string, qReferenceDay: string,
 * qFirstMonthOfYear: string, qCollation: string, qMonthNames: string,
 * qLongMonthNames: string, qDayNames: string, qLongDayNames: string }} localInfoData
 * @returns {{ThousandSep: string, DecimalSep: string, MoneyThousandSep: string, MoneyDecimalSep: string,
 * MoneyFormat: string, TimeFormat: string, DateFormat: string, TimestampFormat: string, FirstWeekDay: string,
 * ReferenceDay: string, FirstMonthOfYear: string, CollationLocale: string, MonthNames: string, LongMonthNames: string,
 * DayNames: string, LongDayNames: string}}
 */
export function convertQixGetLocalInfo(localInfoData: any) {
    return {
        ThousandSep: localInfoData.qThousandSep,
        DecimalSep: localInfoData.qDecimalSep,
        MoneyThousandSep: localInfoData.qMoneyThousandSep,
        MoneyDecimalSep: localInfoData.qMoneyDecimalSep,
        MoneyFormat: localInfoData.qMoneyFmt,
        TimeFormat: localInfoData.qTimeFmt,
        DateFormat: localInfoData.qDateFmt,
        TimestampFormat: localInfoData.qTimestampFmt,
        FirstWeekDay: localInfoData.qFirstWeekDay,
        ReferenceDay: localInfoData.qReferenceDay,
        FirstMonthOfYear: localInfoData.qFirstMonthOfYear,
        CollationLocale: localInfoData.qCollation,
        MonthNames: localInfoData.qCalendarStrings.qMonthNames,
        LongMonthNames: localInfoData.qCalendarStrings.qLongMonthNames,
        DayNames: localInfoData.qCalendarStrings.qDayNames,
        LongDayNames: localInfoData.qCalendarStrings.qLongDayNames
    }
}

export const dateFromQlikNumber = (n: number) => {
    // return: Date from Qlik number
    const d: Date = new Date(Math.round((n - 25569) * 86400 * 1000))
    // since date was created in UTC shift it to the local timezone
    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000)
    return d
}
