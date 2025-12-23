import { User } from '@libs/common-models'

import { SCOPES } from '../constants/constants'

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
