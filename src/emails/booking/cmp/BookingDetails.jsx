import EmailText from '@/emails/components/EmailText';
import { Column, Row, Section } from '@react-email/components';
import React from 'react'
import RoomDetails from './RoomDetails';
import { formatAmount } from '@/lib/utils';
import { formatDate } from '@/emails/utils';
import moment from "moment";

export default function BookingDetails({ booking, property, locales, currency, lang }) {
    const renderPickupMessage = () => {
        const { date, details, hour, minute, selected_option } =
            booking.pickup_info;
        const _date = moment(date, "YYYY-MM-DD").format("DDD, DD MMM YYYY");
        const _time = `${hour}:${minute}`;

        return `<b>Pickup:</b> ${selected_option.location.description}. ${_date} ${_time}.<br/>
        ${locales?.Lcz_FlightDetails}: ${details}.<br/>
        ${property?.pickup_service?.pickup_cancelation_prepayment?.description}
        `;
    };
    const isCancelled = booking.status.code === "003";

    const getExtraServiceString = (service) => {
        if (!service.start_date || !service.end_date) {
            return;
        }
        let str = []
        const format = "ddd, DD MMM YYYY"
        if (service.start_date) {
            str.push(formatDate({
                date: service?.start_date,
                locale: lang,
                format,
            }))
        }
        if (service.end_date) {
            if (service.start_date) {
                str.push('-')
            }
            str.push(formatDate({
                date: service.end_date,
                locale: lang,
                format,
            }))
        }
        str.unshift("(")
        str.push(")")
        return str.join(' ')
    }
    return (
        <>
            {!isCancelled && <Row style={styles.totalPriceRow}>
                <Column style={styles.totalPriceColumn} align="start">
                    <EmailText style={styles.totalPriceText}>
                        <b>{locales?.Lcz_Total_price}</b>
                    </EmailText>
                </Column>
                <Column style={styles.totalPriceValueColumn} align="end">
                    <EmailText align="end" style={styles.totalPriceValueText}>
                        <b>{formatAmount(booking.financial.gross_total, currency)}</b>
                    </EmailText>
                </Column>
            </Row>}
            <Section style={styles.section}>
                {booking?.rooms?.map((room) => {
                    return (
                        <RoomDetails
                            property={property}
                            locales={locales}
                            booking={booking}
                            lang={lang}
                            key={`room_${room.identifier}`}
                            room={room}
                            currency={currency}
                        />
                    );
                })}
                {booking.pickup_info && (
                    <Row style={styles.pickupRow}>
                        <Column style={styles.pickupColumn} align="start">
                            <EmailText
                                dangerouslySetInnerHTML={{ __html: renderPickupMessage() }}
                            ></EmailText>
                        </Column>
                        <Column style={styles.pickupValueColumn} align="end">
                            <EmailText align="end">
                                {formatAmount(booking.pickup_info.total, currency)}
                            </EmailText>
                        </Column>
                    </Row>
                )}
                {booking.extra_services?.map((service, idx) => (
                    <Row key={`service_${idx}`}>
                        <Column style={styles.extraServicesColumn}>
                            <EmailText>
                                <b>{service.description}</b>
                                <br />
                                {(service.start_date ||
                                    service.end_date) && <span>{getExtraServiceString(service)}</span>}
                            </EmailText>
                        </Column>
                        <Column style={styles.extraServicesValueColumn} align="end">
                            <EmailText>
                                {formatAmount(
                                    service?.price || 0,
                                    booking?.currency?.symbol
                                )}
                            </EmailText>
                        </Column>
                    </Row>
                ))}
            </Section>
        </>
    )
}
const styles = {
    totalPriceRow: { marginTop: "20px", width: "100%" },
    totalPriceColumn: { width: "70%" },
    totalPriceValueColumn: { width: "30%" },
    totalPriceText: { paddingBlock: "8px", marginBottom: 0 },
    totalPriceValueText: { paddingBlock: "8px", marginBottom: 0 },
    section: {
        marginBottom: "30px",
        marginTop: "10px",
        width: "100%",
    },
    pickupRow: { verticalAlign: "top", width: "100%" },
    pickupColumn: { width: "70%", verticalAlign: "top" },
    pickupValueColumn: { width: "30%", verticalAlign: "top" },
    extraServicesColumn: { verticalAlign: "top", width: "70%" },
    extraServicesValueColumn: { verticalAlign: "top", width: "30%" },
    dateSpan: { paddingInline: "14px" },
};
