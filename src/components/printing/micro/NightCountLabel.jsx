export default function NightCountLabel({ totalNights, locales }) {
    return (
        <p className="number-of-nights">
            {totalNights} {totalNights === 1 ? locales?.Lcz_night : locales?.Lcz_nights}
        </p>
    );
}
