export const common = {
    property: {
        "address": "Ice Venue 11",
        "adult_child_constraints": {
            "adult_max_nbr": 20,
            "child_max_age": 3,
            "child_max_nbr": 6
        },
        "affiliates": [],
        "agents": [
            {
                "code": "9SCAPPA9",
                "id": 1,
                "is_active": true,
                "name": "scappadays",
                "payment_mode": {
                    "code": "001",
                    "description": "On credit"
                },
                "verification_mode": "code"
            },
            {
                "code": "TEST1",
                "id": 2,
                "is_active": true,
                "name": "Alitalia Cabin Crew",
                "payment_mode": {
                    "code": "002",
                    "description": "Instant"
                },
                "verification_mode": "code"
            }
        ],
        "allowed_booking_sources": [
            {
                "code": "003",
                "description": "Phone/Email",
                "id": "759925c6-2671-434a-8230-3e47907ec671",
                "tag": "",
                "type": "SETUP"
            },
            {
                "code": "002",
                "description": "Walk-in",
                "id": "0fc172fd-9918-435c-a113-7f768ed02760",
                "tag": "",
                "type": "SETUP"
            },
            {
                "code": "005",
                "description": "Social media",
                "id": "4e63ca1b-40b3-4818-9a38-f6ec438f1b82",
                "tag": "",
                "type": "SETUP"
            },
            {
                "code": "000",
                "description": "-- Agents/Corpo --",
                "id": "2d2b6c02-aa4f-41b2-9549-ebb949f7251a",
                "tag": "",
                "type": "LABEL"
            },
            {
                "code": "001",
                "description": "Alitalia Cabin Crew",
                "id": "33c2b352-5856-437d-b0d5-824de7ba6842",
                "tag": "2",
                "type": "TRAVEL_AGENCY"
            },
            {
                "code": "001",
                "description": "scappadays",
                "id": "7861cfea-b1ba-4e35-8476-5a5cf25ef70f",
                "tag": "1",
                "type": "TRAVEL_AGENCY"
            }
        ],
        "allowed_cards": [
            {
                "id": 14,
                "name": "Visa"
            },
            {
                "id": 1,
                "name": "Euro/Mastercard"
            }
        ],
        "allowed_payment_methods": [
            {
                "code": "005",
                "data": null,
                "description": "Bank or Money Transfer",
                "display_order": null,
                "id": null,
                "is_active": true,
                "is_payment_gateway": false,
                "localizables": [
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "",
                        "id": 1138,
                        "language": {
                            "code": "PR",
                            "culture": null,
                            "description": "Português",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 1
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "<p>Your booking will be held for 3 days until the transfer is made to the following bank account.</p><p><strong>PARADISE BANK c </strong></p><p><strong>Account name: </strong>Blue Hotel</p><p><strong>Account number: </strong>108608010001</p><p><strong>IBAN: <em>abcd</em></strong></p>",
                        "id": 1122,
                        "language": {
                            "code": "EN",
                            "culture": null,
                            "description": "English",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 2
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "",
                        "id": 1136,
                        "language": {
                            "code": "FR",
                            "culture": null,
                            "description": "Français",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 3
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "<p>سيتم حجز حجزك لمدة 3 أيام حتى يتم تحويل المبلغ إلى الحساب البنكي التالي.</p><p><strong>بنك بارادايس</strong></p><p><strong>اسم الحساب: </strong>فندق بلو</p><p><strong>رقم الحساب: </strong>108608010001</p><p><strong>الآيبان: </strong>XX92 8000 0108 6080 1000 0002</p>",
                        "id": 1124,
                        "language": {
                            "code": "AR",
                            "culture": null,
                            "description": "العربية",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 4
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "",
                        "id": 1139,
                        "language": {
                            "code": "RO",
                            "culture": null,
                            "description": "Română",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 6
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "<p><span style=\"color: rgb(102, 102, 102); background-color: rgb(255, 255, 255);\">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu p</span></p>",
                        "id": 1140,
                        "language": {
                            "code": "RU",
                            "culture": null,
                            "description": "Русский",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 7
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "<p>Η κράτησή σας θα διατηρηθεί για 3 ημέρες μέχρι να γίνει η μεταφορά στον παρακάτω τραπεζικό λογαριασμό.<br><strong>Τράπεζα Παράδεισος</strong><br><strong>Όνομα λογαριασμού: </strong>Ξενοδοχείο Μπλε<br><strong>Αριθμός λογαριασμού: </strong>108608010001<br><strong>IBAN: </strong>XX92 8000 0108 6080 1000 0002</p>",
                        "id": 1123,
                        "language": {
                            "code": "EL",
                            "culture": null,
                            "description": "Ελληνικά",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 8
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu p</span></p>",
                        "id": 1137,
                        "language": {
                            "code": "PL",
                            "culture": null,
                            "description": "Polski",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 10
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "",
                        "id": 1135,
                        "language": {
                            "code": "DE",
                            "culture": null,
                            "description": "Deutsch",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 11
                        }
                    },
                    {
                        "code": "BANK_TRANSFER_INFO",
                        "description": "",
                        "id": 1141,
                        "language": {
                            "code": "UA",
                            "culture": null,
                            "description": "Українська",
                            "direction": null,
                            "entries": null,
                            "flag": null,
                            "id": 12
                        }
                    }
                ],
                "property_id": 42
            },
            {
                "code": "000",
                "data": null,
                "description": "No payment required",
                "display_order": null,
                "id": null,
                "is_active": true,
                "is_payment_gateway": false,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "001",
                "data": null,
                "description": "Manual card processing",
                "display_order": null,
                "id": null,
                "is_active": true,
                "is_payment_gateway": false,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "MPGS",
                "data": null,
                "description": "MPGS",
                "display_order": null,
                "id": 8,
                "is_active": false,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "JCC",
                "data": null,
                "description": "JCC",
                "display_order": null,
                "id": 16,
                "is_active": false,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "Stripe",
                "data": null,
                "description": "Stripe",
                "display_order": null,
                "id": 11,
                "is_active": false,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "PayPal",
                "data": null,
                "description": "PayPal",
                "display_order": null,
                "id": 1,
                "is_active": false,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "Areeba",
                "data": null,
                "description": "Areeba",
                "display_order": null,
                "id": 10,
                "is_active": false,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "NetCommerce",
                "data": null,
                "description": "NetCommerce",
                "display_order": null,
                "id": 12,
                "is_active": true,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "SAFERPAY",
                "data": null,
                "description": "VPayments",
                "display_order": null,
                "id": 13,
                "is_active": true,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            },
            {
                "code": "HYPER_PAY",
                "data": null,
                "description": "Hyper Pay",
                "display_order": null,
                "id": 17,
                "is_active": true,
                "is_payment_gateway": true,
                "localizables": null,
                "property_id": 42
            }
        ],
        "amenities": [
            {
                "amenity_type": "property",
                "code": "24hourdesk",
                "description": "24-hour front desk"
            },
            {
                "amenity_type": "property",
                "code": "coffeeshop",
                "description": "Coffee shop"
            },
            {
                "amenity_type": "room",
                "code": "climatecontrol",
                "description": "A/C"
            },
            {
                "amenity_type": "service",
                "code": "concierge",
                "description": "Concierge services"
            },
            {
                "amenity_type": "property",
                "code": "multilingualstaff",
                "description": "Multilingual staff"
            },
            {
                "amenity_type": "service",
                "code": "laundry",
                "description": "Laundry, ironing, dry cleaning at extra cost"
            },
            {
                "amenity_type": "property",
                "code": "nonsmoking",
                "description": "Non-smoking rooms / floors"
            },
            {
                "amenity_type": "property",
                "code": "elevator",
                "description": "Elevator"
            },
            {
                "amenity_type": "property",
                "code": "safereception",
                "description": "Safe at reception"
            },
            {
                "amenity_type": "property",
                "code": "restaurant",
                "description": "Restaurant"
            },
            {
                "amenity_type": "property",
                "code": "wheelchair",
                "description": "Wheelchair access"
            },
            {
                "amenity_type": "property",
                "code": "creditcard",
                "description": "Credit cards accepted"
            },
            {
                "amenity_type": "room",
                "code": "housekeeping",
                "description": "Daily housekeeping"
            },
            {
                "amenity_type": "room",
                "code": "toiletries",
                "description": "Complimentary toiletries"
            },
            {
                "amenity_type": "room",
                "code": "balcony",
                "description": "Balcony"
            },
            {
                "amenity_type": "service",
                "code": "airporttransfer",
                "description": "Airport transfer"
            },
            {
                "amenity_type": "property",
                "code": "busparking",
                "description": "Bus parking"
            },
            {
                "amenity_type": "room",
                "code": "complimentarywater",
                "description": "Complimentary water in room"
            },
            {
                "amenity_type": "service",
                "code": "valetparking",
                "description": "Valet parking"
            },
            {
                "amenity_type": "property",
                "code": "luggagestorage",
                "description": "Luggage storage"
            },
            {
                "amenity_type": "service",
                "code": "carhire",
                "description": "Car hire"
            },
            {
                "amenity_type": "room",
                "code": "sittingarea",
                "description": "Seating area"
            },
            {
                "amenity_type": "room",
                "code": "bathroom",
                "description": "Bathroom"
            },
            {
                "amenity_type": "room",
                "code": "bathrobes ",
                "description": "Bathrobes"
            },
            {
                "amenity_type": "room",
                "code": "breakfastinroompaid",
                "description": "Breakfast in room (charged extra)"
            },
            {
                "amenity_type": "room",
                "code": "freewifi",
                "description": "Free WiFi"
            },
            {
                "amenity_type": "room",
                "code": "shower",
                "description": "Shower"
            },
            {
                "amenity_type": "room",
                "code": "slippers",
                "description": "Slippers"
            },
            {
                "amenity_type": "room",
                "code": "amenities",
                "description": "Welcome amenities"
            },
            {
                "amenity_type": "activity",
                "code": "bicyclerental",
                "description": "Bicycle rental"
            },
            {
                "amenity_type": "service",
                "code": "faxservices",
                "description": "Fax services"
            }
        ],
        "aname": "A35",
        "area": "Adma",
        "baby_cot_offering": {
            "rate_per_night": 30.000,
            "title": "Baby cots are available upon request"
        },
        "be_listing_mode": "grid",
        "calendar_legends": [
            {
                "color": "#31bef1",
                "design": "skew",
                "id": "1",
                "name": "In-house"
            },
            {
                "color": "#45b16d",
                "design": "skew",
                "id": "2",
                "name": "Confirmed"
            },
            {
                "color": "#f4d552",
                "design": "skew",
                "id": "3",
                "name": "Pending confirmation"
            },
            {
                "color": "#ffffff",
                "design": "skew-bordered",
                "id": "4",
                "name": "OTA booking"
            },
            {
                "color": "#a0a0a0",
                "design": "skew",
                "id": "5",
                "name": "Checked out"
            },
            {
                "color": "#f34752",
                "design": "skew",
                "id": "6",
                "name": "Blocked dates"
            },
            {
                "color": "#f88c91",
                "design": "skew",
                "id": "7",
                "name": "Blocked with release"
            },
            {
                "color": "#f4d552",
                "design": "circle",
                "id": "8",
                "name": "Notes"
            },
            {
                "color": "#f34752",
                "design": "circle",
                "id": "9",
                "name": "Outstanding balance"
            },
            {
                "color": "#99999980",
                "design": "rectangle",
                "id": "10",
                "name": "No availability or stop sale"
            }
        ],
        "city": {
            "gmt_offset": 3,
            "id": 8,
            "name": "Jounieh"
        },
        "contacts": [
            {
                "email": "chowaifatydavid@gmail.com",
                "mobile": null,
                "name": "Johnaa1",
                "phone": "",
                "type": "booking"
            },
            {
                "email": "rony@igloorooms.com",
                "mobile": null,
                "name": "QA",
                "phone": "",
                "type": "manager"
            },
            {
                "email": "sales@igloorooms.com",
                "mobile": null,
                "name": "Gary Winter",
                "phone": "",
                "type": "finance"
            }
        ],
        "country": {
            "cities": null,
            "code": null,
            "currency": null,
            "flag": null,
            "gmt_offset": 3,
            "id": 2,
            "name": "Lebanon",
            "phone_prefix": "+961"
        },
        "currency": {
            "code": "USD",
            "id": 4,
            "symbol": "US$"
        },
        "description": {
            "food_and_beverage": "The hotel provides a delicious breakfast and an assortment of coffee, tea and various drinks.",
            "important_info": "During peak season we sometimes require a 2-nights minimum stay.",
            "location_and_intro": "Demo Hotel is a new 3 stars hotel ideal for individuals, couple and families. It is very close to the sea shore and offer a stunning sunset view over the Mediterranean. The hotel is surrounded by various attractions like beaches, Casino du Liban, Jounieh souks, Harissa, Jbeil, all within few minutes by car.",
            "non_standard_conditions": "Here it is",
            "rooming": "All rooms have a stunning sea view and balcony. They are offered as single, double, premium suite with Jacuzzi and family connected rooms. Sizes range between 25 and 50sqm. Interior is elegant and trendy."
        },
        "extra_info": [
            {
                "key": "EMAIL_DURING_THE_STAY_CUSTOM_MESSAGE",
                "value": "At Casa Mespilea we are promoting a new vision of urban living. It is a family-owned bourgeois townhouse, built in 1890, has been recently renovated and offers its guests the experience of Mediterranean urban holidays, living in the centre of Paphos. We are located in the centre of the town very close to popular bars, restaurants and the beautiful Town Hall square.<br />\n<br />\n<strong>Facilities</strong><br />\n&bull; We offer an all-day restaurant service in our gorgeous garden (brunch, lunch and dinner). If you would like to see our menu and make a booking, please ask a member of staff.<br />\n&bull; If you have not already booked, we offer a traditional breakfast for the customer of the guest house with additional cost of &euro;9.5.<br />\n&bull; You can access our beautiful roof deck and enjoy the sunset by using the stairs inside the main building.<br />\n&bull; We offer a cleaning service on the 3rd day of your stay. If you require any room supplies, please let a member of staff know.<br />\n&bull; The rooms have air-conditioning unit which woks as cooling &amp; heating.<br />\n<br />\nWe are more than happy to help with any other questions you may have i.e taxi bookings, special tour and activities, sightseeing recommendations.<br />\n<br />\nBest regards,<br />\nYioula &amp; Costas<br />\n+35799313002 or +35799683757"
            },
            {
                "key": "EMAIL_POST_DEPARTURE_CUSTOM_MESSAGE",
                "value": "Feel free to review u on google: xdhvhcvhbnhv,mb v,zlksvlkgvn,mcvnnbnb<br />\nuse the coupon loyal 10 and benefit from 10% on your next stay/&nbsp;"
            },
            {
                "key": "EMAIL_PRE_ARRIVAL_CUSTOM_MESSAGE",
                "value": "Check our pool&nbsp;"
            },
            {
                "key": "EMAIL_PRE_ARRIVAL_DAYS_BEFORE_CHECK_IN",
                "value": "2"
            }
        ],
        "id": 42,
        "images": [
            {
                "thumbnail": "",
                "tooltip": "Outdoors",
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_271.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_248.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_249.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_252.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_242.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_272.jpg"
            },
            {
                "thumbnail": "",
                "tooltip": null,
                "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_270.jpg"
            }
        ],
        "internet_offering": {
            "is_public_internet_free": false,
            "is_room_internet_free": false,
            "public_internet_statement": "FREE Internet",
            "room_internet_statement": "FREE Internet",
            "room_rate_per_24_hour": 0.000,
            "room_rate_per_hour": 0.000
        },
        "is_automatic_check_in_out": false,
        "is_be_enabled": true,
        "is_frontdesk_enabled": true,
        "is_multi_property": false,
        "is_pms_enabled": true,
        "is_vacation_rental": false,
        "location": {
            "latitude": 34.022000,
            "longitude": 35.628000
        },
        "max_nights": 45,
        "name": "igloorooms Demo Hotel",
        "parking_offering": {
            "pricing": 5.000,
            "schedule": "day",
            "title": "Paid parking available"
        },
        "payment_methods": null,
        "perma_link": "iglooroomsdemohotel",
        "pets_acceptance": {
            "title": "Pets are not allowed"
        },
        "phone": "9968454545",
        "pickup_service": {
            "allowed_locations": [
                {
                    "description": "Beirut International Airport",
                    "id": 1
                }
            ],
            "allowed_options": [
                {
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
                {
                    "amount": 90.000,
                    "currency": {
                        "code": "USD",
                        "id": 4,
                        "symbol": "US$"
                    },
                    "id": 20,
                    "location": {
                        "description": "Beirut International Airport",
                        "id": 1
                    },
                    "pricing_model": {
                        "code": "001",
                        "description": "Vehicle"
                    },
                    "vehicle": {
                        "capacity": 6,
                        "code": "005",
                        "description": "6-seater car (6 suitcases)"
                    }
                },
                {
                    "amount": 0.000,
                    "currency": {
                        "code": "USD",
                        "id": 4,
                        "symbol": "US$"
                    },
                    "id": 65,
                    "location": {
                        "description": "Beirut International Airport",
                        "id": 1
                    },
                    "pricing_model": {
                        "code": "001",
                        "description": "Vehicle"
                    },
                    "vehicle": {
                        "capacity": 3,
                        "code": "008",
                        "description": "Sedan car (night service)"
                    }
                },
                {
                    "amount": 100.000,
                    "currency": {
                        "code": "USD",
                        "id": 4,
                        "symbol": "US$"
                    },
                    "id": 103,
                    "location": {
                        "description": "Beirut International Airport",
                        "id": 1
                    },
                    "pricing_model": {
                        "code": "001",
                        "description": "Vehicle"
                    },
                    "vehicle": {
                        "capacity": 5,
                        "code": "004",
                        "description": "7-seater"
                    }
                }
            ],
            "allowed_pricing_models": [
                {
                    "code": "001",
                    "description": "Vehicle"
                },
                {
                    "code": "002",
                    "description": "Person"
                }
            ],
            "allowed_vehicle_types": [
                {
                    "capacity": 1,
                    "code": "001",
                    "description": "Airport shuttle"
                },
                {
                    "capacity": 4,
                    "code": "002",
                    "description": "Sedan car (2 large & 3 small suitcases)"
                },
                {
                    "capacity": 4,
                    "code": "003",
                    "description": "Limousine"
                },
                {
                    "capacity": 5,
                    "code": "004",
                    "description": "7-seater"
                },
                {
                    "capacity": 6,
                    "code": "005",
                    "description": "6-seater car (6 suitcases)"
                },
                {
                    "capacity": 7,
                    "code": "006",
                    "description": "Minivan for 11"
                },
                {
                    "capacity": 11,
                    "code": "007",
                    "description": "Minivan for 14"
                },
                {
                    "capacity": 3,
                    "code": "008",
                    "description": "Sedan car (night service)"
                },
                {
                    "capacity": 4,
                    "code": "009",
                    "description": "Station wagon (3 large & 4 small suitcases)"
                },
                {
                    "capacity": 2,
                    "code": "010",
                    "description": "Sedan car (2 suitcases)"
                }
            ],
            "is_enabled": true,
            "is_not_allowed_on_same_day": true,
            "pickup_cancelation_prepayment": {
                "code": "001",
                "description": "The hotel reserves the right to charge your card on the same day of pickup or in case of no-show."
            },
            "pickup_instruction": {
                "code": "001",
                "description": "Driver will be holding your name at the arrivals exit."
            }
        },
        "postal": null,
        "privacy_policy": "<p><strong>INFORMATION AND CONSENT</strong></p> <p>This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information about you (hereinafter, the \"User\"), in conjunction with your access to and use of our booking system.</p> <p>By reading this Privacy Policy, the user is hereby informed on how we collect, process and protect personal data furnished through the booking engine.</p> <p>The User must carefully read this Privacy Policy to determine whether they wish to provide their personal data, or those of third parties, to <strong>[AC_NAME]</strong>.</p> <p>When this policy mentions \"booking system\", \"booking engine\", \"system\", \"website\", \"platform\", \"app\", \"webapp\", \"services\" or \"online services\" it refers to all pages and functions under <strong>[URL]</strong> unless specified otherwise.</p> <p>By accessing the platform or providing information, you agree to our privacy practices as set out in this privacy statement. We may change this policy from time to time. You should check this policy to ensure you are aware of the most recent version.</p> <p>&nbsp;</p> <p><strong>IDENTITY</strong></p> <p>When this policy mentions \"we\", \"us\", \"our\", \"data controller\" or \"controller\" it refers to the <strong>[AC_NAME]</strong>.</p> <p>&nbsp;</p> <p><strong>Data Controller: [AC_NAME]</strong> operates this booking system through a data processor, as explained below. For the purposes of the General Data Protection Regulation (\"GDPR\") (EU) 2016/679, we are the Data Controller. There is a strict contractual framework between the data controller and the data processor for the protection of your personal information. We are:</p> <p>&nbsp;</p> <div><strong>[AC_NAME]</strong></div> <div><strong>[ADDRESS]</strong></div> <div><strong>[AREA]</strong></div> <div><strong>[LEVEL2]</strong></div> <div><strong>[COUNTRY]</strong></div> <p>&nbsp;</p> <p><strong>Data Processor: </strong>A third-party Data Processor operates this booking system on behalf of&nbsp;<strong>[AC_NAME]</strong> and is committed to protecting the privacy of the users of this system. For the purposes of the GDPR, this third-party is the Data Processor.</p> <p>&nbsp;</p> <p><strong>OBLIGATORY NATURE OF PROVIDING THE DATA</strong></p> <p>The data requested in the forms accessible from the booking engine is, in general, mandatory (unless specified otherwise in the required field) to meet the stated purposes. Accordingly, if they are not provided or are not provided correctly, we will be unable to process the request.</p> <p>&nbsp;</p> <p><strong>PERSONAL DATA WE COLLECT AND PROCESS</strong><br><br><strong>This will include:</strong></p> <ul>     <li>personal information about you which we ask you for (e.g. your name, address, and email address) when you make a booking from our booking engine;</li>     <li>financial details in order to process your booking when we require pre-payment;</li>     <li>details of transactions you carry out through our booking engine and details of the fulfillment of your orders.</li>     <li>our data processor may only collect and process personal data collected and/or processed on behalf of us in accordance with our instructions.</li> </ul> <p><br><strong>We grant permission to our data processor:</strong></p> <ul>     <li>to use your personal information for reserving rooms and/or other services for you at&nbsp;<strong>[AC_NAME]</strong></li>     <li>to pass on your financial details to <strong>[AC_NAME]</strong> and/or an appropriate third party (for example, a credit card company) for the purpose of confirming or paying for a booking;</li>     <li>to use your information for marketing purposes (where you explicitly agree with this); and</li>     <li>to pre-complete forms and other details on our website to make your next visit to our booking engine easier (e.g. when amending or canceling a booking).</li> </ul> <p><br><strong>Social Login: </strong>In the event of registration and/or access through a third-party account, we may collect and access certain information of the User’s profile from the corresponding social network, solely for internal administrative purposes and/or for the purposes indicated above.</p> <p>&nbsp;</p> <p><strong>Third-party data (e.g. book for a friend): </strong>In the event that the User provides third-party data, they declare that they have the third party’s consent and undertake to provide the interested party -the data holder- with the information contained in this Privacy Policy, duly exonerating us and our data processor from any liability in this regard. However, we may carry out the necessary verification to verify this fact, adopting the corresponding due diligence measures, in accordance with the data protection regulations.</p> <p>&nbsp;</p> <p><strong>Sensitive Data: </strong>Unless specifically requested, we ask that you not send us, and you not disclose, on or through the Services or otherwise to us, any Sensitive Personal Data (e.g., social security numbers, national identification number, data related to racial or ethnic origin, political opinions, religion, ideological or other beliefs, health, biometric or genetic characteristics, criminal background, trade union membership, or administrative or criminal proceedings and sanctions).</p> <p>&nbsp;</p> <p><strong>Use of Services by Minors: </strong>The Services are not directed to individuals under the age of sixteen (16), and we request that they not provide Personal Data through the Services.</p> <p>&nbsp;</p> <p><strong>PURPOSE OF PROCESSING PERSONAL DATA</strong></p> <p>Depending on the User’s requests, the personal data collected will be processed in accordance with the following purposes:</p> <ul>     <li>To manage the bookings made, including payment management (where applicable) and the management of the user’s requests and preferences.</li>     <li>To manage registration in loyalty or membership programs, as well as obtaining and redeeming points.</li>     <li>To manage the User’s contact requests with us through the channels provided for this end.</li>     <li>To manage the sending of personalized commercial communications from us, by electronic and/or conventional means, in cases in which the User expressly consents.</li>     <li>To manage the provision of the contracted accommodation service, as well as additional services.</li>     <li>To manage surveys and/or evaluations regarding the quality of the services provided by us and/or the perception of its image as a company.</li> </ul> <p>&nbsp;</p> <p><strong>DATA RETENTION</strong></p> <p>We will retain your Personal Data for the period necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law or if the User requests their withdrawal from us, opposes or revokes their consent.</p> <p>The criteria used to determine our retention periods include:</p> <ul>     <li>The length of time we have an ongoing relationship with you and provide the Services to you (for example, for as long as you have an account with us or keep using the Services or if you have a booking that has not yet been fulfilled)</li>     <li>Whether there is a legal obligation to which we are subject (for example, certain laws require us to keep records of your transactions for a certain period of time before we can delete them)</li>     <li>Whether retention is advisable considering our legal position (such as, for statutes of limitations, litigation or regulatory investigations)</li> </ul> <p>&nbsp;</p> <p><strong>LEGITIMATE INTEREST FOR PROCESSING YOUR DATA</strong></p> <p>The data processing required in fulfillment of the aforementioned purposes that require the User’s consent cannot be undertaken without said consent.</p> <p>Likewise, in the event that the User withdraws their consent to any of the processing, this will not affect the legality of the processing carried out previously.</p> <p>To revoke such consent, the User may contact us through the appropriate channels.</p> <p>By the same token, in those cases in which it is necessary to process the User’s data for the fulfillment of a legal obligation or for the execution of the existing contractual relationship between us and the User, the processing would be legitimized as it is necessary for compliance with said purposes.</p> <p>&nbsp;</p> <p><strong>DATA DISCLOSURE</strong></p> <p>We will use and disclose Personal Data as we believe to be necessary or appropriate:</p> <ul>     <li>to comply with applicable law, including laws outside your country of residence;</li>     <li>to comply with the legal process;</li>     <li>to respond to requests from public and government authorities, including authorities outside your country of residence, and to meet national security or law enforcement requirements;</li>     <li>to enforce our terms and conditions;</li>     <li>to protect our operations;</li><li>to protect the rights, privacy, safety or property of our own, you or others; and</li>     <li>to allow us to pursue available remedies or limit the damage that we may sustain.</li> </ul> <p>We may use and disclose Other Data for any purpose, except where we are not allowed to under applicable law. In some instances, we may combine Other Data with Personal Data (such as combining your name with your location). If we do, we will treat the combined data as Personal Data as long as it is combined.</p> <p>&nbsp;</p> <p><strong>INTERNATIONAL TRANSFERS OF PERSONAL DATA</strong></p> <p>We may transfer your personal information to our data processor(s) or/and sub-processor(s) based outside of the EEA for the purposes described in this policy. If we do this, your personal information will continue to be subject to one or more appropriate safeguards set out in the law. These might be the use of model contracts in a form approved by regulators, or having our suppliers sign up to an independent privacy scheme approved by regulators (like the US <a target=\"_new\" rel=\"noopener noreferrer\" href=\"https://www.privacyshield.gov/\">Privacy Shield</a> scheme).</p> <p>&nbsp;</p> <p><strong>USER'S RESPONSIBILITY</strong></p> <p>The User guarantees that they are of legal age or legally emancipated, where applicable, fully capable, and that the information furnished to us is true, accurate, complete and up-to-date. For these purposes, the User is responsible for the truthfulness of all the data communicated and will keep the information updated, so that said data reflects their current situation.</p> <p>The User guarantees that he/she has informed third parties on whose behalf he/she has provided data, where applicable, of the aspects contained in this document. Also guarantees that he/she has obtained the third party’s authorization to provide their data to us for the purposes indicated.</p> <p>The User will be responsible for false or inaccurate information provided on the Website and for damages, whether direct or indirect, that this may cause to us or third parties.</p> <p>&nbsp;</p> <p><strong>EXERCISE OF RIGHTS AND DATA DELETION</strong></p> <p>The User may contact us at any time free of charge by emailing support@igloorooms.com and providing his unique account email, to:</p> <ul>     <li>To obtain confirmation about whether personal data concerning the User is being processed by us.</li>     <li>To access their personal details.</li>     <li>To rectify any inaccurate or incomplete data.</li>     <li>To request the deletion of their personal data when, among other reasons, the data is no longer necessary for the purposes for which it was collected.</li>     <li>To confirm revocation of consent.</li>     <li>To obtain from us the limitation of data processing when any of the conditions provided in the data protection regulations are met.</li>     <li>To request the portability of your data.</li> </ul> <p>Likewise, the user is informed that at any time he/she may file a complaint regarding the protection of their personal data before the competent Data Protection Authority.</p> <p>&nbsp;</p> <p><strong>SECURITY MEASURES</strong></p> <p>We will process the User’s data at all times in an absolute confidential way and maintain the mandatory duty to secrecy with regard to said data, in accordance with the provisions set out in applicable regulations, and to this end, adopting the measures of a technical and organizational nature required to guarantee the security of their data and prevent them from being altered, lost, processed or accessed illegally, depending on the state of the technology, the nature of the stored data and the risks to which they are exposed.</p><p>&nbsp;</p> <p><strong>BOOKING CONDITIONS</strong></p> <p>The User agrees to accept the cancellation, the no-refund and the no-show policies mentioned during the booking process and sent by email upon booking confirmation. Policies may vary based on room type and/or dates of stay. We are not liable for cancellations or changes caused by force majeure events beyond our control (e.g., natural disasters, strikes, pandemics).</p>",
        "promotions": [],
        "roomtypes": [
            {
                "amenities": [
                    {
                        "amenity_type": "room",
                        "code": "amenities",
                        "description": "Welcome amenities"
                    },
                    {
                        "amenity_type": "room",
                        "code": "viewslopes",
                        "description": "Slopes view"
                    },
                    {
                        "amenity_type": "room",
                        "code": "soundproof",
                        "description": "Soundproof"
                    }
                ],
                "availabilities": null,
                "bedding_setup": [
                    {
                        "code": "kingsizebed",
                        "count": 1,
                        "name": "King size bed"
                    },
                    {
                        "code": "singlebed",
                        "count": 1,
                        "name": "Single bed"
                    }
                ],
                "description": "Our Modern and Classic Rooms averages 322 square feet with custom furnishings,every room in Hotel High Season includes the finest attention to detail, from the triple-sheeted 300 thread count sheets to the one-touch “Goodnight” button.Each room will be everything you are looking for in a Lebanon hotel, and drastically more than you thought possible and our custom beds by will make you want to snooze through your morning plans.When you enter our Modern and Classic Room, you’ll only have one thought: this is what all hotels at Lebanon should be like. ",
                "exposed_inventory": null,
                "id": 110,
                "images": [
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_235.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_251.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_225.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_236.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_238.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_241.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_231.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_226.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Standard Rooms",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_229.jpg"
                    }
                ],
                "inventory": null,
                "is_active": true,
                "is_available_to_book": null,
                "is_bed_configuration_enabled": false,
                "main_image": {
                    "thumbnail": null,
                    "tooltip": "Standard Rooms",
                    "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_235.jpg"
                },
                "name": "Standard Rooms",
                "not_available_reason": null,
                "occupancy_default": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": null
                },
                "occupancy_max": {
                    "adult_nbr": 2,
                    "children_nbr": 1,
                    "infant_nbr": 0
                },
                "physicalrooms": [
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 10,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Bassamx Yzzz",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 16,
                        "is_active": true,
                        "name": "05"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 21,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Anita Meyers",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 17,
                        "is_active": true,
                        "name": "06"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 21,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Anita Meyers",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 26,
                        "is_active": true,
                        "name": "07"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 21,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Anita Meyers",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 509,
                        "is_active": true,
                        "name": "TEST"
                    }
                ],
                "rate": null,
                "rateplans": [
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "Car Rental included",
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 1,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 123,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": true,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Standard Rooms/Car Rental included/Bed-&-breakfast",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": null,
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 1,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 2001,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": true,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": true,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Standard Rooms/Bed-&-breakfast/Non-ref.",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "WS",
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 3156,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": false,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "001",
                            "name": "Bed only"
                        },
                        "name": "Standard Rooms/WS/Bed-only",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed only",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [
                            {
                                "code": "TEST1",
                                "id": 2,
                                "is_active": null,
                                "name": "Alitalia Cabin Crew",
                                "payment_mode": null,
                                "verification_mode": null
                            }
                        ],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "Breakfast at $7/person",
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 3882,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": true,
                        "meal_plan": {
                            "code": "001",
                            "name": "Bed only"
                        },
                        "name": "Standard Rooms/Breakfast at $7/person/Bed-only/Ali",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed only",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [
                            {
                                "code": "9SCAPPA9",
                                "id": 1,
                                "is_active": null,
                                "name": "scappadays",
                                "payment_mode": null,
                                "verification_mode": null
                            }
                        ],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "massage, dinner, wine",
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 4523,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": true,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Standard Rooms/massage, dinner, wine/Bed-&-breakfast/sca",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    }
                ],
                "size": 25.000,
                "smoking_option": {
                    "allowed_smoking_options": [
                        {
                            "code": "",
                            "description": "No preferences"
                        },
                        {
                            "code": "001",
                            "description": "Smoking"
                        },
                        {
                            "code": "002",
                            "description": "Non-smoking"
                        }
                    ],
                    "code": "001",
                    "description": "Ask"
                }
            },
            {
                "amenities": [
                    {
                        "amenity_type": "room",
                        "code": "jacuzzi",
                        "description": "Jacuzzi"
                    },
                    {
                        "amenity_type": "room",
                        "code": "view",
                        "description": "Scenic view"
                    },
                    {
                        "amenity_type": "room",
                        "code": "terracegrass",
                        "description": "Terrace with grass"
                    },
                    {
                        "amenity_type": "room",
                        "code": "bathroomshared",
                        "description": "Shared bathroom"
                    }
                ],
                "availabilities": null,
                "bedding_setup": [
                    {
                        "code": "kingsizebed",
                        "count": 1,
                        "name": "King size bed"
                    },
                    {
                        "code": "singlebed",
                        "count": 1,
                        "name": "Single bed"
                    }
                ],
                "description": "Large room with sitting area and Jacuzzi",
                "exposed_inventory": null,
                "id": 111,
                "images": [
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_221.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_224.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_251.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_225.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_222.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_236.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_234.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_223.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_231.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_226.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Premium Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_229.jpg"
                    }
                ],
                "inventory": null,
                "is_active": true,
                "is_available_to_book": null,
                "is_bed_configuration_enabled": false,
                "main_image": {
                    "thumbnail": null,
                    "tooltip": "Premium Suites",
                    "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_221.jpg"
                },
                "name": "Premium Suites",
                "not_available_reason": null,
                "occupancy_default": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": null
                },
                "occupancy_max": {
                    "adult_nbr": 5,
                    "children_nbr": 0,
                    "infant_nbr": 0
                },
                "physicalrooms": [
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 21,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Anita Meyers",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 3,
                        "is_active": true,
                        "name": "102"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 8,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Ahmad1",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 4,
                        "is_active": true,
                        "name": "103"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 24,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "ziad noun",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 5,
                        "is_active": true,
                        "name": "104"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 8,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Ahmad1",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 6,
                        "is_active": true,
                        "name": "105"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 24,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "ziad noun",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 1,
                        "is_active": true,
                        "name": "106"
                    }
                ],
                "rate": null,
                "rateplans": [
                    {
                        "agents": [
                            {
                                "code": "9SCAPPA9",
                                "id": 1,
                                "is_active": null,
                                "name": "scappadays",
                                "payment_mode": null,
                                "verification_mode": null
                            }
                        ],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "massage, dinner, wine",
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 3,
                        "extra_bed_rate_per_night": 10.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 124,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": true,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Premium Suites/massage, dinner, wine/Bed-&-breakfast/sca",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [
                            {
                                "code": "9SCAPPA9",
                                "id": 1,
                                "is_active": null,
                                "name": "scappadays",
                                "payment_mode": null,
                                "verification_mode": null
                            },
                            {
                                "code": "TEST1",
                                "id": 2,
                                "is_active": null,
                                "name": "Alitalia Cabin Crew",
                                "payment_mode": null,
                                "verification_mode": null
                            }
                        ],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": null,
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 3,
                        "extra_bed_rate_per_night": 8.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 1946,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": true,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": true,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Premium Suites/Bed-&-breakfast/sca/Ali",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "Breakfast & dinner",
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 3,
                        "extra_bed_rate_per_night": 5.000,
                        "extra_bed_rate_per_night_additional_child": 5,
                        "extra_bed_rate_per_night_first_child": 10,
                        "guarantee": null,
                        "id": 3755,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "003",
                            "name": "Half board"
                        },
                        "name": "Premium Suites/Breakfast & dinner/Half-board",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Half board",
                        "sleeps": 2,
                        "variations": null
                    }
                ],
                "size": 50.000,
                "smoking_option": {
                    "allowed_smoking_options": [
                        {
                            "code": "",
                            "description": "No preferences"
                        },
                        {
                            "code": "001",
                            "description": "Smoking"
                        },
                        {
                            "code": "002",
                            "description": "Non-smoking"
                        }
                    ],
                    "code": "001",
                    "description": "Ask"
                }
            },
            {
                "amenities": [],
                "availabilities": null,
                "bedding_setup": [
                    {
                        "code": "doublebed",
                        "count": 1,
                        "name": "Double bed"
                    }
                ],
                "description": "Luxury Suites with balcony and amenities",
                "exposed_inventory": null,
                "id": 112,
                "images": [
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_224.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_251.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_241.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_239.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_234.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_231.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_226.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "VIP Suites",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_229.jpg"
                    }
                ],
                "inventory": null,
                "is_active": true,
                "is_available_to_book": null,
                "is_bed_configuration_enabled": false,
                "main_image": {
                    "thumbnail": null,
                    "tooltip": "VIP Suites",
                    "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_224.jpg"
                },
                "name": "VIP Suites",
                "not_available_reason": null,
                "occupancy_default": {
                    "adult_nbr": 4,
                    "children_nbr": 0,
                    "infant_nbr": null
                },
                "occupancy_max": {
                    "adult_nbr": 6,
                    "children_nbr": 0,
                    "infant_nbr": 0
                },
                "physicalrooms": [
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": null,
                        "id": 52,
                        "is_active": true,
                        "name": "201"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 21,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Anita Meyers",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 11,
                        "is_active": true,
                        "name": "202"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 25,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "testasdasdadadasdasdasdasdasdasdadasdass",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 53,
                        "is_active": true,
                        "name": "203"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 9,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Najiaa",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 54,
                        "is_active": true,
                        "name": "204"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 9,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Najiaa",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 55,
                        "is_active": true,
                        "name": "205"
                    },
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": {
                            "assigned_units": null,
                            "id": 10,
                            "is_active": false,
                            "is_soft_deleted": false,
                            "mobile": null,
                            "name": "Bassamx Yzzz",
                            "note": null,
                            "password": null,
                            "phone_prefix": null,
                            "property_id": 0,
                            "username": null
                        },
                        "id": 56,
                        "is_active": true,
                        "name": "206"
                    }
                ],
                "rate": null,
                "rateplans": [
                    {
                        "agents": [
                            {
                                "code": "TEST1",
                                "id": 2,
                                "is_active": null,
                                "name": "Alitalia Cabin Crew",
                                "payment_mode": null,
                                "verification_mode": null
                            }
                        ],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "",
                        "extra_bed_for_code": "002",
                        "extra_bed_max": 2,
                        "extra_bed_rate_per_night": 20.000,
                        "extra_bed_rate_per_night_additional_child": 10,
                        "extra_bed_rate_per_night_first_child": 10,
                        "guarantee": null,
                        "id": 4476,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": true,
                        "meal_plan": {
                            "code": "001",
                            "name": "Bed only"
                        },
                        "name": "VIP Suites/Bed-only/Ali",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed only",
                        "sleeps": 4,
                        "variations": null
                    }
                ],
                "size": 75.000,
                "smoking_option": {
                    "allowed_smoking_options": [
                        {
                            "code": "",
                            "description": "No preferences"
                        },
                        {
                            "code": "001",
                            "description": "Smoking"
                        },
                        {
                            "code": "002",
                            "description": "Non-smoking"
                        }
                    ],
                    "code": "001",
                    "description": "Ask"
                }
            },
            {
                "amenities": [
                    {
                        "amenity_type": "room",
                        "code": "cablesatellitetv",
                        "description": "Cable / Satellite TV"
                    },
                    {
                        "amenity_type": "room",
                        "code": "cdplayer",
                        "description": "CD player"
                    },
                    {
                        "amenity_type": "room",
                        "code": "newspaperfree",
                        "description": "Complimentary newspaper"
                    },
                    {
                        "amenity_type": "room",
                        "code": "faxmachine",
                        "description": "Fax machine"
                    },
                    {
                        "amenity_type": "room",
                        "code": "directphone",
                        "description": "Direct-dial phone"
                    },
                    {
                        "amenity_type": "room",
                        "code": "bathtub",
                        "description": "Bathtub"
                    },
                    {
                        "amenity_type": "room",
                        "code": "hairdryeronrequest",
                        "description": "Hair dryer on request"
                    },
                    {
                        "amenity_type": "room",
                        "code": "espressomachine",
                        "description": "Espresso machine"
                    }
                ],
                "availabilities": null,
                "bedding_setup": [
                    {
                        "code": "twinqueenbeds",
                        "count": 4,
                        "name": "Twin queen beds"
                    },
                    {
                        "code": "bunkbeds",
                        "count": 1,
                        "name": "Bunk beds"
                    },
                    {
                        "code": "twindoublechangeable",
                        "count": 1,
                        "name": "Twin/Double changeable beds"
                    },
                    {
                        "code": "sofabed",
                        "count": 6,
                        "name": "Sofa bed"
                    }
                ],
                "description": "",
                "exposed_inventory": null,
                "id": 2352,
                "images": [
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_17204.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_224.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_240.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_234.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_223.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_231.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_256.jpg"
                    },
                    {
                        "thumbnail": "",
                        "tooltip": "Penthouse",
                        "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_229.jpg"
                    }
                ],
                "inventory": null,
                "is_active": true,
                "is_available_to_book": null,
                "is_bed_configuration_enabled": false,
                "main_image": {
                    "thumbnail": null,
                    "tooltip": "Penthouse",
                    "url": "https://dhl6m8m6g2w2j.cloudfront.net/ac/AcImage_42_17204.jpg"
                },
                "name": "Penthouse",
                "not_available_reason": null,
                "occupancy_default": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": null
                },
                "occupancy_max": {
                    "adult_nbr": 2,
                    "children_nbr": 0,
                    "infant_nbr": 0
                },
                "physicalrooms": [
                    {
                        "calendar_cell": null,
                        "hk_status": null,
                        "housekeeper": null,
                        "id": 508,
                        "is_active": true,
                        "name": "P1"
                    }
                ],
                "rate": null,
                "rateplans": [
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "",
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 3766,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Penthouse/Bed-&-breakfast",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "Bone fire express and 30 minutes massage or yoga",
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 3929,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": true,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "006",
                            "name": "All-inclusive"
                        },
                        "name": "Penthouse/Bone fire express and 30 minutes massage or yoga/All-inclusive",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "All-inclusive",
                        "sleeps": 2,
                        "variations": null
                    },
                    {
                        "agents": [],
                        "assignable_units": null,
                        "cancelation": null,
                        "custom_text": "WS",
                        "extra_bed_for_code": "001",
                        "extra_bed_max": 0,
                        "extra_bed_rate_per_night": 0.000,
                        "extra_bed_rate_per_night_additional_child": 0,
                        "extra_bed_rate_per_night_first_child": 0,
                        "guarantee": null,
                        "id": 3942,
                        "is_active": true,
                        "is_available_to_book": false,
                        "is_booking_engine_enabled": false,
                        "is_channel_enabled": false,
                        "is_closed": null,
                        "is_extra_bed_free_for_children": false,
                        "is_non_refundable": false,
                        "is_targeting_travel_agency": false,
                        "meal_plan": {
                            "code": "002",
                            "name": "Bed & breakfast"
                        },
                        "name": "Penthouse/WS/Bed-&-breakfast",
                        "not_available_reason": null,
                        "pre_payment_amount": null,
                        "pre_payment_amount_gross": null,
                        "rate_restrictions": null,
                        "selected_variation": null,
                        "sell_mode": {
                            "code": "001",
                            "description": "Per Room"
                        },
                        "short_name": "Bed & breakfast",
                        "sleeps": 2,
                        "variations": null
                    }
                ],
                "size": 100.000,
                "smoking_option": {
                    "allowed_smoking_options": [
                        {
                            "code": "002",
                            "description": "Non-smoking"
                        }
                    ],
                    "code": "003",
                    "description": "Non smoking"
                }
            }
        ],
        "social_media": [
            {
                "code": "001",
                "link": "https://www.facebook.com/DemoHotel",
                "name": "Facebook"
            },
            {
                "code": "002",
                "link": "https://www.instagram.com/DemoHotel",
                "name": "Instragram"
            },
            {
                "code": "003",
                "link": "",
                "name": "Twitter"
            },
            {
                "code": "004",
                "link": "https://www.youtube.com",
                "name": "YouTube"
            },
            {
                "code": "005",
                "link": "",
                "name": "Skype"
            },
            {
                "code": "006",
                "link": "96170103222",
                "name": "WhatsApp"
            },
            {
                "code": "007",
                "link": "https://www.tripadvisor.com",
                "name": "Trip Advisor"
            }
        ],
        "sources": [
            {
                "code": "Direct | manual",
                "description": "Direct | manual"
            },
            {
                "code": "Direct | website",
                "description": "Direct | website"
            }
        ],
        "space_theme": {
            "background_image": "https://gateway.igloorooms.com/irimages/acbg/AcBg_42.jpg?t=1595742815420",
            "button_bg_color": "af1f2f",
            "button_border_radius": "28",
            "favicon": "https://gateway.igloorooms.com/irimages/acfavicon/AcFavicon_42.png",
            "heading_bar_color": "949494",
            "heading_font_color": "FFFFFF",
            "logo": "https://gateway.igloorooms.com/irimages/aclogo/AcLogo_42.png",
            "website": "www.demo.igloospace.com"
        },
        "tags": [
            {
                "key": "conversion",
                "value": " <!-- Event snippet to record bookings -->\\n<script>\\n  gtag('event', 'sales', {\\n      'value': $$total_price$$,\\n      'currency': '$$cur_code$$',\\n      'booking_no': '$$booking_xref$$'\\n  });\\n<\\/script>"
            },
            {
                "key": "header",
                "value": "<script>\nconsole.log(\"hello world from header tag\")\n</script>"
            },
            {
                "key": "body",
                "value": ""
            },
            {
                "key": "footer",
                "value": ""
            },
            {
                "key": "css",
                "value": ""
            }
        ],
        "tax_nbr": "DEMO8998",
        "tax_statement": "Excluding 11.00% V.A.T - Including 5.00% City tax",
        "taxation_strategy": {
            "code": "001",
            "description": "Cumulative"
        },
        "taxes": [
            {
                "is_exlusive": true,
                "name": "V.A.T",
                "pct": 11.000
            },
            {
                "is_exlusive": false,
                "name": "City tax",
                "pct": 5.000
            }
        ],
        "time_constraints": {
            "booking_cutoff": "16:30",
            "check_in_from": "14:00",
            "check_in_till": "24:00",
            "check_out_till": "12:00"
        }
    },
    locales: {
        "AVAILABLE_ROOM": "%1 left",
        "CANC_HI_AFTER_PENALITY_CODE": "%1 (of the total price will be charged) if cancelled after %2.",
        "CANC_HI_BEFORE_DAYS": "%1 (of the total price will be charged) if cancelled before  %2",
        "CANC_HI_LATER_PENALITY_CODE": "%1 will be charged if cancelled after %2 or in case of no show.",
        "CANC_HI_NOFEEDAYS": "Free cancellation before %1.",
        "CANC_LOW_AFTER_PENALITY_CODE": "%1 (of the total price will be charged) if cancelled after %2.",
        "CANC_LOW_BEFORE_DAYS": "%1 (of the total price will be charged) if cancelled before  %2.",
        "CANC_LOW_LATER_PENALITY_CODE": "%1 will be charged if cancelled after %2 or in case of no show.",
        "CANC_LOW_NOFEEDAYS": "Free cancellation before %1.",
        "EXTRA_BEDS": "Extra persons:",
        "FOOD_INCLUDED": "Included",
        "FREE_CANCELATION": "Free cancellation.",
        "KIND_REGARDS": "Kind regards",
        "LAST_ROOM": "Last room",
        "Lcz_AboutUs": "About",
        "Lcz_AcceptedCreditCards": "Accepted credit cards at the property",
        "Lcz_Accommodations": "Accommodations",
        "Lcz_Activate": "Activate",
        "Lcz_ActivateDiscountByPromoCode": "Activate your loyalty discount",
        "Lcz_ActivateLoyaltyDiscount": "Activate your loyalty discount",
        "Lcz_Activities": "Activities",
        "Lcz_Add": "Add",
        "Lcz_Address": "Address",
        "Lcz_Adult": "Adult",
        "Lcz_Adults": "Adults",
        "Lcz_Affiliation": "Affiliation",
        "Lcz_Age_X_Plus": "Age {0}+",
        "Lcz_Age_X_Y": "Age {0}-{1}",
        "Lcz_AgentCode": "Agent code",
        "Lcz_And": "And",
        "Lcz_AnEmailHasBeenSentTo": "An email has been sent to",
        "Lcz_Apply": "Apply",
        "Lcz_Arrival_Time": "Arrival time",
        "Lcz_ArrivalDate": "Arrival date",
        "Lcz_At": "At",
        "Lcz_BackToLoginScreen": "Back to login screen",
        "Lcz_BackToMainScreen": "Back to main screen",
        "Lcz_BankTransfer": "Bank or money transfer",
        "Lcz_BedTypes": "Bed types",
        "Lcz_BookDirectlyWithUs": "Book directly with us",
        "Lcz_BookedBy": "Booked by",
        "Lcz_BookedOn": "Booked On",
        "Lcz_BookFasterBySignIn": "Book faster by signing in",
        "Lcz_BookFrom_X_Y": "Book from {0}{1}",
        "Lcz_Booking_details": "Booking Details",
        "Lcz_BookingCancellationPolicy": "Booking cancellation policy",
        "Lcz_BookingCancelled": "Booking Cancelled",
        "Lcz_BookingConditions": "Special Conditions",
        "Lcz_BookingDate": "Booking date",
        "Lcz_BookingFAQ": "Booking FAQ",
        "Lcz_BookingNb": "Booking reference",
        "Lcz_BookingSource": "Booking Source",
        "Lcz_BookNow": "Book now",
        "Lcz_BookNowWith_X": "Book now with {0}",
        "Lcz_BookTheseRooms": "Confirm booking",
        "Lcz_CanBeBookedLater": "(Add in next step)",
        "Lcz_Cancel": "Cancel",
        "Lcz_CancelAndPrepay": "Cancellation and prepayment",
        "Lcz_CancelationPenalty": "Cancellation Penalty",
        "Lcz_Cancellation": "Cancellation",
        "Lcz_CancellationDetails": "Cancellation Details",
        "Lcz_CancellationForBooking": "Cancellation for booking",
        "Lcz_CancPrepaySentence": "The cancellation policy appears next to each room type after entering your dates.",
        "Lcz_CardHolderName": "Card holder name",
        "Lcz_ChangeCurrency": "Change currency",
        "Lcz_ChangeDates": "Change search",
        "Lcz_ChangeDetails": "Change details",
        "Lcz_ChangeLanguage": "Change language",
        "Lcz_ChannelName": "Channel Name",
        "Lcz_CheckAvailability": "Check availability",
        "Lcz_CheckBooking": "Check booking",
        "Lcz_CheckIn": "Check-in",
        "Lcz_CheckinStartsAt_X": "Check in time starts at {0}",
        "Lcz_CheckOut": "Check-out",
        "Lcz_Child": "Child",
        "Lcz_Children": "Children",
        "Lcz_ChooseYourDatesFirst": "Choose your dates<br>and book in 1 minute",
        "Lcz_City": "City",
        "Lcz_CityTax": "City Tax",
        "Lcz_Clear": "Clear",
        "Lcz_Close": "Close",
        "Lcz_Conditions": "Cancellation conditions",
        "Lcz_ConfirmBookingByPaying_X_Y": "Confirm booking by paying {0} {1}",
        "Lcz_ConfirmYourEmail": "Confirm your email",
        "Lcz_ContinueToPayment": "Continue",
        "Lcz_Copyright": "© 2021 igloorooms.com. All rights reserved. Worldwide unique hotels reservations.",
        "Lcz_Country": "Country",
        "Lcz_CountryCode": "Country code",
        "Lcz_CreateMyAccount": "Create my account",
        "Lcz_CreditCardNb": "Card number",
        "Lcz_CreditCardType": "Card type",
        "Lcz_CVC": "CVC",
        "Lcz_CVC_Tooltip": "For MasterCard, Visa or Discover, it's the last three digits in the signature area on the back of your card. For American Express, it's the four digits on the front of the card.",
        "Lcz_Day": "Day",
        "Lcz_Days": "Days",
        "Lcz_DepartingCityAndFlightNo": "Departing city and flight no",
        "Lcz_DiscountActivated": "Discount activated",
        "Lcz_DiscountsOn_X_Y": "Discounts on {0} {1}",
        "Lcz_Done": "Done",
        "Lcz_Duration": "Duration",
        "Lcz_Email": "Email",
        "Lcz_EmailAddress": "Email address",
        "Lcz_EmailTheGuest": "Email the guest",
        "Lcz_ErrorOccured": "Ooops!",
        "Lcz_Excluding": "Excluding",
        "Lcz_ExpiryDate": "Expiry date",
        "Lcz_ExpiryMonth": "Expiry month",
        "Lcz_ExpiryYear": "Expiry year",
        "Lcz_Exrtra_Capacity": "extra capacity is",
        "Lcz_ExtraBed": "Extra persons",
        "Lcz_FacilitiesAndPoliciesAt_X_Hotel": "Facilities and policies at {0}",
        "Lcz_FirstName": "First name",
        "Lcz_FlightDetails": "Flight details",
        "Lcz_FoodAndBeverage": "Food and beverage",
        "Lcz_For": "For",
        "Lcz_For_Older_Ages": "for older ages",
        "Lcz_ForFasterBookingNextTime": "For faster booking next time",
        "Lcz_ForgotPassword": "Forgot password",
        "Lcz_ForgotPasswordText": "Please enter your e-mail address below, and we will send you the password via email.",
        "Lcz_ForOlderAges": "for older ages",
        "Lcz_ForSupportCall_X": "For support call {0}",
        "Lcz_Free": "Free",
        "Lcz_Free_For_Children_Up": "free for children up to {0}",
        "Lcz_FreeExtraBed": "Free accommodation",
        "Lcz_FreeExtraBedFor_X": "Free {0}",
        "Lcz_FreeExtraBedFor_X_UpTo_Y_Years": "Free {0} up to {1} yrs",
        "Lcz_FreeInternet": "Free Internet",
        "Lcz_FreeWiFi": "Free Wi-Fi",
        "Lcz_From": "from",
        "Lcz_GPS": "GPS",
        "Lcz_GuaranteeYourReservation": "Guarantee your reservation",
        "Lcz_Guest": "Guest",
        "Lcz_Guests": "Guests",
        "Lcz_GuestService": "Guest Service",
        "Lcz_GuestService_ContactUs": "Contact us anytime by email <b>{0}</b> or call us on <b>{1}</b>.<br><a style=\"text-decoration:none\" href=\"https://[PERMALINK].bookingmystay.com/signin\"><b>Click here</b> to manage your booking.</a>",
        "Lcz_GuestService_WishGoodNight": "Wishing you goodnight",
        "Lcz_Hi_X": "Hi {0}!",
        "Lcz_Home": "Home",
        "Lcz_HoorayYourBookingIsNow": "Hooray! Your booking is now confirmed",
        "Lcz_HoorayYourBookingIsPending": "Your booking will shortly be confirmed",
        "Lcz_HotelBaseCurrency": "Base",
        "Lcz_HotelPolicies": "Hotel Policies",
        "Lcz_Hour": "Hour",
        "Lcz_Hours": "Hours",
        "Lcz_IAgreeWithThe": "I agree with the",
        "Lcz_Including": "Including",
        "Lcz_InternetNotAvailable": "Internet not available",
        "Lcz_InvalidCode": "Invalid code",
        "Lcz_JustInCase": "Just in case",
        "Lcz_Last_Bookable_Reminder": "You risk losing bookings",
        "Lcz_LastMinute": "Last minute",
        "Lcz_LastName": "Last name",
        "Lcz_Latitude": "Latitude",
        "Lcz_Loading": "Loading...",
        "Lcz_Location": "Location",
        "Lcz_LogIn": "Log in",
        "Lcz_Longitude": "Longitude",
        "Lcz_Look_forward": "We look forward to welcoming you at",
        "Lcz_LowestPrice": "Lowest price",
        "Lcz_LoyaltyDiscountActivated": "Loyalty discount activated",
        "Lcz_MakeYourReservation": "Make your reservation",
        "Lcz_ManageOneSignleBooking": "Booking number to manage one single booking",
        "Lcz_ManageYourBooking": "Manage your booking",
        "Lcz_Map": "Map it",
        "Lcz_MAP_IT": "Map it",
        "Lcz_MapIt": "Map it",
        "Lcz_MAX_NIGHTS": "This property cannot be booked online for more than {0} nights. Please send your inquiry by email.",
        "Lcz_MaxCapacity": "Max. capacity",
        "Lcz_MessageToHotel": "Any message for us?",
        "Lcz_Midnight": "Midnight",
        "Lcz_Minute": "Minute",
        "Lcz_Minutes": "Minutes",
        "Lcz_MLS_Alert": "Min. stay {0} nights",
        "Lcz_MobilePhoneNb": "Mobile phone",
        "Lcz_Modification": "Modification",
        "Lcz_ModifyCancelBooking": "Manage Booking",
        "Lcz_MostRecentBooking_X_Y_Z": "Most recent booking: {0} {1} ago from {2}",
        "Lcz_MyAccount": "Modify Booking",
        "Lcz_MyBookings": "My bookings",
        "Lcz_NbOfUnits": "Number of units",
        "Lcz_NearbyHotelsTo_X": "Nearby hotels to \"{0}\"",
        "Lcz_Nearest_Release": "till",
        "Lcz_NeedPickup": "Need Pickup?",
        "Lcz_NewReservation": "New Reservation",
        "Lcz_Night": "night",
        "Lcz_Nights": "nights",
        "Lcz_NO_RATE_PLAN_FOR_TA": "No Rate Plans available for travel agencies!",
        "Lcz_NoBookingFees": "No booking fees",
        "Lcz_NoCreditCardAcceptedOnlyCash": "No credit cards accepted, only cash",
        "Lcz_NonRefundable": "Non-refundable",
        "Lcz_NoOfPersons": "No. of persons",
        "Lcz_NoOfVehicles": "No. of vehicles",
        "Lcz_Noon": "Noon",
        "Lcz_NoPreference": "No preference",
        "Lcz_NoRecordsFound": "No records found !",
        "Lcz_NotAvailable": "Not available",
        "Lcz_NoThankYou": "No thank you",
        "Lcz_Ok": "Ok",
        "Lcz_OnlyGuestIsAllowedToLogin": "Only guest user is allowed to login",
        "Lcz_Optional": "Optional",
        "Lcz_OptionalMeals": "Optional meals",
        "Lcz_Or": "or",
        "Lcz_Password": "Password",
        "Lcz_Payment_FullyPaid": "Payment will be taken by the hotel.",
        "Lcz_Payment_NotFullyPaid": "The balance will be taken upon your arrival.",
        "Lcz_Payment_OfflineCreditCard": " Payment might be requested according to the property's pre-payment policy and based on your selected payment method.",
        "Lcz_Payment_Reminder": "Payment Reminder of %1",
        "Lcz_Payment_Reminder_Description": "Hello [finance name],<br><br>  This is an automated email to notify about a due payment of [amount] for renewal of your igloorooms license. Kindly get in touch with your account manager for settlement or reply directly to this email.  <br><br>  In case you already paid your balance, please disregard this message until we update our system.  ",
        "Lcz_PaymentDetails": "Payment Details",
        "Lcz_Person": "Person",
        "Lcz_PersonalProfile": "Personal profile",
        "Lcz_Persons": "Persons",
        "Lcz_Phone": "Phone",
        "Lcz_PlzProvideToHotel": "Please provide to hotel once available",
        "Lcz_PlzSelectNbrOfGuests": "Please select the number of guests",
        "Lcz_PopupMsg_BookingNotValid": "The booking is not valid anymore. Please change your dates.",
        "Lcz_PopupMsg_ChangeDates_Error_Desc": "We could not process your request.<br/>Your room selection is no longer available on these dates.<br/>Please change the dates for your selected rooms.",
        "Lcz_PopupMsg_ConfirmRequestBookingCancellation": "Are you sure you want to proceed with cancellation?",
        "Lcz_PopupMsg_ForgotPassword": "Thank you. An email will be sent to you containing your password.",
        "Lcz_PopupMsg_RequestBookingCancellation": "Thank you. The hotel has been notified and will email you back if necessary.",
        "Lcz_Prepay_NonRefundable": "The total price of the reservation may be charged anytime after booking",
        "Lcz_Prepayment": "Guarantee",
        "Lcz_PriceFor": "Price for",
        "Lcz_PriceFor_X_Nights": "Price for {0} {1}",
        "Lcz_PricePerNight": "price/night",
        "Lcz_PrintPage": "Print page",
        "Lcz_PrivacyPolicy": "Privacy Policy",
        "Lcz_PrivacyPolicyLabel": "I agree to the <a id=\"Lnk_PrivacyPolicy\" href=\"javascript:void(0)\" class=\"irbold\">privacy policy</a>",
        "Lcz_PrivacyPolicyNotification": "You must accept the <b>privacy policy</b> first",
        "Lcz_PrivacyPolicyText": "<h2><strong>Information and Consent</strong></h2><p>This&nbsp;Privacy Policy&nbsp;describes how we collect, use, process, and disclose your information, including personal information about you (hereinafter, the \"User\"), in conjunction with your access to and use of our booking system.</p><p>By reading this Privacy Policy, the user is hereby informed on how we collect, process and protect personal data furnished through the booking engine.</p><p>The User must carefully read this Privacy Policy to determine whether they wish to provide their personal data, or those of third parties, to <b>[AC_NAME]</b>.</p><p>When this policy mentions \"booking system\", \"booking engine\", \"system\", \"website\", \"platform\", \"app\", \"webapp\", \"services\" or \"online services\" it refers to all pages and functions under <b>[URL]</b> unless specified otherwise.</p><p>By accessing the platform or providing information, you agree to our privacy practices as set out in this privacy statement. We may change this policy from time to time. You should check this policy to ensure you are aware of the most recent version.</p><h2><strong>Identity</strong></h2><p>When this policy mentions \"we\", \"us\", \"our\", \"data controller\" or \"controller\" it refers to the&nbsp;<b>[AC_NAME]</b>.</p><h3><strong>Data Controller</strong></h3><p><b>[AC_NAME]</b> operates this booking system through a data processor, as explained below. For the purposes of the General Data Protection Regulation (\"GDPR\")&nbsp;<a href=\"https://ec.europa.eu/info/files/regulation-eu-2016-679-protection-natural-persons-regard-processing-personal-data-and-free-movement-such-data_en\" target=\"_new\">(EU) 2016/679</a>, we are the Data Controller. There is a strict contractual framework between the data controller and the data processor for the protection of your personal information. We are:</p><p></p><div><b>[AC_NAME]</b></div><div><b>[ADDRESS]</b></div><div><b>[AREA]</b></div><div><b>[LEVEL2]</b></div><div><b>[COUNTRY]</b></div><p></p><h3><strong>Data Processor</strong></h3><p>A third-party Data Processor operates this booking system on behalf of&nbsp;<b>[AC_NAME]</b> and is committed to protecting the privacy of the users of this system.</p><p>For the purposes of the GDPR, this third-party is the Data Processor.</p><h2><strong>Obligatory nature of providing the data</strong></h2><p>The data requested in the forms accessible from the booking engine are, in general, mandatory (unless specified otherwise in the required field) to meet the stated purposes. Accordingly, if they are not provided or are not provided correctly, we will be unable to process the request.</p><h2><strong>Personal data we collect and process</strong></h2><p><strong>This will include:</strong></p><ul><li>personal information about you which we ask you for (e.g. your name, address, and email address) when you make a booking from our booking engine;</li><li>financial details in order to process your booking when we require pre-payment;</li><li>details of transactions you carry out through our booking engine and details of the fulfilment of your orders.</li><li>our data processor may only collect and process personal data collected and/or processed on behalf of us in accordance with our instructions.</li></ul><p><strong>We grant permission to our data processor:</strong></p><ul><li>to use your personal information for reserving rooms and/or other services for you at&nbsp;<b>[AC_NAME]</b></li><li>to pass on your financial details to <b>[AC_NAME]</b> and/or appropriate third party (for example, credit card company) for the purpose of confirming or paying for a booking;</li><li>to use your information for marketing purposes (where you explicitly agree to this); and</li><li>to pre-complete forms and other details on our website to make your next visit to our booking engine easier (e.g. when amending or cancelling a booking).</li></ul><p><strong>Social Login:</strong></p><p>In the event of registration and/or access through a third-party account, we may collect and access certain information of the User’s profile from the corresponding social network, solely for internal administrative purposes and/or for the purposes indicated above.</p><p><strong>Third-party data (e.g. book for a friend)</strong></p><p>In the event that the User provides third-party data, they declare that they have the third party’s consent and undertake to provide the interested party -the data holder- with the information contained in this Privacy Policy, duly exonerating us and our data processor from any liability in this regard. However, we may carry out the necessary verifications to verify this fact, adopting the corresponding due diligence measures, in accordance with the data protection regulations.</p><p><strong>Sensitive Data</strong></p><p>Unless specifically requested, we ask that you not send us, and you not disclose, on or through the Services or otherwise to us, any Sensitive Personal Data (e.g., social security numbers, national identification number, data related to racial or ethnic origin, political opinions, religion, ideological or other beliefs, health, biometrics or genetic characteristics, criminal background, trade union membership, or administrative or criminal proceedings and sanctions).</p><p><strong>Use of Services by Minors</strong></p><p>The Services are not directed to individuals under the age of sixteen (16), and we request that they not provide Personal Data through the Services.</p><h2><strong>Purpose of processing personal data</strong></h2><p>Depending on the User’s requests, the personal data collected will be processed in accordance with the following purposes:</p><ul><li>To manage the bookings made, including payment management (where applicable) and the management of the user’s requests and preferences.</li><li>To manage registration in loyalty or membership programs, as well as obtaining and redeeming points.</li><li>To manage the User’s contact requests with us through the channels provided to this end.</li><li>To manage the sending of personalised commercial communications from us, by electronic and/or conventional means, in cases in which the User expressly consents.</li><li>To manage the provision of the contracted accommodation service, as well as additional services.</li><li>To manage surveys and/or evaluations regarding the quality of the services provided by us and/or the perception of its image as a company.</li></ul><h2><strong>Data Retention</strong></h2><p>We will retain your Personal Data for the period necessary to fulfil the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law or if the User requests their withdrawal from us, opposes or revokes their consent.</p><p>The criteria used to determine our retention periods include:</p><ul><li>The length of time we have an ongoing relationship with you and provide the Services to you (for example, for as long as you have an account with us or keep using the Services or if you have a booking that has not yet been fulfilled)</li><li>Whether there is a legal obligation to which we are subject (for example, certain laws require us to keep records of your transactions for a certain period of time before we can delete them)</li><li>Whether retention is advisable considering our legal position (such as, for statutes of limitations, litigation or regulatory investigations)</li></ul><h2><strong>Legitimate interest for processing your data</strong></h2><p>The data processing required in fulfilment of the aforementioned purposes that require the User’s consent cannot be undertaken without said consent.</p><p>Likewise, in the event that the User withdraws their consent to any of the processing, this will not affect the legality of the processing carried out previously.</p><p>To revoke such consent, the User may contact us through the appropriate channels.</p><p>By the same token, in those cases in which it is necessary to process the User’s data for the fulfilment of a legal obligation or for the execution of the existing contractual relationship between us and the User, the processing would be legitimized as it is necessary for compliance with said purposes.</p><h2><strong>Data Disclosure</strong></h2><p>We will use and disclose Personal Data as we believe to be necessary or appropriate:</p><ul><li>to comply with applicable law, including laws outside your country of residence;</li><li>to comply with legal process;</li><li>to respond to requests from public and government authorities, including authorities outside your country of residence and to meet national security or law enforcement requirements;</li><li>to enforce our terms and conditions;</li><li>to protect our operations;</li><li>to protect the rights, privacy, safety or property of our own, you or others; and</li><li>to allow us to pursue available remedies or limit the damages that we may sustain.</li></ul><p>We may use and disclose Other Data for any purpose, except where we are not allowed to under applicable law. In some instances, we may combine Other Data with Personal Data (such as combining your name with your location). If we do, we will treat the combined data as Personal Data as long as it is combined.</p><h2><strong>International transfers of personal data</strong></h2><p>We may transfer your personal information to our data processor(s) or/and sub-processor(s) based outside of the EEA for the purposes described in this policy. If we do this, your personal information will continue to be subject to one or more appropriate safeguards set out in the law. These might be the use of model contracts in a form approved by regulators, or having our suppliers sign up to an independent privacy scheme approved by regulators (like the US <a href=\"https://www.privacyshield.gov/\">Privacy Shield</a> scheme).</p><h2><strong>User's Responsibility</strong></h2><p>The User:</p><p>Guarantees that they are of legal age or legally emancipated, where applicable, fully capable, and that the information furnished to us is true, accurate, complete and up-to-date. For these purposes, the User is responsible for the truthfulness of all the data communicated and will keep the information updated, so that said data reflects their actual situation.</p><p>Guarantees that he/she has informed third parties on whose behalf he/she has provided data, where applicable, of the aspects contained in this document. Also guarantees that he/she has obtained the third party’s authorisation to provide their data to us for the purposes indicated.</p><p>Will be responsible for false or inaccurate information provided through the Website and for damages, whether direct or indirect, that this may cause to us or third parties.</p><h2><strong>Exercise of Rights and Data Deletion</strong></h2><p>The User may contact us at any time free of charge by emailing support@igloorooms.com and providing his unique account email, to:</p><ul><li>To obtain confirmation about whether or not personal data concerning the User are being processed by us.</li><li>To access their personal details.</li><li>To rectify any inaccurate or incomplete data.</li><li>To request the deletion of their personal data when, among other reasons, the data are no longer necessary for the purposes for which they were collected.</li><li>To confirm revocation of consent.</li><li>To obtain from us the limitation of data processing when any of the conditions provided in the data protection regulations are met.</li><li>To request the portability of your data.</li></ul><p>Likewise, the user is informed that at any time he/she may file a complaint regarding the protection of their personal data before the competent Data Protection Authority.</p><h2><strong>Security Measures</strong></h2><p>We will process the User’s data at all times in an absolute confidential way and maintaining the mandatory duty to secrecy with regard to said data, in accordance with the provisions set out in applicable regulations, and to this end adopting the measures of a technical and organisational nature required to guarantee the security of their data and prevent them from being altered, lost, processed or accessed illegally, depending on the state of the technology, the nature of the stored data and the risks to which they are exposed.</p>",
        "Lcz_PropertyFacilities": "Property facilities",
        "Lcz_PublicAreas": "Public areas",
        "Lcz_RegisterForExclusiveDeals": "Register for exclusive deals",
        "Lcz_Remove": "Remove",
        "Lcz_RequestBookingCancellation": "Cancellation Request",
        "Lcz_RequiredCapacity": "Required capacity",
        "Lcz_RetryPayment": "Retry payment",
        "Lcz_Room": "Room",
        "Lcz_RoomFacilities": "Room facilities",
        "Lcz_Rooms": "Rooms",
        "Lcz_RoomSize_X": "Room size: {0} square meters",
        "Lcz_RoomTypes": "Accommodation types",
        "Lcz_Save": "Save",
        "Lcz_Saved": "Saved!",
        "Lcz_SecureOnlineBooking": "Secure online booking with immediate confirmation.",
        "Lcz_Select": "Select",
        "Lcz_SelectPaymentMethod": "Payment method",
        "Lcz_Send": "Send",
        "Lcz_ServiceCharge": "Service Charge",
        "Lcz_Services": "Services",
        "Lcz_SignIn": "Sign in",
        "Lcz_SignInWithFacebook": "Sign in with Facebook",
        "Lcz_SignInWithFacebookText": "Please Sign in to facebook outside this app then re-click this button",
        "Lcz_SignInWithGoogle": "Sign in with Google",
        "Lcz_SignOut": "Sign out",
        "Lcz_SignUp": "Sign up",
        "Lcz_SuccessfulPayment": "Successful payment",
        "Lcz_Taxes": "Taxes",
        "Lcz_Terms": "Terms of use",
        "Lcz_THOUGHT_OF_YOU": "We thought of reminding you that you are soon arriving to our hotel.",
        "Lcz_Time": "Time",
        "Lcz_To": "To",
        "Lcz_Total_price": "Total Price",
        "Lcz_TotalPrice": "Total price",
        "Lcz_UnSuccessfulPayment": "Unsuccessful payment",
        "Lcz_Until": "until",
        "Lcz_UseHotelLangOrEng": "Have infants? Special requests?",
        "Lcz_ValidationMsg_CreditCardType": "Card type & card number do not match",
        "Lcz_VAT": "VAT",
        "Lcz_WeAreSoldOutSentence": "<span class=\"irfontred\">We're sold out on your dates.</span> These dates are still available:",
        "Lcz_Website": "Website",
        "Lcz_When_Exceeding": "When exceeding {0} persons,",
        "Lcz_WithLuggage": "with luggage",
        "Lcz_WorkWithUs": "Work with us",
        "Lcz_X_HotelRecommendations": "{0} hotel recommendations",
        "Lcz_X_RoomsSelected": "{0} {1} selected",
        "Lcz_X_UpTo_Y_Years": "{0} up to {1} years",
        "Lcz_Yes": "Yes",
        "Lcz_Yes_From_X": "Yes, from {0}",
        "Lcz_YouAreBooking_X": "You are booking {0}",
        "Lcz_YouHaveBeenCharged_X_Y": "You have been charged {0} {1}",
        "Lcz_YourArrivalTime": "Your arrival time",
        "Lcz_YourBookingIsGuaranteed": "Your booking is guaranteed.",
        "Lcz_YourBookingIsNotGuaranteed": "Your booking request will shortly be processed by the property and you will receive a confirmation by email. Please do not make additional reservations until you hear back from us.",
        "Lcz_YourDates": "Your dates",
        "Lcz_YourEmail": "Your email",
        "Lcz_YourPromoCode": "Your promo code",
        "LEFT_ROOM": "%1 left",
        "MEAL_UPGRADABLE": "Meal can be upgraded",
        "PAY_LATER": "Pay later.",
        "POWERED_BY": "<a href=\"https://info.igloorooms.com\">Powered by igloorooms Cloud Booking Solutions [GHS]</a>",
        "SLEEPS": "Sleeps"
    }
    , lang: "en",
}
