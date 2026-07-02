# Printing URLs

## `/printing/fd` — Booking Fiscal Document For Guest folio

Modes: `invoice` · `receipt` · `creditnote` · `creditreceipt` · `printing` · `proforma`

| Param        | Required | Description                                                 |
| ------------ | -------- | ----------------------------------------------------------- |
| `mode`       | yes      | Document mode (see list above)                              |
| `id`         | yes      | Booking number                                              |
| `token`      | yes      | Auth token                                                  |
| `documentId` | no       | Document number shown in header                             |
| `lang`       | no       | Language code (default: `en`)                               |
| `pid`        | no       | Payment `system_id` — used for `receipt`, `creditreceipt`   |
| `rnb`        | no       | Receipt number — used for `receipt`                         |
| `ids`        | no       | List of `system_id` separated by `-` — used for `proforma`  |
| `bill_to`    | no       | `company` or `empty` or `custom name` - used for `proforma` |

**Invoice**

```
http://localhost:5863/a35/printing/fd?id=74046077780&documentId=INV-65&mode=invoice&token={token}
```

**Proforma**

```
http://localhost:5863/a35/printing/fd?id=23384312112&documentId=2020132&mode=proforma&ids=109639219-530&token={token}
```

##### Custom guest

```
http://localhost:5863/a35/printing/fd?id=23384312112&documentId=2020132&mode=proforma&ids=109639219-530&bill_to=Jhon&token={token}
```

##### Company

```
http://localhost:5863/a35/printing/fd?id=23384312112&documentId=2020132&mode=proforma&ids=109639219-530&bill_to=company&token={token}
```

**Credit Note**

```
http://localhost:5863/a35/printing/fd?id={bookingNbr}&documentId={invoiceNbr}&mode=creditnote&token={token}
```

**Credit Receipt**

```
http://localhost:5863/a35/printing/fd?id={bookingNbr}&pid={pid}&rnb={rnb}&mode=creditreceipt&token={token}
```

**Receipt**

```
http://localhost:5863/a35/printing/fd?id={bookingNbr}&pid={pid}&rnb={rnb}&mode=receipt&token={token}
```

**Printing**

```
http://localhost:5863/A35/printing/fd?id=76541885387&mode=printing&token={token}
```
