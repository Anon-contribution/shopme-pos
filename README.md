# Easy POS V2 (easy-posv2)

Point-Of-Sale App

## Troubleshoot

Had to specify sql.js dependency version to 1.11.0 for wasm compileStream to work
https://forum.ionicframework.com/t/problem-capacitor-community-sqlite-with-jeep/247244/3

## TODO,DOING,DONE

<!-- Cart Page -->

This is the main screen of the POS, it display the products on sale,
and allow adding them to a cart for an immediate/later checkout(payment).

- V1 Mobile Cart Page | DONE
- V1 Tablet Cart Page | DONE
- V1 Desktop Cart Page | DONE

<!-- Check-out Page -->

This is the payment page where seller validate & save cart's partial/full payments.
full payments generate invoices.

\*note: unpaid / partially paid bills are archived everyday at 5am and can be found in the 'Unpaid Bills' section of the POS

- V1 Mobile Check-out Page | DOING
- V1 Tablet Check-out Page | TODO
- V1 Desktop Check-out Page | TODO

<!-- unpaid Bills Page -->

Page listing unpaid / partially paid bills categorized by day and sorted from most recent to oldest
Here we can see the itemized bill and make payment through checkout page. Once bill is fully paid its moved from "unpaid bills" to "invoices"

<!-- Invoices Page -->

Listing page of fully paid bill, here we can fully or partially refund a bill.

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
