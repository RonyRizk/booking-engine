/**
 * Booking documents that aren't fiscal: printed for the guest to read and sign.
 *
 * Supported modes:
 *   - consent — the registration card of one room: the booking print limited to
 *               that room, its guests and the property's terms and conditions.
 *
 * @param {object} props
 * @param {object} props.params                       - Next.js route segments.
 * @param {string} props.params.id                    - Property aname used to resolve the property.
 * @param {object} props.searchParams                 - URL search parameters.
 * @param {"consent"} props.searchParams.mode         - Document mode (required).
 * @param {string} props.searchParams.id              - Booking number (required).
 * @param {string} props.searchParams.room_identifier - `identifier` of the room to print (required for consent).
 * @param {string} props.searchParams.token           - Auth token (required).
 * @param {("alpha"|"production")} [props.searchParams.environment="production"] - Gateway to use: "alpha" → IRALPHA, otherwise IR.
 */

import "../shared/fiscal-printing.css";
import PrintFont from "@/components/printing/PrintFont";
import PrintButton from "@/components/printing/PrintButton";
import ConsentPreview from "./components/consent-preview";
import { BookingService } from "@/lib/services/booking.service";
import { CommonServices } from "@/lib/services/common.service";
import { PrintingService } from "@/lib/services/printing.service";
import { getI18n, loadDocumentProperty, loadPrintingLabels } from "@/lib/printing-i18n";
import { resolveEnvironmentBaseUrl } from "@/lib/middleware";
import { invalidLinkReason, withPrintLog } from "@/lib/printing-log";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set(["consent"]);

const printContext = ({ params, searchParams }) => ({
    route: "doc",
    mode: searchParams.mode,
    property: params.id,
    booking: searchParams.id,
    document: searchParams.room_identifier,
    environment: searchParams.environment,
});

const somethingWentWrong = () => <span>{getI18n().t("Lcz_SomethingWentWrongTryAgain")}</span>;

async function DocumentPage({ params, searchParams }, log) {
    const { mode, id: booking_nbr, room_identifier, token, environment } = searchParams;
    const baseUrl = resolveEnvironmentBaseUrl(environment, DEFAULT_BASE_URL);

    const rejection = invalidLinkReason({
        token,
        mode: mode?.toLowerCase()?.trim(),
        validModes: VALID_MODES,
        required: { booking: booking_nbr, room: room_identifier },
    });
    if (rejection) {
        log.rejected(rejection);
        return somethingWentWrong();
    }

    const bookingService = new BookingService();
    bookingService.setToken(token);
    bookingService.setBaseUrl(baseUrl);

    const commonService = new CommonServices();
    commonService.setToken(token);
    commonService.setBaseUrl(baseUrl);

    const printingService = new PrintingService(token);
    printingService.setBaseUrl(baseUrl);

    let property, booking, bedPreferences, setupTables, countries;
    try {
        const { lang: langPromise, property: propertyPromise } = loadDocumentProperty(commonService, params.id);
        [property, booking, bedPreferences, setupTables, countries] = await Promise.all([
            propertyPromise,
            langPromise.then((language) => bookingService.getExposedBooking({
                is_get_financial_snapshot: true,
                is_calculate_totals: true,
                booking_nbr,
                extras: [{ key: "payment_code", value: "" }],
                language,
            })),
            bookingService.getBedPreference(),
            langPromise.then((lang) => commonService.getSetupEntriesByTBLNameMulti(["_SVC_CATEGORY"], lang)),
            langPromise.then((lang) => commonService.getCountries(lang)),
            langPromise.then((lang) => loadPrintingLabels(lang, token)),
        ]);
    } catch (error) {
        log.failed(error);
        return somethingWentWrong();
    }

    if (!booking) {
        log.rejected("booking not found");
        return somethingWentWrong();
    }
    const room = (booking.rooms ?? []).find((r) => r.identifier === room_identifier);
    if (!room) {
        log.rejected("room not found");
        return somethingWentWrong();
    }

    return (
        <div className="min-h-screen bg-white">
            <PrintFont />
            <ConsentPreview
                booking={booking}
                room={room}
                property={property}
                setupTables={setupTables}
                guestCountryName={printingService.getUserCountry(countries, booking?.guest?.country_id)}
                printingService={printingService}
                privateNote={booking?.extras?.find((k) => k.key === "private_note")}
                bedPreferences={bedPreferences}
            />
            <PrintButton />
        </div>
    );
}

export default withPrintLog(printContext, DocumentPage);
