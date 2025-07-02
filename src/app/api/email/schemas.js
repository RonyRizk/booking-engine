const { z } = require("zod");

const LanguageSchema = z.optional(z.string().length(2)).default('en');
const BookingSchema =
    z.object({
        id: z.coerce.number().min(3),
        aname: z.string().min(3),
        lang: LanguageSchema
    })

const BookingCHMSchema = z.object({
    ota_name: z.string().min(3),
    ota_url: z.optional(z.string()),
    operation: z.enum(["COMMIT", "MODIFY", 'CANCEL']),
    booking_details_url: z.optional(z.string().min(3))
})

const AutoEmailSchema = BookingSchema.extend({
    mode: z.enum(["pre", "post", "during"])
});

export { BookingSchema, BookingCHMSchema, AutoEmailSchema, LanguageSchema }
