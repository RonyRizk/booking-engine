import { calculateDaysBetweenDates } from "@/lib/utils";
import { common } from "./common";
import { getBookingDetails } from "@/emails/utils";

let _data = {
    ...common,
    // booking: {
    //     "agent": null,
    //     "allowed_actions": [
    //         {
    //             "code": "001",
    //             "description": "Pending"
    //         },
    //         {
    //             "code": "CANC_RA",
    //             "description": "Cancel"
    //         },
    //         {
    //             "code": "NOSHOW_RA",
    //             "description": "No show"
    //         }
    //     ],
    //     "arrival": {
    //         "code": "001",
    //         "description": "Not sure yet"
    //     },
    //     "booked_on": {
    //         "date": "2025-06-17",
    //         "hour": 12,
    //         "minute": 43
    //     },
    //     "booking_nbr": "62714363640",
    //     "channel_booking_nbr": null,
    //     "cost": null,
    //     "currency": {
    //         "code": "USD",
    //         "id": 4,
    //         "symbol": "US$"
    //     },
    //     "extra_services": null,
    //     "extras": [
    //         {
    //             "key": "payment_code",
    //             "value": "001"
    //         }
    //     ],
    //     "financial": {
    //         "due_amount": 410.81110,
    //         "due_dates": null,
    //         "gross_cost": 0.0,
    //         "gross_total": 410.81110,
    //         "invoice_nbr": "204842",
    //         "payments": null,
    //         "total_amount": 280.010
    //     },
    //     "format": {
    //         "from_date": "Tue, 17 Jun 2025",
    //         "to_date": "Wed, 18 Jun 2025"
    //     },
    //     "from_date": "2025-06-17",
    //     "guest": {
    //         "address": "",
    //         "alternative_email": null,
    //         "cci": {
    //             "cvc": "",
    //             "expiry_month": 12,
    //             "expiry_year": 45,
    //             "holder_name": "test",
    //             "nbr": "4111111111111111"
    //         },
    //         "city": null,
    //         "country": {
    //             "cities": null,
    //             "code": "BZ",
    //             "currency": null,
    //             "flag": null,
    //             "gmt_offset": 0,
    //             "id": 486,
    //             "name": "Belize",
    //             "phone_prefix": null
    //         },
    //         "country_id": 486,
    //         "country_phone_prefix": "+501",
    //         "dob": null,
    //         "email": "estest.test@gmail.com",
    //         "first_name": "test",
    //         "id": 528363,
    //         "id_info": null,
    //         "is_main": false,
    //         "last_name": "test5",
    //         "mobile": "12345678",
    //         "mobile_without_prefix": "12345678",
    //         "nbr_confirmed_bookings": 27,
    //         "notes": "",
    //         "password": null,
    //         "subscribe_to_news_letter": true
    //     },
    //     "is_direct": true,
    //     "is_editable": true,
    //     "is_in_loyalty_mode": null,
    //     "is_pms_enabled": true,
    //     "occupancy": {
    //         "adult_nbr": 4,
    //         "children_nbr": 0,
    //         "infant_nbr": 0
    //     },
    //     "origin": {
    //         "Icon": "https:\/\/x.igloorooms.com\/assets\/images\/png\/direct.png",
    //         "Label": "Direct | website"
    //     },
    //     "ota_commission": null,
    //     "ota_guarante": null,
    //     "ota_guarantee_plain": null,
    //     "ota_notes": null,
    //     "ota_services": null,
    //     "ota_services_plain": null,
    //     "payment_collect": null,
    //     "payment_type": null,
    //     "pickup_info": {
    //         "currency": {
    //             "code": "USD",
    //             "id": 4,
    //             "symbol": "US$"
    //         },
    //         "date": "2025-06-17",
    //         "details": "flight details",
    //         "hour": 12,
    //         "minute": 23,
    //         "nbr_of_units": 1,
    //         "selected_option": {
    //             "amount": 50.000,
    //             "currency": {
    //                 "code": "USD",
    //                 "id": 4,
    //                 "symbol": "US$"
    //             },
    //             "id": 19,
    //             "location": {
    //                 "description": "Beirut International Airport",
    //                 "id": 1
    //             },
    //             "pricing_model": {
    //                 "code": "002",
    //                 "description": "Person"
    //             },
    //             "vehicle": {
    //                 "capacity": 4,
    //                 "code": "002",
    //                 "description": "Sedan car (2 large & 3 small suitcases)"
    //             }
    //         },
    //         "total": 100.000
    //     },
    //     "promo_key": "",
    //     "property": {
    //         "address": null,
    //         "adult_child_constraints": null,
    //         "affiliates": null,
    //         "agents": null,
    //         "allowed_booking_sources": null,
    //         "allowed_cards": null,
    //         "allowed_payment_methods": null,
    //         "amenities": null,
    //         "aname": null,
    //         "area": null,
    //         "baby_cot_offering": null,
    //         "be_listing_mode": null,
    //         "calendar_legends": null,
    //         "city": null,
    //         "contacts": null,
    //         "country": null,
    //         "currency": null,
    //         "description": null,
    //         "id": 42,
    //         "images": null,
    //         "internet_offering": null,
    //         "is_automatic_check_in_out": null,
    //         "is_be_enabled": null,
    //         "is_frontdesk_enabled": null,
    //         "is_multi_property": null,
    //         "is_pms_enabled": null,
    //         "is_vacation_rental": null,
    //         "location": null,
    //         "max_nights": 0,
    //         "name": "igloorooms Demo Hotel",
    //         "parking_offering": null,
    //         "payment_methods": null,
    //         "perma_link": null,
    //         "pets_acceptance": null,
    //         "phone": null,
    //         "pickup_service": null,
    //         "postal": null,
    //         "privacy_policy": null,
    //         "promotions": null,
    //         "roomtypes": null,
    //         "social_media": null,
    //         "sources": null,
    //         "space_theme": null,
    //         "tags": null,
    //         "tax_nbr": null,
    //         "tax_statement": null,
    //         "taxation_strategy": null,
    //         "taxes": null,
    //         "time_constraints": null
    //     },
    //     "remark": "",
    //     "rooms": [
    //         {
    //             "assigned_units_pool": null,
    //             "bed_preference": null,
    //             "check_in": false,
    //             "cost": null,
    //             "days": [
    //                 {
    //                     "amount": 140.005,
    //                     "cost": null,
    //                     "date": "2025-06-17"
    //                 }
    //             ],
    //             "from_date": "2025-06-17",
    //             "gross_cost": null,
    //             "gross_guarantee": null,
    //             "gross_total": 155.40555,
    //             "guarantee": null,
    //             "guest": {
    //                 "address": null,
    //                 "alternative_email": null,
    //                 "cci": null,
    //                 "city": null,
    //                 "country": null,
    //                 "country_id": null,
    //                 "country_phone_prefix": null,
    //                 "dob": null,
    //                 "email": null,
    //                 "first_name": "test",
    //                 "id": null,
    //                 "id_info": null,
    //                 "is_main": false,
    //                 "last_name": "test5",
    //                 "mobile": null,
    //                 "mobile_without_prefix": null,
    //                 "nbr_confirmed_bookings": 0,
    //                 "notes": null,
    //                 "password": null,
    //                 "subscribe_to_news_letter": null
    //             },
    //             "identifier": "28414230-b920-454c-b34a-f8eeb66685c5",
    //             "in_out": {
    //                 "code": "000",
    //                 "description": "Not Set"
    //             },
    //             "notes": "",
    //             "occupancy": {
    //                 "adult_nbr": 2,
    //                 "children_nbr": 0,
    //                 "infant_nbr": 0
    //             },
    //             "ota_meta": null,
    //             "ota_meta_plain": null,
    //             "ota_taxes": null,
    //             "ota_unique_id": null,
    //             "prepayment_amount": null,
    //             "prepayment_amount_gross": null,
    //             "rateplan": {
    //                 "agents": null,
    //                 "assignable_units": null,
    //                 "cancelation": "US$155.41 if cancelled later or in case of no show.",
    //                 "custom_text": null,
    //                 "extra_bed_for_code": null,
    //                 "extra_bed_max": null,
    //                 "extra_bed_rate_per_night": null,
    //                 "extra_bed_rate_per_night_additional_child": null,
    //                 "extra_bed_rate_per_night_first_child": null,
    //                 "guarantee": "First night from your booking will be charged.",
    //                 "id": 3755,
    //                 "is_active": null,
    //                 "is_available_to_book": false,
    //                 "is_booking_engine_enabled": null,
    //                 "is_channel_enabled": null,
    //                 "is_closed": null,
    //                 "is_extra_bed_free_for_children": false,
    //                 "is_non_refundable": false,
    //                 "is_targeting_travel_agency": null,
    //                 "meal_plan": {
    //                     "code": "003",
    //                     "name": null
    //                 },
    //                 "name": "Breakfast & dinner\/Half-board",
    //                 "not_available_reason": null,
    //                 "pre_payment_amount": null,
    //                 "pre_payment_amount_gross": null,
    //                 "rate_restrictions": null,
    //                 "selected_variation": {
    //                     "IS_MLS_VIOLATED": false,
    //                     "MLS_ALERT": null,
    //                     "MLS_ALERT_VALUE": null,
    //                     "adult_child_offering": "2 adults",
    //                     "adult_nbr": 2,
    //                     "amount": null,
    //                     "amount_gross": null,
    //                     "amount_per_night": null,
    //                     "amount_per_night_gross": null,
    //                     "applicable_policies": null,
    //                     "bed_preference_code": null,
    //                     "child_nbr": 0,
    //                     "discount_pct": null,
    //                     "discounted_amount": null,
    //                     "discounted_gross_amount": null,
    //                     "extra_bed_free_nbr": null,
    //                     "extra_bed_nbr": null,
    //                     "extra_bed_rate_per_night": null,
    //                     "food_nbr_upsell": 0,
    //                     "infant_nbr": null,
    //                     "is_lmd": null,
    //                     "nights": null,
    //                     "nights_nbr": null,
    //                     "prepayment_amount": null,
    //                     "prepayment_amount_gross": null,
    //                     "rate_plan_id": 3755,
    //                     "smoking_code": null,
    //                     "total_before_discount": null
    //                 },
    //                 "sell_mode": null,
    //                 "short_name": "Half board",
    //                 "sleeps": null,
    //                 "variations": null
    //             },
    //             "roomtype": {
    //                 "amenities": null,
    //                 "availabilities": null,
    //                 "bedding_setup": null,
    //                 "description": null,
    //                 "exposed_inventory": null,
    //                 "id": 111,
    //                 "images": null,
    //                 "inventory": null,
    //                 "is_active": null,
    //                 "is_available_to_book": null,
    //                 "is_bed_configuration_enabled": null,
    //                 "main_image": null,
    //                 "name": "Premium Suites",
    //                 "not_available_reason": null,
    //                 "occupancy_default": null,
    //                 "occupancy_max": null,
    //                 "physicalrooms": null,
    //                 "rate": null,
    //                 "rateplans": null,
    //                 "size": null,
    //                 "smoking_option": null
    //             },
    //             "sharing_persons": [
    //                 {
    //                     "address": null,
    //                     "alternative_email": null,
    //                     "cci": null,
    //                     "city": null,
    //                     "country": {
    //                         "cities": null,
    //                         "code": null,
    //                         "currency": null,
    //                         "flag": null,
    //                         "gmt_offset": 0,
    //                         "id": null,
    //                         "name": null,
    //                         "phone_prefix": null
    //                     },
    //                     "country_id": null,
    //                     "country_phone_prefix": null,
    //                     "dob": "1900-01-01",
    //                     "email": null,
    //                     "first_name": "test",
    //                     "id": 69806,
    //                     "id_info": {
    //                         "number": "",
    //                         "type": {
    //                             "code": "001",
    //                             "description": "Passport"
    //                         }
    //                     },
    //                     "is_main": true,
    //                     "last_name": "test5",
    //                     "mobile": null,
    //                     "mobile_without_prefix": null,
    //                     "nbr_confirmed_bookings": 0,
    //                     "notes": null,
    //                     "password": null,
    //                     "subscribe_to_news_letter": null
    //                 }
    //             ],
    //             "smoking_option": null,
    //             "taxes": null,
    //             "to_date": "2025-06-18",
    //             "total": 140.005,
    //             "unit": null
    //         },
    //         {
    //             "assigned_units_pool": null,
    //             "bed_preference": null,
    //             "check_in": false,
    //             "cost": null,
    //             "days": [
    //                 {
    //                     "amount": 140.005,
    //                     "cost": null,
    //                     "date": "2025-06-17"
    //                 }
    //             ],
    //             "from_date": "2025-06-17",
    //             "gross_cost": null,
    //             "gross_guarantee": null,
    //             "gross_total": 155.40555,
    //             "guarantee": null,
    //             "guest": {
    //                 "address": null,
    //                 "alternative_email": null,
    //                 "cci": null,
    //                 "city": null,
    //                 "country": null,
    //                 "country_id": null,
    //                 "country_phone_prefix": null,
    //                 "dob": null,
    //                 "email": null,
    //                 "first_name": "test12",
    //                 "id": null,
    //                 "id_info": null,
    //                 "is_main": false,
    //                 "last_name": null,
    //                 "mobile": null,
    //                 "mobile_without_prefix": null,
    //                 "nbr_confirmed_bookings": 0,
    //                 "notes": null,
    //                 "password": null,
    //                 "subscribe_to_news_letter": null
    //             },
    //             "identifier": "7d1ecb07-389e-4791-893a-df1427c55298",
    //             "in_out": {
    //                 "code": "000",
    //                 "description": "Not Set"
    //             },
    //             "notes": "",
    //             "occupancy": {
    //                 "adult_nbr": 2,
    //                 "children_nbr": 0,
    //                 "infant_nbr": 0
    //             },
    //             "ota_meta": null,
    //             "ota_meta_plain": null,
    //             "ota_taxes": null,
    //             "ota_unique_id": null,
    //             "prepayment_amount": null,
    //             "prepayment_amount_gross": null,
    //             "rateplan": {
    //                 "agents": null,
    //                 "assignable_units": null,
    //                 "cancelation": "US$155.41 if cancelled later or in case of no show.",
    //                 "custom_text": null,
    //                 "extra_bed_for_code": null,
    //                 "extra_bed_max": null,
    //                 "extra_bed_rate_per_night": null,
    //                 "extra_bed_rate_per_night_additional_child": null,
    //                 "extra_bed_rate_per_night_first_child": null,
    //                 "guarantee": "First night from your booking will be charged.",
    //                 "id": 3755,
    //                 "is_active": null,
    //                 "is_available_to_book": false,
    //                 "is_booking_engine_enabled": null,
    //                 "is_channel_enabled": null,
    //                 "is_closed": null,
    //                 "is_extra_bed_free_for_children": false,
    //                 "is_non_refundable": false,
    //                 "is_targeting_travel_agency": null,
    //                 "meal_plan": {
    //                     "code": "003",
    //                     "name": null
    //                 },
    //                 "name": "Breakfast & dinner\/Half-board",
    //                 "not_available_reason": null,
    //                 "pre_payment_amount": null,
    //                 "pre_payment_amount_gross": null,
    //                 "rate_restrictions": null,
    //                 "selected_variation": {
    //                     "IS_MLS_VIOLATED": false,
    //                     "MLS_ALERT": null,
    //                     "MLS_ALERT_VALUE": null,
    //                     "adult_child_offering": "2 adults",
    //                     "adult_nbr": 2,
    //                     "amount": null,
    //                     "amount_gross": null,
    //                     "amount_per_night": null,
    //                     "amount_per_night_gross": null,
    //                     "applicable_policies": null,
    //                     "bed_preference_code": null,
    //                     "child_nbr": 0,
    //                     "discount_pct": null,
    //                     "discounted_amount": null,
    //                     "discounted_gross_amount": null,
    //                     "extra_bed_free_nbr": null,
    //                     "extra_bed_nbr": null,
    //                     "extra_bed_rate_per_night": null,
    //                     "food_nbr_upsell": 0,
    //                     "infant_nbr": null,
    //                     "is_lmd": null,
    //                     "nights": null,
    //                     "nights_nbr": null,
    //                     "prepayment_amount": null,
    //                     "prepayment_amount_gross": null,
    //                     "rate_plan_id": 3755,
    //                     "smoking_code": null,
    //                     "total_before_discount": null
    //                 },
    //                 "sell_mode": null,
    //                 "short_name": "Half board",
    //                 "sleeps": null,
    //                 "variations": null
    //             },
    //             "roomtype": {
    //                 "amenities": null,
    //                 "availabilities": null,
    //                 "bedding_setup": null,
    //                 "description": null,
    //                 "exposed_inventory": null,
    //                 "id": 111,
    //                 "images": null,
    //                 "inventory": null,
    //                 "is_active": null,
    //                 "is_available_to_book": null,
    //                 "is_bed_configuration_enabled": null,
    //                 "main_image": null,
    //                 "name": "Premium Suites",
    //                 "not_available_reason": null,
    //                 "occupancy_default": null,
    //                 "occupancy_max": null,
    //                 "physicalrooms": null,
    //                 "rate": null,
    //                 "rateplans": null,
    //                 "size": null,
    //                 "smoking_option": null
    //             },
    //             "sharing_persons": [
    //                 {
    //                     "address": null,
    //                     "alternative_email": null,
    //                     "cci": null,
    //                     "city": null,
    //                     "country": {
    //                         "cities": null,
    //                         "code": null,
    //                         "currency": null,
    //                         "flag": null,
    //                         "gmt_offset": 0,
    //                         "id": null,
    //                         "name": null,
    //                         "phone_prefix": null
    //                     },
    //                     "country_id": null,
    //                     "country_phone_prefix": null,
    //                     "dob": "1900-01-01",
    //                     "email": null,
    //                     "first_name": "test12",
    //                     "id": 69807,
    //                     "id_info": {
    //                         "number": "",
    //                         "type": {
    //                             "code": "001",
    //                             "description": "Passport"
    //                         }
    //                     },
    //                     "is_main": true,
    //                     "last_name": null,
    //                     "mobile": null,
    //                     "mobile_without_prefix": null,
    //                     "nbr_confirmed_bookings": 0,
    //                     "notes": null,
    //                     "password": null,
    //                     "subscribe_to_news_letter": null
    //                 }
    //             ],
    //             "smoking_option": null,
    //             "taxes": null,
    //             "to_date": "2025-06-18",
    //             "total": 140.005,
    //             "unit": null
    //         }
    //     ],
    //     "source": {
    //         "code": "",
    //         "description": null,
    //         "id": null,
    //         "tag": "",
    //         "type": null
    //     },
    //     "status": {
    //         "code": "003",
    //         "description": "Confirmed"
    //     },
    //     "system_id": 14890497,
    //     "to_date": "2025-06-18",
    //     "total": 280.010
    // }
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
            "date": "2025-06-18",
            "hour": 19,
            "minute": 5
        },
        "booking_nbr": "18623255432",
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
                "key": "payment_code",
                "value": "005"
            }
        ],
        "financial": {
            "due_amount": 133.19778,
            "due_dates": null,
            "gross_cost": 0,
            "gross_total": 133.19778,
            "invoice_nbr": "186232",
            "payments": null,
            "total_amount": 119.998
        },
        "format": {
            "from_date": "Sun, 13 Jul 2025",
            "to_date": "Tue, 15 Jul 2025"
        },
        "from_date": "2025-07-13",
        "guest": {
            "address": "",
            "alternative_email": null,
            "cci": null,
            "city": null,
            "country": {
                "cities": null,
                "code": "LB",
                "currency": null,
                "flag": null,
                "gmt_offset": 0,
                "id": 2,
                "name": "Lebanon",
                "phone_prefix": null
            },
            "country_id": 2,
            "country_phone_prefix": "+961",
            "dob": null,
            "email": "TEST@TEST.com",
            "first_name": "test",
            "id": 718617,
            "id_info": null,
            "is_main": false,
            "last_name": "TEST",
            "mobile": "1213123123123",
            "mobile_without_prefix": "1213123123123",
            "nbr_confirmed_bookings": 8,
            "notes": "",
            "password": null,
            "subscribe_to_news_letter": true
        },
        "is_direct": true,
        "is_editable": true,
        "is_in_loyalty_mode": null,
        "is_pms_enabled": true,
        "occupancy": {
            "adult_nbr": 2,
            "children_nbr": 0,
            "infant_nbr": 0
        },
        "origin": {
            "Icon": "https:\/\/x.igloorooms.com\/assets\/images\/png\/direct.png",
            "Label": "Direct | website"
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
                        "amount": 59.999,
                        "cost": null,
                        "date": "2025-07-13"
                    },
                    {
                        "amount": 59.999,
                        "cost": null,
                        "date": "2025-07-14"
                    }
                ],
                "from_date": "2025-07-13",
                "gross_cost": null,
                "gross_guarantee": null,
                "gross_total": 133.19778,
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
                    "first_name": "test",
                    "id": null,
                    "id_info": null,
                    "is_main": false,
                    "last_name": "TEST",
                    "mobile": null,
                    "mobile_without_prefix": null,
                    "nbr_confirmed_bookings": 0,
                    "notes": null,
                    "password": null,
                    "subscribe_to_news_letter": null
                },
                "identifier": "cb4f9547-7d96-4892-a04a-84a367df4d0a",
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
                "ota_meta": null,
                "ota_meta_plain": null,
                "ota_taxes": null,
                "ota_unique_id": null,
                "prepayment_amount": null,
                "prepayment_amount_gross": null,
                "rateplan": {
                    "agents": null,
                    "assignable_units": null,
                    "cancelation": "No penalty if cancelled before Saturday, 28 Jun 2025, 14:00. US$66.60 if cancelled between Saturday, 28 Jun 2025, 14:00 and Thursday, 3 Jul 2025, 14:00. US$133.20 if cancelled later or in case of no show.",
                    "custom_text": null,
                    "extra_bed_for_code": null,
                    "extra_bed_max": null,
                    "extra_bed_rate_per_night": null,
                    "extra_bed_rate_per_night_additional_child": null,
                    "extra_bed_rate_per_night_first_child": null,
                    "guarantee": "First night from your booking will be charged.",
                    "id": 123,
                    "is_active": null,
                    "is_available_to_book": false,
                    "is_booking_engine_enabled": null,
                    "is_channel_enabled": null,
                    "is_closed": null,
                    "is_extra_bed_free_for_children": false,
                    "is_non_refundable": false,
                    "is_targeting_travel_agency": null,
                    "meal_plan": {
                        "code": "002",
                        "name": null
                    },
                    "name": "Car Rental included\/Bed-&-breakfast",
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
                        "rate_plan_id": 123,
                        "smoking_code": null,
                        "total_before_discount": null
                    },
                    "sell_mode": null,
                    "short_name": "Bed & breakfast",
                    "sleeps": null,
                    "variations": null
                },
                "roomtype": {
                    "amenities": null,
                    "availabilities": null,
                    "bedding_setup": null,
                    "description": null,
                    "exposed_inventory": null,
                    "id": 110,
                    "images": null,
                    "inventory": null,
                    "is_active": null,
                    "is_available_to_book": null,
                    "is_bed_configuration_enabled": null,
                    "main_image": null,
                    "name": "Standard Rooms",
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
                        "first_name": "test",
                        "id": 70267,
                        "id_info": {
                            "number": "",
                            "type": {
                                "code": "001",
                                "description": "Passport"
                            }
                        },
                        "is_main": true,
                        "last_name": "TEST",
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
                "to_date": "2025-07-15",
                "total": 119.998,
                "unit": null
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
        "system_id": 14890915,
        "to_date": "2025-07-15",
        "total": 119.998
    }
    //Booking with extra service
    // booking: {
    //     "agent": null,
    //     "allowed_actions": [
    //         {
    //             "code": "001",
    //             "description": "Pending"
    //         },
    //         {
    //             "code": "CANC_RA",
    //             "description": "Cancel"
    //         },
    //         {
    //             "code": "NOSHOW_RA",
    //             "description": "No show"
    //         }
    //     ],
    //     "arrival": {
    //         "code": "001",
    //         "description": "Not sure yet"
    //     },
    //     "booked_on": {
    //         "date": "2025-06-19",
    //         "hour": 13,
    //         "minute": 24
    //     },
    //     "booking_nbr": "15404276164",
    //     "channel_booking_nbr": null,
    //     "cost": null,
    //     "currency": {
    //         "code": "USD",
    //         "id": 4,
    //         "symbol": "US$"
    //     },
    //     "extra_services": [
    //         {
    //             "booking_system_id": 14891155,
    //             "cost": 12.000,
    //             "currency_id": 4,
    //             "description": "test in extra service for email",
    //             "end_date": "2025-06-30",
    //             "price": 12.000,
    //             "start_date": "2025-06-28",
    //             "system_id": 111
    //         }
    //     ],
    //     "extras": [
    //         {
    //             "key": "is_backend",
    //             "value": "true"
    //         }
    //     ],
    //     "financial": {
    //         "due_amount": 578.200,
    //         "due_dates": null,
    //         "gross_cost": 0.0,
    //         "gross_total": 566.200,
    //         "invoice_nbr": "154042",
    //         "payments": null,
    //         "total_amount": 420.000
    //     },
    //     "format": {
    //         "from_date": "Sat, 28 Jun 2025",
    //         "to_date": "Tue, 01 Jul 2025"
    //     },
    //     "from_date": "2025-06-28",
    //     "guest": {
    //         "address": "",
    //         "alternative_email": null,
    //         "cci": null,
    //         "city": "City of lights",
    //         "country": {
    //             "cities": null,
    //             "code": "AU",
    //             "currency": null,
    //             "flag": null,
    //             "gmt_offset": 0,
    //             "id": 477,
    //             "name": "Australia",
    //             "phone_prefix": null
    //         },
    //         "country_id": 477,
    //         "country_phone_prefix": "+61",
    //         "dob": null,
    //         "email": "ronaldsayegh@outlook.com",
    //         "first_name": "Ron",
    //         "id": 45,
    //         "id_info": null,
    //         "is_main": false,
    //         "last_name": "Sayegh",
    //         "mobile": "090390391",
    //         "mobile_without_prefix": "090390391",
    //         "nbr_confirmed_bookings": 1,
    //         "notes": "",
    //         "password": null,
    //         "subscribe_to_news_letter": false
    //     },
    //     "is_direct": true,
    //     "is_editable": true,
    //     "is_in_loyalty_mode": false,
    //     "is_pms_enabled": true,
    //     "occupancy": {
    //         "adult_nbr": 2,
    //         "children_nbr": 0,
    //         "infant_nbr": 0
    //     },
    //     "origin": {
    //         "Icon": "https:\/\/x.igloorooms.com\/assets\/images\/png\/direct.png",
    //         "Label": "Direct | manual"
    //     },
    //     "ota_commission": null,
    //     "ota_guarante": null,
    //     "ota_guarantee_plain": null,
    //     "ota_notes": null,
    //     "ota_services": null,
    //     "ota_services_plain": null,
    //     "payment_collect": null,
    //     "payment_type": null,
    //     "pickup_info": {
    //         "currency": {
    //             "code": "USD",
    //             "id": 4,
    //             "symbol": "US$"
    //         },
    //         "date": "2025-06-28",
    //         "details": "12aaa",
    //         "hour": 11,
    //         "minute": 22,
    //         "nbr_of_units": 1,
    //         "selected_option": {
    //             "amount": 50.000,
    //             "currency": {
    //                 "code": "USD",
    //                 "id": 4,
    //                 "symbol": "US$"
    //             },
    //             "id": 19,
    //             "location": {
    //                 "description": "Beirut International Airport",
    //                 "id": 1
    //             },
    //             "pricing_model": {
    //                 "code": "002",
    //                 "description": "Person"
    //             },
    //             "vehicle": {
    //                 "capacity": 4,
    //                 "code": "002",
    //                 "description": "Sedan car (2 large & 3 small suitcases)"
    //             }
    //         },
    //         "total": 100.000
    //     },
    //     "promo_key": "",
    //     "property": {
    //         "address": null,
    //         "adult_child_constraints": null,
    //         "affiliates": null,
    //         "agents": null,
    //         "allowed_booking_sources": null,
    //         "allowed_cards": null,
    //         "allowed_payment_methods": null,
    //         "amenities": null,
    //         "aname": null,
    //         "area": null,
    //         "baby_cot_offering": null,
    //         "be_listing_mode": null,
    //         "calendar_legends": null,
    //         "city": null,
    //         "contacts": null,
    //         "country": null,
    //         "currency": null,
    //         "description": null,
    //         "id": 42,
    //         "images": null,
    //         "internet_offering": null,
    //         "is_automatic_check_in_out": null,
    //         "is_be_enabled": null,
    //         "is_frontdesk_enabled": null,
    //         "is_multi_property": null,
    //         "is_pms_enabled": null,
    //         "is_vacation_rental": null,
    //         "location": null,
    //         "max_nights": 0,
    //         "name": "igloorooms Demo Hotel",
    //         "parking_offering": null,
    //         "payment_methods": null,
    //         "perma_link": null,
    //         "pets_acceptance": null,
    //         "phone": null,
    //         "pickup_service": null,
    //         "postal": null,
    //         "privacy_policy": null,
    //         "promotions": null,
    //         "roomtypes": null,
    //         "social_media": null,
    //         "sources": null,
    //         "space_theme": null,
    //         "tags": null,
    //         "tax_nbr": null,
    //         "tax_statement": null,
    //         "taxation_strategy": null,
    //         "taxes": null,
    //         "time_constraints": null
    //     },
    //     "remark": "",
    //     "rooms": [
    //         {
    //             "assigned_units_pool": "365490d1-556b-4628-a478-a70737205d38",
    //             "bed_preference": null,
    //             "check_in": false,
    //             "cost": null,
    //             "days": [
    //                 {
    //                     "amount": 140.000,
    //                     "cost": null,
    //                     "date": "2025-06-28"
    //                 },
    //                 {
    //                     "amount": 140.000,
    //                     "cost": null,
    //                     "date": "2025-06-29"
    //                 },
    //                 {
    //                     "amount": 140.000,
    //                     "cost": null,
    //                     "date": "2025-06-30"
    //                 }
    //             ],
    //             "from_date": "2025-06-28",
    //             "gross_cost": null,
    //             "gross_guarantee": null,
    //             "gross_total": 466.200,
    //             "guarantee": null,
    //             "guest": {
    //                 "address": null,
    //                 "alternative_email": null,
    //                 "cci": null,
    //                 "city": null,
    //                 "country": null,
    //                 "country_id": null,
    //                 "country_phone_prefix": null,
    //                 "dob": null,
    //                 "email": null,
    //                 "first_name": "imson",
    //                 "id": null,
    //                 "id_info": null,
    //                 "is_main": false,
    //                 "last_name": "jhjh",
    //                 "mobile": null,
    //                 "mobile_without_prefix": null,
    //                 "nbr_confirmed_bookings": 0,
    //                 "notes": null,
    //                 "password": null,
    //                 "subscribe_to_news_letter": null
    //             },
    //             "identifier": "067be976-7c14-4fbe-80c6-1dd2cbedea39",
    //             "in_out": {
    //                 "code": "000",
    //                 "description": "Not Set"
    //             },
    //             "notes": "",
    //             "occupancy": {
    //                 "adult_nbr": 2,
    //                 "children_nbr": 0,
    //                 "infant_nbr": null
    //             },
    //             "ota_meta": null,
    //             "ota_meta_plain": null,
    //             "ota_taxes": null,
    //             "ota_unique_id": null,
    //             "prepayment_amount": null,
    //             "prepayment_amount_gross": null,
    //             "rateplan": {
    //                 "agents": null,
    //                 "assignable_units": null,
    //                 "cancelation": "US$466.20 if cancelled later or in case of no show.",
    //                 "custom_text": null,
    //                 "extra_bed_for_code": null,
    //                 "extra_bed_max": null,
    //                 "extra_bed_rate_per_night": null,
    //                 "extra_bed_rate_per_night_additional_child": null,
    //                 "extra_bed_rate_per_night_first_child": null,
    //                 "guarantee": "First night from your booking will be charged.",
    //                 "id": 3755,
    //                 "is_active": null,
    //                 "is_available_to_book": false,
    //                 "is_booking_engine_enabled": null,
    //                 "is_channel_enabled": null,
    //                 "is_closed": null,
    //                 "is_extra_bed_free_for_children": false,
    //                 "is_non_refundable": false,
    //                 "is_targeting_travel_agency": null,
    //                 "meal_plan": {
    //                     "code": "003",
    //                     "name": null
    //                 },
    //                 "name": "Breakfast & dinner\/Half-board",
    //                 "not_available_reason": null,
    //                 "pre_payment_amount": null,
    //                 "pre_payment_amount_gross": null,
    //                 "rate_restrictions": null,
    //                 "selected_variation": {
    //                     "IS_MLS_VIOLATED": false,
    //                     "MLS_ALERT": null,
    //                     "MLS_ALERT_VALUE": null,
    //                     "adult_child_offering": "2 adults",
    //                     "adult_nbr": 2,
    //                     "amount": null,
    //                     "amount_gross": null,
    //                     "amount_per_night": null,
    //                     "amount_per_night_gross": null,
    //                     "applicable_policies": null,
    //                     "bed_preference_code": null,
    //                     "child_nbr": 0,
    //                     "discount_pct": null,
    //                     "discounted_amount": null,
    //                     "discounted_gross_amount": null,
    //                     "extra_bed_free_nbr": null,
    //                     "extra_bed_nbr": null,
    //                     "extra_bed_rate_per_night": null,
    //                     "food_nbr_upsell": 0,
    //                     "infant_nbr": null,
    //                     "is_lmd": null,
    //                     "nights": null,
    //                     "nights_nbr": null,
    //                     "prepayment_amount": null,
    //                     "prepayment_amount_gross": null,
    //                     "rate_plan_id": 3755,
    //                     "smoking_code": null,
    //                     "total_before_discount": null
    //                 },
    //                 "sell_mode": null,
    //                 "short_name": "Half board",
    //                 "sleeps": null,
    //                 "variations": null
    //             },
    //             "roomtype": {
    //                 "amenities": null,
    //                 "availabilities": null,
    //                 "bedding_setup": null,
    //                 "description": null,
    //                 "exposed_inventory": null,
    //                 "id": 111,
    //                 "images": null,
    //                 "inventory": null,
    //                 "is_active": null,
    //                 "is_available_to_book": null,
    //                 "is_bed_configuration_enabled": null,
    //                 "main_image": null,
    //                 "name": "Premium Suites",
    //                 "not_available_reason": null,
    //                 "occupancy_default": null,
    //                 "occupancy_max": null,
    //                 "physicalrooms": null,
    //                 "rate": null,
    //                 "rateplans": null,
    //                 "size": null,
    //                 "smoking_option": null
    //             },
    //             "sharing_persons": [
    //                 {
    //                     "address": null,
    //                     "alternative_email": null,
    //                     "cci": null,
    //                     "city": null,
    //                     "country": {
    //                         "cities": null,
    //                         "code": null,
    //                         "currency": null,
    //                         "flag": null,
    //                         "gmt_offset": 0,
    //                         "id": null,
    //                         "name": null,
    //                         "phone_prefix": null
    //                     },
    //                     "country_id": null,
    //                     "country_phone_prefix": null,
    //                     "dob": "1900-01-01",
    //                     "email": null,
    //                     "first_name": "imson",
    //                     "id": 70520,
    //                     "id_info": {
    //                         "number": "",
    //                         "type": {
    //                             "code": "001",
    //                             "description": "Passport"
    //                         }
    //                     },
    //                     "is_main": true,
    //                     "last_name": "jhjh",
    //                     "mobile": null,
    //                     "mobile_without_prefix": null,
    //                     "nbr_confirmed_bookings": 0,
    //                     "notes": null,
    //                     "password": null,
    //                     "subscribe_to_news_letter": null
    //                 }
    //             ],
    //             "smoking_option": null,
    //             "taxes": null,
    //             "to_date": "2025-07-01",
    //             "total": 420.000,
    //             "unit": {
    //                 "calendar_cell": null,
    //                 "hk_status": null,
    //                 "housekeeper": null,
    //                 "id": 5,
    //                 "is_active": null,
    //                 "name": "104"
    //             }
    //         }
    //     ],
    //     "source": {
    //         "code": "003",
    //         "description": "Phone\/Email",
    //         "id": null,
    //         "tag": "",
    //         "type": null
    //     },
    //     "status": {
    //         "code": "002",
    //         "description": "Confirmed"
    //     },
    //     "system_id": 14891155,
    //     "to_date": "2025-07-01",
    //     "total": 420.000
    // }
}


export const bookingData = {
    ...getBookingDetails({ booking: _data.booking, property: _data.property }),
    ..._data
}
