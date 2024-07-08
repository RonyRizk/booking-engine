import InvoicePage from "../../../components/InvoicePage";
import React from "react";

export async function generateMetadata({ params, searchParams }, parent) {
  // const res = await fetch("https://gateway.igloorooms.com/IR/Get_Exposed_Property?Ticket=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTgwODkzMTUsIkNMQUlNLTAxIjoiOGJpaUdjK21FQVE9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6Ilp3Tys5azJoTzUwPSIsIkNMQUlNLTA0IjoicUxHWllZcVA3SzB5aENrRTFaY0tENm5TeFowNkEvQ2lPc1JrWUpYTHFhTEF5M3N0akltbU9CWkdDb080dDRyNVRiWjkxYnZQelFIQ2c1YlBGU2J3cm5HdjNsNjVVcjVLT3RnMmZQVWFnNHNEYmE3WTJkMDF4RGpDWUs2SFlGREhkcTFYTzBLdTVtd0NKeU5rWDFSeWZmSnhJdWdtZFBUeTZPWjk0RUVjYTJleWVSVzZFa0pYMnhCZzFNdnJ3aFRKRHF1cUxzaUxvZ3I0UFU5Y2x0MjdnQ2tJZlJzZ2lZbnpOK2szclZnTUdsQTUvWjRHekJWcHl3a0dqcWlpa0M5T0owWFUrdWJJM1dzNmNvSWEwSks4SWRqVjVaQ1VaZjZ1OGhBMytCUlpsUWlyWmFZVWZlVmpzU1FETFNwWFowYjVQY0FncE1EWVpmRGtWbGFscjRzZ1pRNVkwODkwcEp6dE16T0s2VTR5Z1FMQkdQbTlTSmRLY01rT01VdXVnc0xTOUVYdHMwekRnOFR6LzJxZlhLeXdBN0RvbjdBOUlzVnFIOHM5ZlQzMDRPYVh6amtGU3JrUHduWGtvVDZOMXpHVWRUQUpDTTNOek94S1d0eGEvZEVzMTJ4VHhtR2dtaFlWIiwiQ0xBSU0tMDUiOiJFQTEzejA3ejBUcWRkM2gwNElyYThLUjJ3WThWTXhzNyJ9.AH680Kp1pFFA3yYL3vzime12X7TzjRr0XTt2LsF1FVE", {
  //     method: "POST",
  //     body: JSON.stringify({
  //         "id": params.id,
  //         "language": "EN"
  //     }),
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //     },
  // });
  // const data = await res.json();
  // const result = data.My_Result;
  // return {
  //     title: `${result.name}, ${result.country.name} - Book direct`,
  // }
}
export default function page({ params: { id }, searchParams }) {
  const domain = decodeURIComponent(params.domain);
  const { e, s, lang, b } = searchParams;
  return (
    <InvoicePage
      perma_link={domain.split('.')[0]}
      language={lang}
      email={e}
      bookingNbr={b}
      propertyId={id}
      status={s}
    />
  );
}
