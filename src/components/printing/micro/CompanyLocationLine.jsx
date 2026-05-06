export default function CompanyLocationLine({ company }) {
    const { postal, city, country } = company;
    if (!postal && !city && !country) return null;
    const location = [];
    if (postal) location.push(postal);
    if (city) location.push(city);
    if (country) {
        if (postal || city) {
            location.push(`,${country.name}`);
        } else {
            location.push(company.name);
        }
    }
    if (location.length === 0) return null;
    return <p className="font-regular">{location.join(" ")}</p>;
}
