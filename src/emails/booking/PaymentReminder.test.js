import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { render } from "@react-email/components";
import PaymentReminderEmail from "./PaymentReminder";
import { createLabels, EMAIL_LABELS } from "@/lib/labels";
import { directBooking } from "@/test/fixtures/bookings";
import { visibleText } from "@/test/helpers/render";

const renderEmail = ({ data = directBooking(), lang = "en", bundle = null } = {}) =>
    render(createElement(PaymentReminderEmail, { ...data, dueAmount: 250.5, i18n: createLabels(EMAIL_LABELS, lang, bundle) }));

describe("PaymentReminderEmail", () => {
    test("greets the guest and shows the due amount in the hotel currency", async () => {
        const text = visibleText(await renderEmail());

        expect(text).toContain("Dear Test Test,");
        expect(text).toContain("You have a due payment of US$ 250.50 to settle for your upcoming stay in igloorooms Demo Hotel.");
    });

    test("the button opens the booking's payment page in the email's language, with the guest's email encoded", async () => {
        const data = directBooking();
        data.booking.guest.email = "ron+test@outlook.com";

        const html = await renderEmail({ data, lang: "fr" });

        expect(html).toContain(`href="https://iglooroomsdemohotel.bookingmystay.com/booked?b=80347800505&amp;e=ron%2Btest%40outlook.com&amp;lang=fr&amp;mode=payment"`);
    });

    describe("on a deployment with its own site domain", () => {
        const savedSiteDomain = process.env.SITE_DOMAIN;
        afterEach(() => {
            if (savedSiteDomain === undefined) delete process.env.SITE_DOMAIN;
            else process.env.SITE_DOMAIN = savedSiteDomain;
        });

        test("both buttons link to the property's site on that domain", async () => {
            process.env.SITE_DOMAIN = "test.bookingmystay.com";

            const html = await renderEmail();

            expect(html).toContain(`href="https://iglooroomsdemohotel.test.bookingmystay.com/booked?b=80347800505&amp;`);
            expect(html).toContain(`href="https://iglooroomsdemohotel.test.bookingmystay.com/signin"`);
            expect(html).not.toContain("://iglooroomsdemohotel.bookingmystay.com");
        });
    });

    test("renders its texts from the language's labels", async () => {
        const bundle = {
            entries: {
                Lcz_DearX: "Cher %1,",
                Lcz_PaymentReminderDue: "Vous avez un paiement de %1 à régler pour votre séjour à %2.",
                Lcz_SignInToYourAccount: "Se connecter",
            },
        };

        const text = visibleText(await renderEmail({ lang: "fr", bundle }));

        expect(text).toContain("Cher Test Test,");
        expect(text).toContain("Vous avez un paiement de US$ 250.50 à régler pour votre séjour à igloorooms Demo Hotel.");
        expect(text).toContain("Se connecter");
    });
});
