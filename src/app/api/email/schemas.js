const { z } = require("zod");

const LanguageSchema = z.optional(z.string().length(2)).default('en');
const BaseSchema = z.object({
    aname: z.string().min(2),
    lang: LanguageSchema
})
const BookingSchema =
    BaseSchema.extend({
        id: z.string().min(3),
    })

const BookingCHMSchema = z.object({
    ota_name: z.optional(z.string().min(3)).nullable(),
    ota_url: z.optional(z.string()).nullable(),
    operation: z.enum(["COMMIT", "MODIFY", 'CANCEL']),
    booking_details_url: z.optional(z.string().min(3))
})

const AutoEmailSchema = BookingSchema.extend({
    mode: z.enum(["pre", "post", "during"])
});
const OTPEmailSchema = z.object({
    otp: z.string().min(4),
    geo: z.optional(z.any()),
    name: z.string().nonempty()
})

const VerifyEmailSchema = z.object({
    url: z.string().url(),
    name: z.string().min(3),
    lang: LanguageSchema
})

const PMSFailoverSchema = z.object({
    reason: z.string().min(1, "Reason is required")
});

const PMSFailoverQuerySchema = z.object({
    id: z.string().min(3, "Booking ID must be at least 3 characters"),
    aname: z.string().min(3, "Property name must be at least 3 characters"),
    lang: z.string().length(2, "Language must be 2 characters").default('en')
});

export { BaseSchema, BookingSchema, BookingCHMSchema, AutoEmailSchema, LanguageSchema, OTPEmailSchema, VerifyEmailSchema, PMSFailoverQuerySchema, PMSFailoverSchema }
