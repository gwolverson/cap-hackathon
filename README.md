# Airbite

A simple React food delivery demo with express drone delivery.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Build

```sh
npm run build
npm run preview
```

Browse and search six meals, filter by category, save favorites, edit the delivery address, and manage quantities in the bag. Choose express drone delivery (£3.99, 10–20 minutes) or standard delivery (£1.99, 30–45 minutes). Place a demo order and watch simulated tracking progress every eight seconds.

This is a frontend hackathon prototype. Orders, addresses, favorites and the cart are held in memory and reset on refresh. There is no payment, backend, real delivery, or drone connection. Meal photos are served by Unsplash; fonts by Google Fonts; avatars by Pravatar. Internet access is needed for those visual assets.
