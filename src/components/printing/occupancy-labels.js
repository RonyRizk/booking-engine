/**
 * The adult / child / infant words `PrintingService.formatGuestAvailability`
 * expects, translated with the request's printing translator.
 *
 * @param {(key: string) => string} t
 */
export const occupancyLabels = (t) => ({
    Lcz_Adult: t("Lcz_Adult"),
    Lcz_Adults: t("Lcz_Adults"),
    Lcz_Child: t("Lcz_Child"),
    Lcz_Children: t("Lcz_Children"),
    Lcz_Infant: t("Lcz_Infant"),
    Lcz_Infants: t("Lcz_Infants"),
});
