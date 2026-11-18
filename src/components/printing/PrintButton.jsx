import { getI18n } from "@/lib/printing-i18n";
import PrintButtonClient from "./PrintButtonClient";

/**
 * A floating button that opens the browser's print dialog, for documents people
 * print themselves. Render it inside the tree that loaded the request's labels:
 * the translator is server-only, so the label is resolved here and handed to the
 * client button.
 */
export default function PrintButton() {
    const { t, dir } = getI18n();
    return <PrintButtonClient label={t("Lcz_Print")} dir={dir} />;
}
