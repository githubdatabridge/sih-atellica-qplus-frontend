interface QlikLoaderConfig {
    host: string
    javascriptUrl?: string
    stylesUrl?: string
    insightAdvisorChatUrl?: string
    virtualProxy: string
    webIntegrationId?: string
    clientId?: string
    token?: string
}

class QlikLoaderService {
    loadFile(file: HTMLLinkElement | HTMLScriptElement): Promise<void> {
        return new Promise((resolve, reject) => {
            file.onload = () => resolve()
            file.onerror = err => reject(err)
            document.head.appendChild(file)
        })
    }

    async loadStyleSheet(url: string): Promise<void> {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = url
        await this.loadFile(link)
    }

    // TODO: Rename
    async loadJavaScript(url: string): Promise<void> {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        await this.loadFile(script)
    }

    requireQlikJavascript(url: string, webIntegrationId?: string, clientId?: string) {
        return new Promise(resolve => {
            const { require }: any = window

            require?.config({
                baseUrl: `${url}/resources`,
                webIntegrationId,
                clientId,
                config: {
                    text: {
                        onXhr: (xhr: any) => {
                            xhr.withCredentials = true
                            //xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
                        },
                        useXhr: true
                    }
                }
            })
            require(['js/qlik'], (qlik: any) => {
                resolve(qlik)
            })
        })
    }

    requireQlikInsightAdvisorJavascript(url: string, webIntegrationId?: string, clientId?: string) {
        return new Promise(resolve => {
            const { require }: any = window

            require?.config({
                baseUrl: `${url}/resources`,
                webIntegrationId,
                clientId,
                scriptType: 'application/javascript',
                config: {
                    text: {
                        onXhr: (xhr: any) => {
                            xhr.withCredentials = true
                        },
                        useXhr: true
                    }
                }
            })
            require(['hub/external/hubchat/hub-chat-ui'], (hubChat: any) => {
                resolve(hubChat)
            })
        })
    }

    async loadQlikAssets(config: QlikLoaderConfig): Promise<any> {
        const { host, stylesUrl, javascriptUrl, virtualProxy, clientId, webIntegrationId } = config
        const proxyString = virtualProxy && virtualProxy !== '/' ? `/${virtualProxy}` : ''

        try {
            await Promise.all([
                this.loadStyleSheet(`https://${host}${proxyString}/${stylesUrl}`),
                this.loadJavaScript(`https://${host}${proxyString}/${javascriptUrl}`)
            ])
        } catch (error) {
            console.error(`LOADER ERROR ${JSON.stringify(error)}`)
        }

        const q = await this.requireQlikJavascript(
            `https://${host}${proxyString}`,
            webIntegrationId,
            clientId
        )

        return q
    }

    async loadQlikInsightAdvisorAssets(config: QlikLoaderConfig): Promise<any> {
        const { host, virtualProxy, webIntegrationId, clientId } = config
        const proxyString = virtualProxy && virtualProxy !== '/' ? `/${virtualProxy}` : ''

        const chatUi = await this.requireQlikInsightAdvisorJavascript(
            `https://${host}${proxyString}`,
            webIntegrationId,
            clientId
        )
        return chatUi
    }
}

export const qlikLoaderService = new QlikLoaderService()
