import React from "react";
import { redirect } from "next/navigation";
import { calculateDaysBetweenDates } from "../../../../lib/utils";
import { PrintingService } from "../../../../lib/services/printing.service";
import "./printing.css";
import PrintFont from "@/components/printing/PrintFont";
import PrintingHeader from "../../../../components/printing/PrintingHeader";
import GuestInformation from "../../../../components/printing/GuestInformation";
import AccommodationHeader from "../../../../components/printing/AccommodationHeader";
import RoomDetails from "../../../../components/printing/RoomDetails";
import PickupInformation from "../../../../components/printing/PickupInformation";
import PaymentInformation from "../../../../components/printing/PaymentInformation";
// import ChannelServices from "../../../../components/printing/ChannelServices";
import ExtraServices from "../../../../components/printing/ExtraServices";
import { withPrintLog } from "@/lib/printing-log";
import { FiscalDocumentFooter } from "./shared/fiscal-document-footer";
import { loadPrintingLabels } from "@/lib/printing-i18n";
import { resolveLang } from "@/lib/labels";

const printContext = ({ params, searchParams }) => ({
  route: "booking",
  mode: searchParams.mode ?? "printing",
  property: params.id,
  booking: searchParams.id,
  document: searchParams.documentId ?? searchParams.rnb ?? searchParams.pid,
  lang: searchParams.lang,
});

/**
 * Printing page for booking confirmation/invoice documents.
 *
 * @param {Object} props
 * @param {Object} props.searchParams - URL search parameters controlling rendering behavior.
 * @param {("printing"|"invoice"|"receipt"|"proforma"|"creditnote")} [props.searchParams.mode="printing"]
 *   The output mode for the document:
 *   - `printing`: Standard print layout  
 *   - `invoice`: Invoice document  
 *   - `receipt`: Payment receipt  
 *   - `proforma`: Pro forma invoice  
 *   - `creditnote`: Credit note
 * @param {string} props.searchParams.id - Booking number associated with the document.
 * @param {string} [props.searchParams.lang="en"] - Language code for localization.
 * @param {string} [props.searchParams.token] - Access token for secure printing API requests.
 * @param {string} [props.searchParams.documentId] - Document number for invoice or credit note or other documents.
 *
 * @param {Object} props.params - Route parameters from Next.js dynamic segments.
 * @param {string} props.params.id - Property identifier from the URL.
 */
async function Printing({ searchParams, params }, log) {
  const { mode = "printing", id, lang: rawLang, token, pid, rnb, documentId } = searchParams;
  const lang = resolveLang(rawLang);
  const printingService = new PrintingService(token);
  let data = {}
  let i18n
  try {
    [data, i18n] = await Promise.all([
      printingService.getPrintingData({
        bookingNumber: id,
        aName: params.id,
        language: lang,
        mode,
        is_calculate_totals: mode === 'printing',
      }),
      loadPrintingLabels(lang, token),
    ]);
  } catch (error) {
    log.failed(error)
    return redirect("https://x.igloorooms.com/manage/acbookinglist.aspx")
  }
  const { booking, property, setupTables, countries, invoiceInfo, beddingPreference } = data

  if (!booking) {
    log.rejected("booking not found");
    return null;
  }
  if (mode === "receipt") {
    await printingService.checkReceipt({ booking, receiptNumber: rnb, paymentId: pid });
  }

  const totalPersons = printingService.calculateTotalPersons(booking);
  const currency = booking?.currency.symbol;
  const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
  const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id);
  const privateNote = booking.extras?.find((k) => k.key === "private_note");
  const selectedDocument = invoiceInfo?.invoices?.find(i => i.nbr === documentId);
  const selectedDocumentsItemsKeys = new Set((selectedDocument ? selectedDocument.items.map(i => i.key) : []));
  const isInvoicableMode = ["invoice", "creditnote"].includes(mode.toLocaleLowerCase().trim())

  const roomsInDocument = booking?.rooms?.filter(room =>
    selectedDocumentsItemsKeys.has(room.system_id)
  );

  const hasRoomsInDocument = roomsInDocument && roomsInDocument.length > 0;

  return (
    <>
      <PrintFont />
      <PrintingHeader
        selectedDocument={selectedDocument}
        documentId={documentId}
        receiptNumber={rnb}
        pid={pid}
        guestCountryName={guestCountryName}
        totalPersons={totalPersons}
        printingService={printingService}
        privateNote={privateNote}
        booking={booking} property={property} mode={mode} />
      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir={i18n.dir}>
        <section>
          {mode === "printing" && <GuestInformation
            booking={booking}
            guestCountryName={guestCountryName}
            totalPersons={totalPersons}
            printingService={printingService}
            mode={mode}
            privateNote={privateNote}
          />}

          {mode === "creditnote" && <p className="text-lg font-semibold text-gray-900 uppercase">{i18n.t("Lcz_CreditedItems")}</p>}
          {mode !== "receipt" && <section className="pt-4">
            {!hasRoomsInDocument && isInvoicableMode ? null : <AccommodationHeader
              mode={mode}
              booking={booking}
              totalNights={totalNights}
              property={property}
              printingService={printingService}
            />}

            <div>

              {booking?.rooms?.map((room, idx) => {
                if (!selectedDocumentsItemsKeys?.has(room.system_id) && isInvoicableMode) {
                  return null
                }
                return (
                  <RoomDetails
                    key={`room_${room.id}`}
                    room={room}
                    booking={booking}
                    property={property}
                    currency={currency}
                    mode={mode}
                    selectedDocument={selectedDocument}
                    printingService={printingService}
                    bed_preferences={beddingPreference}
                    idx={idx}
                  />
                )
              })}
            </div>
          </section>}
        </section>


        {/* {!booking?.is_direct && <ChannelServices booking={booking} />} */}
        {mode !== "receipt" && <>
          {
            isInvoicableMode && !selectedDocumentsItemsKeys.has(booking?.pickup_info?.['system_id']) ? null :
              <PickupInformation mode={mode} selectedDocument={selectedDocument} booking={booking} />}
          <ExtraServices isInvoicableMode={isInvoicableMode} mode={mode} selectedDocumentsItemsKeys={selectedDocumentsItemsKeys} booking={booking} />
        </>}
        <PaymentInformation printingService={printingService} selectedDocument={selectedDocument} selectedDocumentsItemsKeys={selectedDocumentsItemsKeys} paymentId={pid} setupTables={setupTables} mode={mode} booking={booking} />
        {mode !== "printing" && <div className="pb-4"><FiscalDocumentFooter property={property} /></div>}
      </main>
    </>
  );
}

export default withPrintLog(printContext, Printing);
