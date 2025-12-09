// Utility function for creating Qlik App Object
export const createQlikAppObject = (appId, initials, backgroundColor, color) => ({
    qAppId: appId,
    qActions: [],
    qMeta: {
        initials,
        backgroundColor,
        color
    },
    qAppEvents: ["closed", "error"],
    qIsDefault: false
});

// Utility function for clearing URL Parameters
export const clearUrlParams = (navigate, page: string) => {
    navigate(
        {
            pathname: page,
            search: "" // Removes all query parameters
        },
        { replace: true }
    );
};

export const clearUrlParamsInHashRouter = page => {
    // Construct the new URL without query parameters but preserving the hash
    const newUrl = `${window.location.pathname}#apps/dashboard/${page}`;

    // Use the history API to navigate without reloading the page
    window.history.replaceState(null, "", newUrl);
};

export const processUrl = (urlString: string, isDev = false) => {
    let newUrlString = urlString;
    // Check if the string is a path (starts with "/")
    if (urlString.startsWith("/") && !isDev) {
        // It's a path, so add window.location.origin as prefix
        newUrlString = window.location.origin + urlString;
    }

    // It's a full URL, return as is
    return newUrlString;
};
