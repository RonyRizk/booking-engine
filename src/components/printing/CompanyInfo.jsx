import React from 'react'
import InfoDisplay from '../InfoDisplay';
/**
 * Company information object.
 *
 * @typedef {Object} Company
 * @property {string} name - The company's legal name.
 * @property {string} address - Street address of the company.
 * @property {string} city - City where the company is located.
 * @property {string} postal - Postal/ZIP code.
 * @property {string} phone - Company phone number.
 * @property {string} tax_nbr - Tax identification number.
 *
 * @property {Object} country - Country information.
 * @property {number} country.id - Internal country ID.
 * @property {string} country.code - ISO country code.
 * @property {string} country.name - Country name.
 * @property {?Array} country.cities - City list (if provided).
 * @property {?string} country.currency - Currency code.
 * @property {?string} country.flag - Flag URL or identifier.
 * @property {number} country.gmt_offset - GMT offset in hours.
 * @property {?Array} country.market_places - Marketplaces associated with the country.
 * @property {?string} country.phone_prefix - Phone prefix for the country.
 *
 * @property {string} invoice_prefix - Prefix used for invoice numbering.
 * @property {number} invoice_start_nbr - Starting number for invoices.
 * @property {string} credit_note_prefix - Prefix used for credit note numbering.
 * @property {number} credit_note_start_nbr - Starting number for credit notes.
 * @property {string} invoice_footer_notes - Text added to the footer of invoices.
 */

/**
 * Renders information about a company for printing (invoice/receipt/credit note/etc.).
 *
 * @param {Object} props
 * @param {Company} props.company - The company data used for invoice/receipt headers and metadata.
 * @returns {JSX.Element}
 */
export default function CompanyInfo({ company }) {
    const renderLocation = () => {
        const { postal, city, country } = company;
        if (!postal && !city && !country) return null;
        const location = []
        if (postal) {
            location.push(postal)
        }
        if (city) {
            location.push(city)
        }
        if (country) {
            if (postal || city) {
                location.push(`,${country.name}`);
            } else {
                location.push(company.name);
            }
        }
        if (location.length === 0) {
            return null
        }
        return (
            <p className='font-regular'>
                {location.join(" ")}
            </p>
        );
    };

    return (
        <div className='flex flex-col items-end'>
            {company.name && <p className='font-bold'>{company.name}</p>}
            {company.address && <p className='font-regular'>{company.address}</p>}
            {renderLocation()}
            {company.phone &&
                <InfoDisplay label={"Phone:"} value={`${company.country.phone_prefix ?? ""} ${company.phone}`} />
            }
            <InfoDisplay label={"Tax ID:"} value={company.tax_nbr} />
        </div>
    )
}
