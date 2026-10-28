# Bangalore Music Trust website

Static site hosted on Vercel (`index.html`, `Music Education.dc.html`, `Get Involved.dc.html`), plus a small set of
serverless functions in `api/` for online donations.

## Donations (Razorpay Standard Checkout)

Donations live on the **Get Involved** page, in the `#donate` section (`Get Involved.dc.html#donate`). The header
"Donate" links on every page point there. The homepage no longer has a donation section.

### How it works

1. The donor picks an amount (INR) and enters name, email and an optional phone number.
2. The browser calls `POST /api/razorpay/create-order`. The server validates the amount itself (whole or
   2-decimal rupees, `₹1` to `₹5,00,000`), converts it to paise with integer arithmetic and creates a Razorpay
   order. Donor details are stored in the order `notes`, so they appear next to the payment in the Razorpay dashboard.
3. The browser opens Razorpay Standard Checkout with the returned order id and public key id.
4. On success, the browser calls `POST /api/razorpay/verify-payment`. The server verifies the HMAC-SHA256 signature
   with the key secret, then fetches the payment from Razorpay to confirm it belongs to that order and to read its real
   status. Checkout's own success callback is never treated as proof of payment.
5. The page shows "Thank you" only when Razorpay reports the payment as **captured**. An **authorized** (not yet
   captured) payment, an unverifiable one, or a lookup that could not be completed each get their own state, and only
   a Razorpay payment reference is shown, never a made-up receipt.

`GET /api/razorpay/status` reports whether the integration is configured, so the form can say so up front.

| File | Purpose |
| --- | --- |
| `api/razorpay/create-order.js` | Validates the request and creates the Razorpay order |
| `api/razorpay/verify-payment.js` | Verifies signature, order binding and payment status |
| `api/razorpay/status.js` | "Is payment configured?" for the form |
| `api/_lib/razorpay.js` | Config validation, amount parsing, signature check, Razorpay REST client |
| `tests/razorpay.test.js` | Unit tests against a stubbed Razorpay API |

There are no npm dependencies and no build step: the functions use Node's built-in `fetch` and `crypto`.

### Configuration

Set these in **Vercel → Project → Settings → Environment Variables** (see `.env.example`):

| Variable | Value |
| --- | --- |
| `RAZORPAY_MODE` | `test` (default). Live is only used when this is explicitly `live`. |
| `RAZORPAY_KEY_ID` | `rzp_test_...` from Razorpay Dashboard → Test Mode → API Keys |
| `RAZORPAY_KEY_SECRET` | The matching test key secret |

- The secret is read only by the functions in `api/`. It is never sent to the browser or logged.
- A malformed or missing setting, or a key that does not match `RAZORPAY_MODE`, leaves the site in a
  "not available yet" state instead of attempting payments. The Vercel function logs name the offending variable
  (never its value).
- Redeploy after changing environment variables.
- Never commit `.env*` files (they are in `.gitignore`).

### Testing in Razorpay test mode

1. Add the test keys above and redeploy.
2. Open `Get Involved.dc.html#donate`. A "Test mode" notice should appear above the amounts.
3. Use Razorpay's published test cards / UPI IDs
   (<https://razorpay.com/docs/payments/payments/test-card-details/>) to try a success, a failure and a cancelled payment.
4. Confirm the payment appears in the Razorpay dashboard with the donor details in its notes.
5. In the dashboard, make sure payment capture is **automatic**. If it is manual, payments stay "authorized" and the
   page deliberately does not call them confirmed.

To run the unit tests locally: `node --test tests/*.test.js` (Node 18+).

### Going live

Switch only after the Trust confirms its Razorpay account is activated: set `RAZORPAY_MODE=live` together with the
`rzp_live_...` key id and secret, then redeploy. A live key with `RAZORPAY_MODE` unset or `test` is refused.

### Known limits

- **No database.** Nothing is stored by the site; Razorpay is the system of record. Verification is stateless, so
  repeating it is harmless and cannot create a second donation, but the site also keeps no donation ledger.
- **No webhook.** Reconciling payments when the donor closes the tab right after paying needs somewhere to store the
  result, so it is not included. Check the Razorpay dashboard for such payments. A `payment.captured` webhook
  (with signature verification) is the natural next step once a data store exists.
- **No rate limiting.** The endpoints reject cross-origin script calls and non-JSON requests, but consider enabling
  Vercel Firewall rate limiting on `/api/razorpay/*`.
- Tax, registration and 80G details are deliberately not mentioned until the Trust confirms them.
