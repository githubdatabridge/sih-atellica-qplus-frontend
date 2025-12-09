import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { USER_ROLES, ROLE_PERMISSIONS } from "../constants/constants";

const useUserRole = (user, isAdmin) => {
    const { t } = useTranslation(); // Assuming useTranslation is used elsewhere in your component

    return useMemo(() => {
        // Directly return "User" role if not admin
        if (!isAdmin) {
            return USER_ROLES.ROLE_USER; // Adjusted to return correctly within useMemo
        }

        // Determine the admin type based on user scopes
        if (isAdmin) {
            return user?.scopes?.includes(ROLE_PERMISSIONS.WRITE)
                ? t(USER_ROLES.ROLE_SYSTEM_ADMIN)
                : t(USER_ROLES.ROLE_CUSTOMER_ADMIN);
        }

        // Default return, in case needed, though logically this point shouldn't be reached
        return t(USER_ROLES.ROLE_USER);
    }, [isAdmin, t, user?.scopes]); // Dependencies array to re-compute the memoized value when these change
};

export default useUserRole;
