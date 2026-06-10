# Printing URLs

## `/printing/cl` — City Ledger Fiscal Document For Agent Folio

Modes: `invoice` · `receipt` · `creditnote` · `creditreceipt` · `debitnote` · `statement` · `proforma`

| Param   | Required | Description                                                                                             |
| ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `mode`  | yes      | Document mode (see list above)                                                                          |
| `aid`   | yes      | Agent ID                                                                                                |
| `token` | yes      | Auth token                                                                                              |
| `docNo` | no       | Document number — used for `invoice`, `receipt`, `creditnote`, `creditreceipt`, `debitnote`, `proforma` |
| `ref`   | no       | Reference invoice/receipt number — used for `creditnote`/`creditreceipt`/`debitnote`                    |
| `from`  | no       | Statement start date `YYYY-MM-DD` — used for `statement`, `proforma`                                    |
| `to`    | no       | Statement end date `YYYY-MM-DD` — used for `statement`, `proforma`                                      |
| `id`    | no       | Booking number — used for `proforma`                                                                    |
| `lang`  | no       | Language code (default: `en`)                                                                           |

**Invoice**

```
http://localhost:5863/a35/printing/cl?docNo=INV-19&aid=227&mode=invoice&token={token}
```

**Draft**

```
http://localhost:5863/a35/printing/cl?docNo=2606031959-8&aid=227&mode=draft&token={token}
```

**Credit Note**

```
http://localhost:5863/a35/printing/cl?docNo=CREDO-34&ref=INNO-29&aid=243&mode=creditnote&token={token}
```

**Credit Receipt**

```
http://localhost:5863/a35/printing/cl?docNo=2&ref=25&aid=243&mode=creditreceipt&token={token}
```

**Debit Note**

```
http://localhost:5863/a35/printing/cl?docNo=DBN-2&ref=INV-19&aid=227&mode=debitnote&token={token}
```

**Receipt**

```
http://localhost:5863/a35/printing/cl?docNo=RCT-7&aid=227&mode=receipt&token={token}
```

**Pro forma**

```
http://localhost:5863/a35/printing/cl?docNo=a11919192&aid=227&mode=proforma&&from=2026-05-23&to=2026-05-23&id=76541885387&token={token}
```

**Statement**

```
http://localhost:5863/a35/printing/cl?from=2026-05-09&to=2026-06-08&aid=243&mode=statement&token={token}
```
