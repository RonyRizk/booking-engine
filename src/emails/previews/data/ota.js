import { common } from "./common";
import { getBookingDetails } from "@/emails/utils";

const _data = {
    ...common,
    operation: "CANCEL",
    operation: "MODIFY",
    // operation: "COMMIT",
    url: "ota url",
    bookingDetailsUrl: "",
    channelName: "Booking.com",
    booking: {
        "agent": null,
        "allowed_actions": [
            {
                "code": "001",
                "description": "Pending"
            },
            {
                "code": "CANC_RA",
                "description": "Cancel"
            },
            {
                "code": "NOSHOW_RA",
                "description": "No show"
            }
        ],
        "arrival": {
            "code": "001",
            "description": "Not sure yet"
        },
        "booked_on": {
            "date": "2025-06-22",
            "hour": 23,
            "minute": 51
        },
        "booking_nbr": "63313735331",
        "channel_booking_nbr": "BDC-5706402033",
        "cost": null,
        "currency": {
            "code": "EUR",
            "id": 3,
            "symbol": "€"
        },
        "extra_services": null,
        "extras": null,
        "financial": {
            "due_amount": 85.050,
            "due_dates": null,
            "gross_cost": 0,
            "gross_total": 85.050,
            "invoice_nbr": "633137",
            "payments": null,
            "total_amount": 85.050
        },
        "format": {
            "from_date": "Fri, 25 Jul 2025",
            "to_date": "Sat, 26 Jul 2025"
        },
        "from_date": "2025-07-25",
        "guest": {
            "address": "",
            "alternative_email": null,
            "cci": null,
            "city": ".",
            "country": {
                "cities": null,
                "code": "CY",
                "currency": null,
                "flag": null,
                "gmt_offset": 0,
                "id": 6,
                "name": "Cyprus",
                "phone_prefix": null
            },
            "country_id": 6,
            "country_phone_prefix": "+357",
            "dob": "1900-01-01",
            "email": "gmouzo.242759@guest.booking.com",
            "first_name": "Giorgos Mouzourou",
            "id": 723995,
            "id_info": null,
            "is_main": false,
            "last_name": "",
            "mobile": "+357 96 753715",
            "mobile_without_prefix": " 96 753715",
            "nbr_confirmed_bookings": 1,
            "notes": "",
            "password": null,
            "subscribe_to_news_letter": false
        },
        "is_direct": false,
        "is_editable": false,
        "is_in_loyalty_mode": false,
        "is_pms_enabled": false,
        "occupancy": {
            "adult_nbr": 2,
            "children_nbr": 0,
            "infant_nbr": 0
        },
        "origin": {
            "Icon": "https:\/\/x.igloorooms.com\/assets\/images\/png\/Booking.png",
            "Label": "iCHANNEL | Booking.com"
        },
        "ota_commission": "12.76",
        "ota_guarante": {
            "card_number": "223697******0114",
            "card_type": "mastercard",
            "cardholder_name": "Bookingcom Agent",
            "cvv": "***",
            "expiration_date": "07\/2026",
            "is_virtual": true,
            "meta": {
                "virtual_card_currency_code": "EUR",
                "virtual_card_current_balance": "0",
                "virtual_card_decimal_places": "2",
                "virtual_card_effective_date": "2025-07-22",
                "virtual_card_expiration_date": "2026-07-01"
            },
            "token": ""
        },
        "ota_guarantee_plain": null,
        "ota_notes": [
            {
                "statement": "Έχετε λάβει μια εικονική πιστωτική κάρτα για αυτή την κράτηση.Μπορείτε να την χρεώσετε από τις 2025-07-22."
            },
            {
                "statement": "Meal Plan: Πρωινό : κοστίζει EUR 9,50 ανά άτομο ανά βραδιά."
            },
            {
                "statement": "Payment Collect: OTA collect"
            },
            {
                "statement": "OTA Commission: 12.76"
            }
        ],
        "ota_services": null,
        "ota_services_plain": null,
        "payment_collect": "ota",
        "payment_type": "credit_card",
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
            "id": 229,
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
            "name": "Casa Mespilea",
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
        "remark": "Έχετε λάβει μια εικονική πιστωτική κάρτα για αυτή την κράτηση.Μπορείτε να την χρεώσετε από τις 2025-07-22.\u000aMeal Plan: Πρωινό : κοστίζει EUR 9,50 ανά άτομο ανά βραδιά.\u000aPayment Collect: OTA collect\u000aOTA Commission: 12.76",
        "rooms": [
            {
                "assigned_units_pool": "8ff9361f-8f43-41ce-bb30-93f186f1029f",
                "bed_preference": null,
                "check_in": false,
                "cost": null,
                "days": [
                    {
                        "amount": 85.050,
                        "cost": null,
                        "date": "2025-07-25"
                    }
                ],
                "from_date": "2025-07-25",
                "gross_cost": null,
                "gross_guarantee": null,
                "gross_total": 85.050,
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
                    "first_name": "Giorgos Mouzourou",
                    "id": null,
                    "id_info": null,
                    "is_main": false,
                    "last_name": null,
                    "mobile": null,
                    "mobile_without_prefix": null,
                    "nbr_confirmed_bookings": 0,
                    "notes": null,
                    "password": null,
                    "subscribe_to_news_letter": null
                },
                "identifier": "34af1e60-e9a2-40c4-ad15-7f295b8ce5c0",
                "in_out": {
                    "code": "000",
                    "description": "Not Set"
                },
                "notes": "",
                "occupancy": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": 0
                },
                "ota_meta": {
                    "bed_preferences": null,
                    "meal_plan": "Πρωινό : κοστίζει EUR 9,50 ανά άτομο ανά βραδιά.",
                    "parent_rate_plan_id": null,
                    "policies": "Παιδιά και πολιτική επιπλέον κρεβατιού: Επιτρέπονται παιδιά ανεξαρτήτως ηλικίας. 1 παιδί (μέχρι και 2 ετών) μένει με € 10 ανά παιδί, ανά βράδυ όταν χρησιμοποιεί διαθέσιμες βρεφικές κούνιες.\u0009 Δεν έχετε προσθέσει επιπλέον κρεβάτια. Ο μέγιστος αριθμός βρεφικών κρεβατιών είναι 1. Ο μέγιστος συνολικός αριθμός επισκεπτών είναι 2.  Πολιτική Προκαταβολής: Ο επισκέπτης θα πρέπει να προπληρώσει τη συνολική τιμή της κράτησης οποιαδήποτε στιγμή.  Πολιτική ακύρωσης: Ο επισκέπτης μπορεί να ακυρώσει χωρίς χρέωση μέχρι 3 μέρες πριν την άφιξη. Ο επισκέπτης θα χρεωθεί τη συνολική τιμή της κράτησης εάν ακυρώσει εντός 3 ημερών πριν την άφιξη. Εάν ο επισκέπτης δεν εμφανιστεί, θα χρεωθεί τη συνολική τιμή της κράτησης.",
                    "smoking_preferences": "Non-Smoking"
                },
                "ota_meta_plain": null,
                "ota_taxes": [
                    {
                        "amount": 7.020,
                        "currency": {
                            "code": "EUR",
                            "id": 3,
                            "symbol": "€"
                        },
                        "is_exlusive": false,
                        "name": "ΦΠΑ (9%)"
                    }
                ],
                "ota_unique_id": null,
                "prepayment_amount": null,
                "prepayment_amount_gross": null,
                "rateplan": {
                    "agents": null,
                    "assignable_units": null,
                    "cancelation": "No penalty if cancelled before Tuesday, 22 Jul 2025, 14:00. €85.05 if cancelled later or in case of no show.",
                    "custom_text": null,
                    "extra_bed_for_code": null,
                    "extra_bed_max": null,
                    "extra_bed_rate_per_night": null,
                    "extra_bed_rate_per_night_additional_child": null,
                    "extra_bed_rate_per_night_first_child": null,
                    "guarantee": "No deposit required.",
                    "id": 1511,
                    "is_active": null,
                    "is_available_to_book": false,
                    "is_booking_engine_enabled": null,
                    "is_channel_enabled": null,
                    "is_closed": null,
                    "is_extra_bed_free_for_children": false,
                    "is_non_refundable": false,
                    "is_targeting_travel_agency": null,
                    "meal_plan": {
                        "code": "005",
                        "name": null
                    },
                    "name": "Self-catering",
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
                        "rate_plan_id": 1511,
                        "smoking_code": null,
                        "total_before_discount": null
                    },
                    "sell_mode": null,
                    "short_name": "Self-catering",
                    "sleeps": null,
                    "variations": null
                },
                "roomtype": {
                    "amenities": null,
                    "availabilities": null,
                    "bedding_setup": null,
                    "description": null,
                    "exposed_inventory": null,
                    "id": 1138,
                    "images": null,
                    "inventory": null,
                    "is_active": null,
                    "is_available_to_book": null,
                    "is_bed_configuration_enabled": null,
                    "main_image": null,
                    "name": "01. Quince Deluxe Studio",
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
                        "first_name": "Giorgos Mouzourou",
                        "id": 71630,
                        "id_info": {
                            "number": "",
                            "type": {
                                "code": "001",
                                "description": "Passport"
                            }
                        },
                        "is_main": true,
                        "last_name": null,
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
                "to_date": "2025-07-26",
                "total": 85.050,
                "unit": {
                    "calendar_cell": null,
                    "hk_status": null,
                    "housekeeper": null,
                    "id": 111,
                    "is_active": null,
                    "name": "01. Quince Deluxe Studio"
                }
            }
        ],
        "source": {
            "code": "",
            "description": null,
            "id": null,
            "tag": "",
            "type": null
        },
        "status": {
            "code": "002",
            "description": "Confirmed"
        },
        "system_id": 14892291,
        "to_date": "2025-07-26",
        "total": 85.050
    }
}


export const otaData = {
    ...getBookingDetails({ booking: _data.booking, property: _data.property }),
    ..._data
}
