# Easy POS V2 (easy-posv2)

Point-Of-Sale App

## Troubleshoot

Had to specify sql.js dependency version to 1.11.0 for wasm compileStream to work
https://forum.ionicframework.com/t/problem-capacitor-community-sqlite-with-jeep/247244/3

## TODO

<!-- Cart Page -->

This is the main screen of the POS, it display the products on sale,
and allow adding them to a cart for an immediate/later checkout(payment).

- UX improvement:
  - disable checkout btn if no products in cart
- UI improvement

<!-- Check-out Page -->

This is the payment page where seller validate & save cart's partial/full payments.
full payments generate invoices.

\*note: unpaid / partially paid bills are archived everyday at 5am and can be found in the 'Unpaid Bills' section of the POS

- Payment Method display name instead of value

<!-- unpaid Bills Page -->

Page listing unpaid / partially paid bills categorized by day and sorted from most recent to oldest
Here we can see the itemized bill and make payment through checkout page. Once bill is fully paid its moved from "unpaid bills" to "invoices"

- display only unpaid
- filter by date (default today) : "yesterday","today", "datepicker" buttons
- make notif badge number update
- UI improvement

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
