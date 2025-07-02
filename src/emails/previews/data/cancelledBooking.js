import { calculateDaysBetweenDates } from "@/lib/utils";
import { common } from "./common";

let _data = {
    ...common,
    booking: {
        "agent": null,
        "allowed_actions": [
            {
                "code": "001",
                "description": "Pending"
            },
            {
                "code": "002",
                "description": "Confirm"
            }
        ],
        "arrival": {
            "code": "001",
            "description": "Not sure yet"
        },
        "booked_on": {
            "date": "2025-06-19",
            "hour": 18,
            "minute": 53
        },
        "booking_nbr": "31717336008",
        "channel_booking_nbr": null,
        "cost": null,
        "currency": {
            "code": "USD",
            "id": 4,
            "symbol": "US$"
        },
        "extra_services": null,
        "extras": [
            {
                "key": "is_backend",
                "value": "true"
            }
        ],
        "financial": {
            "due_amount": 310.800,
            "due_dates": null,
            "gross_cost": 0.0,
            "gross_total": 310.800,
            "invoice_nbr": "317173",
            "payments": null,
            "total_amount": 280.000
        },
        "format": {
            "from_date": "Sun, 29 Jun 2025",
            "to_date": "Tue, 01 Jul 2025"
        },
        "from_date": "2025-06-29",
        "guest": {
            "address": "",
            "alternative_email": null,
            "cci": null,
            "city": "City of lights",
            "country": {
                "cities": null,
                "code": "AU",
                "currency": null,
                "flag": null,
                "gmt_offset": 0,
                "id": 477,
                "name": "Australia",
                "phone_prefix": null
            },
            "country_id": 477,
            "country_phone_prefix": "+61",
            "dob": null,
            "email": "ronaldsayegh@outlook.com",
            "first_name": "Ron",
            "id": 45,
            "id_info": null,
            "is_main": false,
            "last_name": "Sayegh",
            "mobile": "090390391",
            "mobile_without_prefix": "090390391",
            "nbr_confirmed_bookings": 1,
            "notes": "",
            "password": null,
            "subscribe_to_news_letter": false
        },
        "is_direct": true,
        "is_editable": true,
        "is_in_loyalty_mode": false,
        "is_pms_enabled": true,
        "occupancy": {
            "adult_nbr": 2,
            "children_nbr": 0,
            "infant_nbr": 0
        },
        "origin": {
            "Icon": "https:\/\/x.igloorooms.com\/assets\/images\/png\/direct.png",
            "Label": "Direct | manual"
        },
        "ota_commission": null,
        "ota_guarante": null,
        "ota_guarantee_plain": null,
        "ota_notes": null,
        "ota_services": null,
        "ota_services_plain": null,
        "payment_collect": null,
        "payment_type": null,
        "pickup_info": null,
        "promo_key": "",
        "property": {
            "address": null,
            "adult_child_constraints": null,
            "affiliates": null,
            "agents": null,
            "allowed_booking_sources": null,
            "allowed_cards": null,
            "allowed_payment_methods": null,
            "amenities": null,
            "aname": null,
            "area": null,
            "baby_cot_offering": null,
            "be_listing_mode": null,
            "calendar_legends": null,
            "city": null,
            "contacts": null,
            "country": null,
            "currency": null,
            "description": null,
            "id": 42,
            "images": null,
            "internet_offering": null,
            "is_automatic_check_in_out": null,
            "is_be_enabled": null,
            "is_frontdesk_enabled": null,
            "is_multi_property": null,
            "is_pms_enabled": null,
            "is_vacation_rental": null,
            "location": null,
            "max_nights": 0,
            "name": "igloorooms Demo Hotel",
            "parking_offering": null,
            "payment_methods": null,
            "perma_link": null,
            "pets_acceptance": null,
            "phone": null,
            "pickup_service": null,
            "postal": null,
            "privacy_policy": null,
            "promotions": null,
            "roomtypes": null,
            "social_media": null,
            "sources": null,
            "space_theme": null,
            "tags": null,
            "tax_nbr": null,
            "tax_statement": null,
            "taxation_strategy": null,
            "taxes": null,
            "time_constraints": null
        },
        "remark": "",
        "rooms": [
            {
                "assigned_units_pool": null,
                "bed_preference": null,
                "check_in": false,
                "cost": null,
                "days": [
                    {
                        "amount": 140.000,
                        "cost": null,
                        "date": "2025-06-29"
                    },
                    {
                        "amount": 140.000,
                        "cost": null,
                        "date": "2025-06-30"
                    }
                ],
                "from_date": "2025-06-29",
                "gross_cost": null,
                "gross_guarantee": null,
                "gross_total": 310.800,
                "guarantee": null,
                "guest": {
                    "address": null,
                    "alternative_email": null,
                    "cci": null,
                    "city": null,
                    "country": null,
                    "country_id": null,
                    "country_phone_prefix": null,
                    "dob": null,
                    "email": null,
                    "first_name": null,
                    "id": null,
                    "id_info": null,
                    "is_main": false,
                    "last_name": "Sayegh",
                    "mobile": null,
                    "mobile_without_prefix": null,
                    "nbr_confirmed_bookings": 0,
                    "notes": null,
                    "password": null,
                    "subscribe_to_news_letter": null
                },
                "identifier": "d427d306-6ad8-4b80-8663-526199ea96bf",
                "in_out": {
                    "code": "000",
                    "description": "Not Set"
                },
                "notes": "",
                "occupancy": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": null
                },
                "ota_meta": null,
                "ota_meta_plain": null,
                "ota_taxes": null,
                "ota_unique_id": null,
                "prepayment_amount": null,
                "prepayment_amount_gross": null,
                "rateplan": {
                    "agents": null,
                    "assignable_units": null,
                    "cancelation": "US$310.80 if cancelled later or in case of no show.",
                    "custom_text": null,
                    "extra_bed_for_code": null,
                    "extra_bed_max": null,
                    "extra_bed_rate_per_night": null,
                    "extra_bed_rate_per_night_additional_child": null,
                    "extra_bed_rate_per_night_first_child": null,
                    "guarantee": "First night from your booking will be charged.",
                    "id": 3755,
                    "is_active": null,
                    "is_available_to_book": false,
                    "is_booking_engine_enabled": null,
                    "is_channel_enabled": null,
                    "is_closed": null,
                    "is_extra_bed_free_for_children": false,
                    "is_non_refundable": false,
                    "is_targeting_travel_agency": null,
                    "meal_plan": {
                        "code": "003",
                        "name": null
                    },
                    "name": "Breakfast & dinner\/Half-board",
                    "not_available_reason": null,
                    "pre_payment_amount": null,
                    "pre_payment_amount_gross": null,
                    "rate_restrictions": null,
                    "selected_variation": {
                        "IS_MLS_VIOLATED": false,
                        "MLS_ALERT": null,
                        "MLS_ALERT_VALUE": null,
                        "adult_child_offering": "2 adults",
                        "adult_nbr": 2,
                        "amount": null,
                        "amount_gross": null,
                        "amount_per_night": null,
                        "amount_per_night_gross": null,
                        "applicable_policies": null,
                        "bed_preference_code": null,
                        "child_nbr": 0,
                        "discount_pct": null,
                        "discounted_amount": null,
                        "discounted_gross_amount": null,
                        "extra_bed_free_nbr": null,
                        "extra_bed_nbr": null,
                        "extra_bed_rate_per_night": null,
                        "food_nbr_upsell": 0,
                        "infant_nbr": null,
                        "is_lmd": null,
                        "nights": null,
                        "nights_nbr": null,
                        "prepayment_amount": null,
                        "prepayment_amount_gross": null,
                        "rate_plan_id": 3755,
                        "smoking_code": null,
                        "total_before_discount": null
                    },
                    "sell_mode": null,
                    "short_name": "Half board",
                    "sleeps": null,
                    "variations": null
                },
                "roomtype": {
                    "amenities": null,
                    "availabilities": null,
                    "bedding_setup": null,
                    "description": null,
                    "exposed_inventory": null,
                    "id": 111,
                    "images": null,
                    "inventory": null,
                    "is_active": null,
                    "is_available_to_book": null,
                    "is_bed_configuration_enabled": null,
                    "main_image": null,
                    "name": "Premium Suites",
                    "not_available_reason": null,
                    "occupancy_default": null,
                    "occupancy_max": null,
                    "physicalrooms": null,
                    "rate": null,
                    "rateplans": null,
                    "size": null,
                    "smoking_option": null
                },
                "sharing_persons": [
                    {
                        "address": null,
                        "alternative_email": null,
                        "cci": null,
                        "city": null,
                        "country": {
                            "cities": null,
                            "code": null,
                            "currency": null,
                            "flag": null,
                            "gmt_offset": 0,
                            "id": null,
                            "name": null,
                            "phone_prefix": null
                        },
                        "country_id": null,
                        "country_phone_prefix": null,
                        "dob": "1900-01-01",
                        "email": null,
                        "first_name": null,
                        "id": 70691,
                        "id_info": {
                            "number": "",
                            "type": {
                                "code": "001",
                                "description": "Passport"
                            }
                        },
                        "is_main": true,
                        "last_name": "Sayegh",
                        "mobile": null,
                        "mobile_without_prefix": null,
                        "nbr_confirmed_bookings": 0,
                        "notes": null,
                        "password": null,
                        "subscribe_to_news_letter": null
                    }
                ],
                "smoking_option": null,
                "taxes": null,
                "to_date": "2025-07-01",
                "total": 280.000,
                "unit": null
            }
        ],
        "source": {
            "code": "003",
            "description": "Phone\/Email",
            "id": null,
            "tag": "",
            "type": null
        },
        "status": {
            "code": "003",
            "description": "Cancelled"
        },
        "system_id": 14891274,
        "to_date": "2025-07-01",
        "total": 280.000
    }
}



export const cancelledBookingData = (() => {
    const { booking } = _data
    const totalPersons = booking?.occupancy.adult_nbr + booking?.occupancy.children_nbr;
    const currency = booking?.currency.symbol;
    const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
    const guestCountryName = "Lebanon";
    const privateNote = booking.extras?.find((k) => k.key === "private_note");
    return {
        totalPersons,
        currency,
        totalNights,
        guestCountryName,
        privateNote,
        penaltyStatement: "If you cancel now, the penalty will be 155US$",
        ..._data
    }
})()
