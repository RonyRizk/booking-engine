import { formatAmount } from "@/lib/utils";
import EmailText from '@/emails/components/EmailText';


export default function TaxAmount({ room, booking, property, locales, currency }) {
    if (!booking?.is_direct) {
        const filtered_data = room.ota_taxes.filter((tx) => tx.amount > 0);
        return filtered_data.map((d, index) => {
            return <EmailText style={styles.taxRow} key={`room_tax_${d.name}_${index}`}>
                <i>
                    {d.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {d.name} <br />{d.currency.symbol}{d.amount}
                </i>
            </EmailText>
        }
        );
    }
    const filtered_data = property?.taxes?.filter((tx) => tx.pct > 0 && tx.is_exlusive);
    return <>
        {filtered_data?.map((d, index) => {
            const amount = (room.total * d.pct) / 100;
            // const amount = (d.is_exlusive
            //     ? room.total * pct
            //     : room.total - room.total / (1 + pct)) / 100;
            const key = `direct_room_tax_${d.name}_${index}`
            if (d.is_exlusive) {
                return <EmailText style={styles.taxRow} key={key}>
                    <i>
                        {locales?.Lcz_Excluding} {`${d.pct}%`} {d.name} <br />{formatAmount(amount, currency)}
                    </i>
                </EmailText>
            }
            return (
                <EmailText style={styles.taxRow} key={key}>
                    <i>{locales?.Lcz_Including} {d.name} {`${d.pct}%`} <br />{formatAmount(amount, currency)}</i>
                </EmailText>


            );
        })}
        {room.inclusive_taxes?.CALCULATED_INCLUSIVE_TAXES?.map((d, index) => <EmailText style={styles.taxRow} key={`direct_room_tax_${d.TAX_NAME}_${index}`}>
            <i>{locales?.Lcz_Including} {d.TAX_NAME} {`${d.TAX_PCT * 100}%`} <br />{formatAmount(d.CALCULATED_VALUE, currency)}</i>
        </EmailText>)}
    </>;
}

const styles = {
    taxRow: { marginBottom: 0, fontSize: "13px" },
}; 
