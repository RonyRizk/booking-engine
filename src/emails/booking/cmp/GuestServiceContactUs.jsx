import EmailButton from '@/emails/components/EmailButton';
import EmailLink from '@/emails/components/EmailLink';
import EmailText from '@/emails/components/EmailText'
import { Section } from '@react-email/components';
// import parse from 'html-react-parser';

export default function GuestServiceContactUs({ property, locales }) {
    const bookingEmail = property.contacts?.find(
        (c) => c.type === "booking"
    )?.email;
    const phone = `+${property?.country?.phone_prefix?.replace("+", "") + "-" || ""}${property?.phone}`;
    // const processedString = locales?.Lcz_GuestService_ContactUs
    //     ?.replace('{0}', `__EMAIL__`)
    //     ?.replace('{1}', `__PHONE__`)
    //     ?.replace('[PERMALINK]', property.perma_link)
    //     ?.replace('<br>', ' ');

    // const guestServiceContactUsJsx = parse(processedString, {
    //     replace: (domNode) => {
    //         if (domNode.type === 'tag' && domNode.name === 'b') {
    //             const children = domNode.children;
    //             if (children && children.length > 0) {
    //                 const textContent = children[0];
    //                 if (textContent.type === 'text') {
    //                     const text = textContent.data;
    //                     if (text.includes('__EMAIL__')) {
    //                         return <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink>;
    //                     }
    //                     if (text.includes('__PHONE__')) {
    //                         return <span>{phone}</span>;
    //                     }
    //                 }
    //             }
    //         }
    //         if (domNode.type === 'text') {
    //             const text = domNode.data;

    //             if (text.includes('__EMAIL__')) {
    //                 const parts = text.split('__EMAIL__');
    //                 return (
    //                     <>
    //                         {parts[0]}
    //                         <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink>
    //                         {parts[1]}
    //                     </>
    //                 );
    //             }
    //             if (text.includes('__PHONE__')) {
    //                 const parts = text.split('__PHONE__');
    //                 return (
    //                     <>
    //                         {parts[0]}
    //                         {phone}
    //                         {parts[1]}
    //                     </>
    //                 );
    //             }
    //         }
    //         if (domNode.type === 'tag' && domNode.name === 'a') {
    //             const href = domNode.attribs?.href;
    //             const children = domNode.children;
    //             const getTextContent = (nodes) => {
    //                 return nodes.map(node => {
    //                     if (node.type === 'text') {
    //                         return node.data;
    //                     }
    //                     if (node.type === 'tag' && node.children) {
    //                         return getTextContent(node.children);
    //                     }
    //                     return '';
    //                 }).join('');
    //             };

    //             const linkText = getTextContent(children);

    //             return (
    //                 <EmailLink href={href}>
    //                     {linkText}
    //                 </EmailLink>
    //             );
    //         }
    //     },
    // });
    return (
        <Section>
            <EmailText style={styles.contactText}>
                {/* {guestServiceContactUsJsx} */}
                {bookingEmail && <>{locales.Lcz_ContactUserAnytimeByEmail}{" "}
                    <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink>
                </>}
                {" "}
                {phone && <>
                    {locales.Lcz_OrCallOn} {phone}.
                </>}
            </EmailText>
            {locales?.Lcz_ClickHereToManageBooking && <EmailButton href="https://iglooroomsdemohotel.bookingmystay.com/signin">
                {locales.Lcz_ClickHereToManageBooking?.replace(" ?", "")?.replace(".", "")}
            </EmailButton>}
        </Section>
    )
}
const styles = {
    contactText: { width: "100%" },
}
