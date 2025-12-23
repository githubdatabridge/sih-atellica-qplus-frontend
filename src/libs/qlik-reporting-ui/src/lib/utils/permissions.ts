import { Report, User } from '@libs/common-models'

import { SCOPES } from '../constants/constants'

/**
 * Determines if a report is read-only based on various conditions.
 *
 * @param {Object} report - The report object.
 * @param {Object} appUser - The application user object.
 * @param {boolean} isAdminOn - Flag indicating if the user is an admin.
 * @returns {boolean} - True if the report should be read-only, false otherwise.
 */
export const checkIfReportIsReadOnly = (report: Report, appUser: User, isAdminOn: boolean) => {
    const isPersonal = report.appUserId === appUser.appUserId
    const isSystem = report.isSystem
    const isTemplate = report.templateId > 0

    // If it's a system report, check for 'datasets:write' scope if scopes are defined, otherwise true
    const hasWriteScope =
        isAdminOn && (appUser?.scopes?.length > 0 ? appUser.scopes.includes(SCOPES.WRITE) : true)

    // The report is read-only if:
    const readOnly =
        (!isAdminOn && (!isPersonal || isSystem)) || // User is not an admin and report is not personal and isSystem.
        (isAdminOn && isSystem && isTemplate && !hasWriteScope && !isPersonal) || // Admin, system and template report, no write scopes, not personal.
        (isAdminOn && isSystem && isTemplate && hasWriteScope && !isPersonal) || // Admin, system and template report, no write scopes, not personal.
        (isAdminOn && isSystem && !isTemplate && !hasWriteScope && !isPersonal) || // Admin, system and template report, no write scopes, not personal.
        (isSystem && !isTemplate && isPersonal && !isAdminOn) // System report, not a template, personal, and user is not an admin.

    return readOnly
}

/**
 * Determines if user has write scopes
 *
 * @param {Object} appUser - The application user object.
 * @param {boolean} isAdminOn - Flag indicating if the user is an admin.
 * @returns {boolean} - True if the report should be read-only, false otherwise.
 */
export const checkIfHasWriteScopes = (appUser: User, isAdminOn: boolean) => {
    // If it's a system report, check for 'datasets:write' scope if scopes are defined, otherwise true
    const hasWriteScope =
        isAdminOn && (appUser?.scopes?.length > 0 ? appUser.scopes.includes(SCOPES.WRITE) : true)
    return Boolean(hasWriteScope)
}
