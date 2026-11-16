# Printing URLs

## `/printing/doc` — Booking documents for the guest to sign

Modes: `consent`

| Param             | Required | Description                                                     |
| ----------------- | -------- | --------------------------------------------------------------- |
| `mode`            | yes      | Document mode (see list above)                                  |
| `id`              | yes      | Booking number                                                  |
| `room_identifier` | yes      | `identifier` of the room to print (`consent`)                   |
| `token`           | yes      | Auth token                                                      |
| `environment`     | no       | `alpha` (IRALPHA gateway) or `production` (IR gateway, default) |

**Consent (registration card)**

```
http://localhost:5863/a35/printing/doc?mode=consent&id={bookingNbr}&room_identifier={roomIdentifier}&token={token}
```
