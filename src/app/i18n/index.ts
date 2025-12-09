import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

function initI18n(resources: Resource | undefined, defaultLanguage: string) {
    return i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: "en",
        debug: import.meta.env.MODE === "development",
        interpolation: {
            escapeValue: false // React already escapes strings
        }
    });
}

function getCurrentLanguage(): string {
    return i18n.language;
}

function changeLanguage(language: string) {
    return i18n.changeLanguage(language);
}

function onLanguageChanged(callback: (language: string) => void) {
    return i18n.on("languageChanged", callback);
}

function mapLanguageCode(languageCode) {
    const languageMap = {
        gb: "en",
        sv: "se",
        ja: "jp",
        zh: "cn"
        // Add more mappings here as needed
    };

    // Check if the provided language code is in the map
    // eslint-disable-next-line no-prototype-builtins
    if (languageMap.hasOwnProperty(languageCode)) {
        return languageMap[languageCode];
    }
    return languageCode; // If not found, return the original language code
}

export { initI18n, getCurrentLanguage, changeLanguage, onLanguageChanged, mapLanguageCode };
