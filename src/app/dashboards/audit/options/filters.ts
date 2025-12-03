export const filterLoggedDate = {
  qFieldName: "LoggedDateFormatted",
  label: "Date Range",
};

export const filterLoggedAction = {
  qFieldName:
    "=TranslationLoggedAction.$(vLanguage) & IF(len(cShowTranslateItem), ' => Enum AuditLoggedAction')",
  label: "Logged Action",
};

export const filterApplicationUser = {
  qFieldName: "%LoggedUser",
  label: "Application User",
};

export const filterChangedItem = {
  qFieldName: "=$(cUpdateColumns_Model)",
  label: "Changed Item",
};
