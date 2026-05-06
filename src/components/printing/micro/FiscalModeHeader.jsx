import { cn } from "@/lib/utils";
import CompanyInfo from "../CompanyInfo";
import PropertyInfo from "../PropertyInfo";
import PrintInfo from "../PrintInfo";
import GuestInformation from "../GuestInformation";
import DocumentTitle from "./DocumentTitle";

export default function FiscalModeHeader({
    booking,
    property,
    locales,
    documentId,
    receiptNumber,
    mode,
    guestCountryName,
    totalPersons,
    printingService,
    className,
    privateNote,
    selectedDocument,
}) {
    return (
        <header className={cn("p-4 sm:px-6 lg:px-8 text-gray-800 text-sm max-w-4xl mx-auto", className)}>
            <DocumentTitle mode={mode} />
            <nav className="flex gap-4 flex-col-reverse sm:flex-row sm:justify-between sm:w-full">
                <div className="space-y-4">
                    <PrintInfo
                        selectedDocument={selectedDocument}
                        receiptNumber={receiptNumber}
                        documentId={documentId}
                        mode={mode}
                        booking={booking}
                    />
                    <GuestInformation
                        booking={booking}
                        selectedDocument={selectedDocument}
                        guestCountryName={guestCountryName}
                        totalPersons={totalPersons}
                        locales={locales}
                        printingService={printingService}
                        mode={mode}
                        privateNote={privateNote}
                    />
                </div>
                <div className="space-y-2.5">
                    <CompanyInfo company={property.company} />
                    <PropertyInfo property={property} />
                </div>
            </nav>
        </header>
    );
}
