const useFileHandler = () => {
    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    const downloadJsonFile = (jsonData: any, fileName: string) => {
        const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
        const url = window.URL.createObjectURL(jsonBlob)
        downloadFile(url, fileName)
        window.URL.revokeObjectURL(url)
    }

    return {
        downloadJsonFile,
        downloadFile
    }
}

export default useFileHandler
