# Airbite

A simple React food delivery demo with express drone delivery. This document describes the current implementation; the diagrams use Mermaid.

## Run and build

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

```sh
npm run build
npm run preview
```

## 1. System overview

Everything involved in browsing, checkout, and tracking runs in the browser. External services supply visual assets only.

```mermaid
flowchart LR
    Human[Customer] -->|Browse, add meals, place demo order| UI
    subgraph Browser[Browser]
        UI[React interface]
        State[In-memory state]
        Catalog[Six hardcoded meals]
        Timer[Simulated tracking timer]
        UI -->|Event handlers| State
        State -->|Render| UI
        Catalog --> UI
        Timer -->|Advance order step| State
    end
    Host[Local Vite server or static hosting] -->|HTML, JavaScript, CSS, GIF| UI
    Unsplash[Unsplash] -->|Meal photos| UI
    Fonts[Google Fonts] -->|DM Sans and Manrope| UI
    Avatars[Pravatar] -->|Hero avatars| UI
```

There is no backend, database, authentication, payment processing, geocoding, or real drone integration. Delivery availability, ratings, and delivery estimates are demo content.

## 2. Code and interface structure

`App` owns all state and behavior. The interface regions below are inline JSX inside `App`; only `Drone` and `HeroArt` are separate helper components. Navigation scrolls the page or opens a dialog, without a router.

```mermaid
flowchart TD
    HTML[index.html: root element] --> Entry[src/main.jsx: createRoot]
    Entry --> App[App component]
    App --> Header[Header: navigation, address, bag count]
    App --> Hero[Hero and express delivery card]
    App --> Menu[Menu: search, categories, favorites, meal cards]
    App --> Footer[Banner and footer]
    App --> Toast[Temporary cart notification]
    App --> Modal[Shared dialog shell: controlled by panel]
    Modal --> Cart[Cart drawer and delivery selection]
    Modal --> Address[Address form]
    Modal --> How[How it works]
    Modal --> Order[Latest order, tracking, receipt, completion GIF]
    Art[HeroArt component: inline SVG] --> Hero
    Drone[Drone component: reusable inline SVG] --> App
    Icons[lucide-react icons] --> App
    CSS[src/styles.css: layout and responsive rules] --> App
```

The shared dialog shell handles Escape, focus trapping and restoration, backdrop dismissal, and body scroll locking. CSS adapts the menu grid, header, hero, and dialogs for smaller screens.

## 3. State and derived data

React `useState` holds session data. Filtered meals, cart contents, quantities, and prices are recalculated during rendering rather than stored separately.

```mermaid
flowchart TD
    Meals[meals: static catalog] --> Filter[Filter by category, favorites and search text]
    Browse[category, query, favorites, favoritesOnly] --> Filter
    Filter --> Cards[Visible meal cards]

    Meals --> Join[Match meal IDs to quantities]
    Cart[cart: meal ID to quantity] --> Join
    Join --> Items[cartItems: meal details plus quantity]
    Items --> Count[count: sum of quantities]
    Items --> Subtotal[subtotal: sum of price times quantity]
    Delivery[delivery: drone or standard] --> Fee[deliveryFee: GBP 3.99 or GBP 1.99]
    Subtotal --> Total[Checkout total: subtotal plus deliveryFee]
    Fee --> Total

    Address[address and addressDraft] --> AddressUI[Address form and delivery destination]
    Panel[panel: null, cart, address, how or order] --> Modal[Visible dialog]
    Toast[toast: message] --> Notice[Notification cleared after 2.4 seconds]
    Order[order and orderStep] --> Tracking[Latest order receipt and tracking view]
```

Cart quantities never go below zero; zero-quantity entries are removed. Search is case-insensitive across meal name, restaurant, category, and description. Prices display in GBP through `Intl.NumberFormat`.

## 4. Checkout sequence

`placeOrder()` snapshots the selected meals, total, delivery method, and address. Subsequent edits to the cart or address do not change that receipt.

```mermaid
sequenceDiagram
    actor Customer
    participant App as React App
    participant State as In-memory state
    participant Timer as Browser timer

    Customer->>App: Add a meal or change quantity
    App->>State: updateCart(mealId, change)
    App-->>Customer: Render bag count and calculated totals
    Customer->>App: Open bag and select delivery
    App->>State: Set delivery to drone or standard
    App-->>Customer: Render updated fee and total
    Customer->>App: Place demo order
    alt Bag is empty
        App-->>Customer: Keep empty bag view; no order created
    else Bag contains meals
        App->>State: Save order snapshot with an AB-prefixed number
        App->>State: Clear cart, set orderStep to 0, open order dialog
        App-->>Customer: Show order confirmed and receipt
        loop Until orderStep reaches 3
            App->>Timer: Schedule an 8-second timeout
            Timer->>State: Increment orderStep
            State-->>App: Re-render tracking
        end
        App-->>Customer: Show Delivered and drone-delivery.gif
    end
```

Only the latest order is retained. A new order replaces it and restarts tracking. Order numbers use the last five digits of `Date.now()` and are demo identifiers, not guaranteed unique IDs.

## 5. Delivery lifecycle

Both delivery methods use the same simulated timer. The selected method changes the fee, displayed estimate, icon, and transit label.

```mermaid
stateDiagram-v2
    [*] --> Confirmed: placeOrder()
    state "Order confirmed: orderStep 0" as Confirmed
    state "Preparing your meal: orderStep 1" as Preparing
    state "In transit: orderStep 2" as Transit
    state "Delivered: orderStep 3" as Delivered

    Confirmed --> Preparing: After 8 seconds
    Preparing --> Transit: After 8 seconds
    note right of Transit
        Drone: Drone in flight
        Standard: Courier on the way
    end note
    Transit --> Delivered: After 8 seconds
    note right of Delivered
        Show assets/drone-delivery.gif
        for either delivery method.
        Stop scheduling tracking timeouts.
    end note
    Delivered --> [*]
```

The demo completes in approximately 24 seconds; the advertised 10–20 minute drone and 30–45 minute standard estimates do not drive the timer. Closing the dialog leaves tracking running, so **My orders** can reopen the current status. Refreshing the page resets all state, including the latest order.

## 6. Build and asset delivery

Vite bundles the application for static hosting. The completion GIF is imported from the repository and emitted with a hashed filename; it requires no external image service.

```mermaid
flowchart LR
    subgraph Source[Repository]
        HTML[index.html]
        JS[src/main.jsx]
        CSS[src/styles.css]
        GIF[assets/drone-delivery.gif]
        Deps[React, React DOM, lucide-react]
    end
    HTML --> Vite[Vite: npm run build]
    JS --> Vite
    CSS --> Vite
    GIF --> Vite
    Deps --> Vite
    Vite --> Dist[dist: HTML and bundled assets]
    Dist --> Host[Static host or npm run preview]
    Host --> Browser[Browser]
    Remote[Unsplash, Google Fonts, Pravatar] -->|Runtime requests| Browser
```

The local completion animation ships with the app. Meal photos, fonts, and avatars require internet access. All application logic remains in [src/main.jsx](src/main.jsx), with presentation in [src/styles.css](src/styles.css); [package.json](package.json) defines the development and build commands.
