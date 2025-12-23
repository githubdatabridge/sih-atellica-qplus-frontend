export const visualizationOptions = (id: string, height: string) => {
    return {
        id,
        height,
        titleOptions: {
            disableQlikNativeTitles: true,
            useQlikTitlesInPanel: {
                useQlikLayoutTitles: false
            }
        },
        enableFullscreen: true,
        isToolbarOnPanel: false,
        exportOptions: {
            types: ['xlsx', 'pdf', 'png']
        }
    }
}
