import appTranslations from "assets/i18n/translations";
import qplusTranslations from "assets/i18n/overwrite";

const languageResources = {
    app: {
        ...appTranslations
    },
    qplus: {
        ...qplusTranslations
    }
};

export default languageResources;
