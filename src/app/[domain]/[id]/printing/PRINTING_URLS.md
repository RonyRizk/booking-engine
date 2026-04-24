# Printing URLs

## `/printing/fd` — Booking Fiscal Document

Modes: `invoice` · `receipt` · `creditnote`

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
http://localhost:5863/a35/printing/fd?id=74046077780&documentId=INV-65&mode=invoice&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzcwNTAyMzQsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.waorhJQHD4CPIO1daVHdeDInNX83smNjuGKcbIjYfBc
```

**Credit Note**

```
http://localhost:5863/a35/printing/fd?id={bookingNbr}&documentId={invoiceNbr}&mode=creditnote&token={token}
```

---

## `/printing/cl` — City Ledger Fiscal Document

Modes: `invoice` · `receipt` · `creditnote` · `debitnote` · `statement`

| Param   | Required | Description                                                                |
| ------- | -------- | -------------------------------------------------------------------------- |
| `mode`  | yes      | Document mode (see list above)                                             |
| `aid`   | yes      | Agent ID                                                                   |
| `token` | yes      | Auth token                                                                 |
| `docNo` | no       | Document number — used for `invoice`, `receipt`, `creditnote`, `debitnote` |
| `ref`   | no       | Reference invoice number — used for `creditnote`/`debitnote`               |
| `from`  | no       | Statement start date `YYYY-MM-DD` — used for `statement`                   |
| `to`    | no       | Statement end date `YYYY-MM-DD` — used for `statement`                     |
| `lang`  | no       | Language code (default: `en`)                                              |

**Invoice**

```
http://localhost:5863/a35/printing/cl?docNo=INV-19&aid=227&mode=invoice&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzY5NjQ2MDcsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.4CvRXAaZk2hkIzdEMZZIiCNjFr9LLbCzJdzaxyXeIbg
```

**Credit Note**

```
http://localhost:5863/a35/printing/cl?docNo=CR-28&ref=INV-20&aid=227&mode=creditnote&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzY5NjQ2MDcsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.4CvRXAaZk2hkIzdEMZZIiCNjFr9LLbCzJdzaxyXeIbg
```

**Debit Note**

```
http://localhost:5863/a35/printing/cl?docNo=DBN-2&ref=INV-19&aid=227&mode=debitnote&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzY5NjQ2MDcsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.4CvRXAaZk2hkIzdEMZZIiCNjFr9LLbCzJdzaxyXeIbg
```

**Receipt**

```
http://localhost:5863/a35/printing/cl?docNo=RCT-7&aid=227&mode=receipt&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzY5NjQ2MDcsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.4CvRXAaZk2hkIzdEMZZIiCNjFr9LLbCzJdzaxyXeIbg
```

**Statement**

```
http://localhost:5863/a35/printing/cl?from=2026-03-23&to=2026-04-23&aid=227&mode=statement&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzY5NjQ2MDcsIkNMQUlNLTAxIjoicktLMi9DY1dQQnM9IiwiQ0xBSU0tMDIiOiI5UStMQm93VTl6az0iLCJDTEFJTS0wMyI6InJ5Y0ZmdnF6NjQ0PSIsIkNMQUlNLTA0IjoiQUVxVnRCMm1kWTg9IiwiQ0xBSU0tMDUiOiIvZzFwTzBhWU1wS2h1RTlOVDYzc0JFS1lXS21nS0oySFI3anFRbjFNNzlyTnhDOE55N0FpeDNWcTJ5NFpOKzRUMXR4ZHFpZ0lXTHI2MXBJRTFGcjYweTVtcVMySmVlQjQ2Wm9JbVVvTkhRejFSeFNINis5NjN6UlJWUmd1cEFtbm5LNkNrUWhXOCt0ZVg3bzM5TVI5TmpJR0Fib3NrRkNBIiwiQ0xBSU0tMDYiOiJBRXFWdEIybWRZOD0ifQ.4CvRXAaZk2hkIzdEMZZIiCNjFr9LLbCzJdzaxyXeIbg
```
