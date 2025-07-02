import { common } from "./common"

const booking = {
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
        "date": "2025-06-19",
        "hour": 13,
        "minute": 24
    },
    "booking_nbr": "15404276164",
    "channel_booking_nbr": null,
    "cost": null,
    "currency": {
        "code": "USD",
        "id": 4,
        "symbol": "US$"
    },
    "extra_services": [
        {
            "booking_system_id": 14891155,
            "cost": 12.000,
            "currency_id": 4,
            "description": "test in extra service for email",
            "end_date": "2025-06-30",
            "price": 12.000,
            "start_date": "2025-06-28",
            "system_id": 111
        }
    ],
    "extras": [
        {
            "key": "is_backend",
            "value": "true"
        }
    ],
    "financial": {
        "due_amount": 578.200,
        "due_dates": null,
        "gross_cost": 0.0,
        "gross_total": 566.200,
        "invoice_nbr": "154042",
        "payments": null,
        "total_amount": 420.000
    },
    "format": {
        "from_date": "Sat, 28 Jun 2025",
        "to_date": "Tue, 01 Jul 2025"
    },
    "from_date": "2025-06-28",
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
    "pickup_info": {
        "currency": {
            "code": "USD",
            "id": 4,
            "symbol": "US$"
        },
        "date": "2025-06-28",
        "details": "12aaa",
        "hour": 11,
        "minute": 22,
        "nbr_of_units": 1,
        "selected_option": {
            "amount": 50.000,
            "currency": {
                "code": "USD",
                "id": 4,
                "symbol": "US$"
            },
            "id": 19,
            "location": {
                "description": "Beirut International Airport",
                "id": 1
            },
            "pricing_model": {
                "code": "002",
                "description": "Person"
            },
            "vehicle": {
                "capacity": 4,
                "code": "002",
                "description": "Sedan car (2 large & 3 small suitcases)"
            }
        },
        "total": 100.000
    },
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
            "assigned_units_pool": "365490d1-556b-4628-a478-a70737205d38",
            "bed_preference": null,
            "check_in": false,
            "cost": null,
            "days": [
                {
                    "amount": 140.000,
                    "cost": null,
                    "date": "2025-06-28"
                },
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
            "from_date": "2025-06-28",
            "gross_cost": null,
            "gross_guarantee": null,
            "gross_total": 466.200,
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
                "first_name": "imson",
                "id": null,
                "id_info": null,
                "is_main": false,
                "last_name": "jhjh",
                "mobile": null,
                "mobile_without_prefix": null,
                "nbr_confirmed_bookings": 0,
                "notes": null,
                "password": null,
                "subscribe_to_news_letter": null
            },
            "identifier": "067be976-7c14-4fbe-80c6-1dd2cbedea39",
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
                "cancelation": "US$466.20 if cancelled later or in case of no show.",
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
                    "first_name": "imson",
                    "id": 70520,
                    "id_info": {
                        "number": "",
                        "type": {
                            "code": "001",
                            "description": "Passport"
                        }
                    },
                    "is_main": true,
                    "last_name": "jhjh",
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
            "total": 420.000,
            "unit": {
                "calendar_cell": null,
                "hk_status": null,
                "housekeeper": null,
                "id": 5,
                "is_active": null,
                "name": "104"
            }
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
        "code": "002",
        "description": "Confirmed"
    },
    "system_id": 14891155,
    "to_date": "2025-07-01",
    "total": 420.000
}
const _baseData = {
    ...common,
    booking
}
const preArrivalReminder = {
    ..._baseData,
    description: "Check our pool&nbsp;"
}
const duringTheStayReminder = {
    ..._baseData,
    description: `At Casa Mespilea we are promoting a new vision of urban living. It is a family-owned bourgeois townhouse, built in 1890, has been recently renovated and offers its guests the experience of Mediterranean urban holidays, living in the centre of Paphos. We are located in the centre of the town very close to popular bars, restaurants and the beautiful Town Hall square.<br />
<br />
<strong>Facilities</strong><br />
&bull; We offer an all-day restaurant service in our gorgeous garden (brunch, lunch and dinner). If you would like to see our menu and make a booking, please ask a member of staff.<br />
&bull; If you have not already booked, we offer a traditional breakfast for the customer of the guest house with additional cost of &euro;9.5.<br />
&bull; You can access our beautiful roof deck and enjoy the sunset by using the stairs inside the main building.<br />
&bull; We offer a cleaning service on the 3rd day of your stay. If you require any room supplies, please let a member of staff know.<br />
&bull; The rooms have air-conditioning unit which woks as cooling &amp; heating.<br />
<br />
We are more than happy to help with any other questions you may have i.e taxi bookings, special tour and activities, sightseeing recommendations.<br />
<br />
Best regards,<br />
Yioula &amp; Costas<br />
+35799313002 or +35799683757`
}

const postDepartureReminder = {
    ..._baseData,
    description: "Feel free to review u on google: xdhvhcvhbnhv,mb v,zlksvlkgvn,mcvnnbnb"
}

export { preArrivalReminder, duringTheStayReminder, postDepartureReminder }
