# Printing URLs

## `/printing/fd` — Booking Fiscal Document

Modes: `invoice` · `receipt` · `creditnote` · `printing`

| Param        | Required | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `mode`       | yes      | Document mode (see list above)           |
| `id`         | yes      | Booking number                           |
| `token`      | yes      | Auth token                               |
| `documentId` | no       | Document number shown in header          |
| `lang`       | no       | Language code (default: `en`)            |
| `pid`        | no       | Payment `system_id` — used for `receipt` |
| `rnb`        | no       | Receipt number — used for `receipt`      |

**Invoice**

```
http://localhost:5863/a35/printing/fd?id=74046077780&documentId=INV-65&mode=invoice&token=e{token}
```

**Credit Note**

```
http://localhost:5863/a35/printing/fd?id={bookingNbr}&documentId={invoiceNbr}&mode=creditnote&token={token}
```

**Printing**

```
http://localhost:5863/A35/printing?id=76541885387&mode=printing&token={token}
```

---

## `/printing/cl` — City Ledger Fiscal Document

Modes: `invoice` · `receipt` · `creditnote` · `debitnote` · `statement` · `proforma`

| Param   | Required | Description                                                                            |
| ------- | -------- | -------------------------------------------------------------------------------------- |
| `mode`  | yes      | Document mode (see list above)                                                         |
| `aid`   | yes      | Agent ID                                                                               |
| `token` | yes      | Auth token                                                                             |
| `docNo` | no       | Document number — used for `invoice`, `receipt`, `creditnote`, `debitnote`, `proforma` |
| `ref`   | no       | Reference invoice number — used for `creditnote`/`debitnote`                           |
| `from`  | no       | Statement start date `YYYY-MM-DD` — used for `statement`, `proforma`                   |
| `to`    | no       | Statement end date `YYYY-MM-DD` — used for `statement`, `proforma`                     |
| `id`    | no       | Booking number — used for `proforma`                                                   |
| `lang`  | no       | Language code (default: `en`)                                                          |

**Invoice**

```
http://localhost:5863/a35/printing/cl?docNo=INV-19&aid=227&mode=invoice&token={token}
```

**Credit Note**

```
http://localhost:5863/a35/printing/cl?docNo=CR-28&ref=INV-20&aid=227&mode=creditnote&token={token}
```

**Debit Note**

```
http://localhost:5863/a35/printing/cl?docNo=DBN-2&ref=INV-19&aid=227&mode=debitnote&token={token}
```

**Receipt**

```
http://localhost:5863/a35/printing/cl?docNo=RCT-7&aid=227&mode=receipt&token={token}
```

**Proforma**

```
http://localhost:5863/a35/printing/cl?docNo=a11919192&aid=227&mode=proforma&&from=2026-05-23&to=2026-05-23&id=76541885387&token={token}
```

**Statement**

```
http://localhost:5863/a35/printing/cl?from=2026-03-23&to=2026-04-23&aid=227&mode=statement&token={token}
```
