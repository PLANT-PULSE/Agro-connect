# AgroConnect Ghana — Frontend Prototype

A Bootstrap 5 + vanilla JavaScript client demonstration prototype.

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a browser, or open the folder in VS Code and use Live Server.
3. Internet access is required for Bootstrap, Bootstrap Icons, Chart.js and remote sample photography CDNs.

## Demo routes
- Public homepage: `index.html`
- Marketplace: `marketplace.html`
- Agricultural opportunities: `opportunities.html`
- Market prices: `market-prices.html`
- Farmer directory: `farmers.html`
- Buyer requirements: `buyer-requirements.html`
- Registration: `register.html`
- Demo login: `login.html`

## Demo dashboards
- `farmer-dashboard.html`
- `buyer-dashboard.html`
- `organisation-dashboard.html`
- `transport-dashboard.html`
- `admin-dashboard.html`

## Full-stack database implementation guide
See [`datbase.readme`](datbase.readme) for a PHP/MySQL schema, registration and login flow, feature-to-API mapping, safe payment and revenue handling, a recommended full-stack folder structure, and a rollout checklist. This is an implementation blueprint; the current prototype remains frontend-only and does not connect to SQL or a live payment provider.

## AI assistant prototype
An **Ask Agro AI** chat button is available on every page. It can draft agricultural plans, listings, buyer requests, event plans, proposals, messages and social posts from free-form prompts. This is a local browser-side prototype with templates—not a live AI model or backend service—and it does not verify market prices or provide professional agricultural advice. Connect a PHP API and an AI provider on the server if you later want real AI responses; do not put provider keys in browser JavaScript.

## Revenue and business demonstrations
The dashboard role switcher includes Farmer, Buyer, Organisation, Transport operator and Super administrator workspaces. The admin workspace includes the six demo revenue streams: produce commissions, farmer and buyer subscriptions, paid advertising, organisational partnerships and completed delivery commissions. Farmer and buyer dashboards include plan selection and simulated payment; organisation users can submit partnership applications; transport operators can quote and progress delivery jobs. Admins can review transactions and campaigns, manage partnerships, configure rates, and export transaction/revenue CSVs.

Open `login.html`, choose a demo role, and select **Continue to dashboard**. Demo transactions and revenue data are seeded on first use and saved in browser `localStorage` under `agroBusinessState`. To restore the original sample data, clear that localStorage key in the browser developer tools and reload a dashboard. Successful payments create demo receipts and only paid platform fees are counted as revenue; failed payments are retained in payment history but do not add revenue. The prototype does not connect to a real payment provider, bank, buyer, farmer, organisation, or carrier.

### Suggested monetisation demo
1. Sign in as a **Farmer** or **Buyer**, open **Subscriptions**, choose a paid plan, and confirm a simulated Mobile Money, card, or bank-transfer payment. Select the failed-payment outcome to verify that no revenue is recorded.
2. As a **Buyer**, open **Transactions**, simulate a produce purchase, and inspect its commission and farmer-payable breakdown.
3. As a **Farmer**, open **Advertising**, submit a featured-product campaign, and complete its simulated payment.
4. As an **Organisation**, submit a partnership application and simulate the campaign payment.
5. As a **Transport operator**, submit a delivery quotation, then progress the job through pickup, transit and delivery. A completed delivery records only the configured platform coordination fee.
6. Switch to **Super administrator** to review the revenue overview, transactions, subscriptions, campaign approvals, partnerships, logistics jobs and settings. Export transaction or revenue records as CSV.

The browser-only prototype seeds at least 10 Ghanaian farmer profiles, 8 buyers, 5 partner organisations, 6 transport operators, 20 produce transactions, 10 subscriptions, 8 advertising campaigns and 10 delivery requests. Seeded data is illustrative and shared in the browser for demonstration; it is not private or suitable for real customer records. Refreshing a dashboard retains demo activity. Clear the `agroBusinessState` localStorage key to reset it to the original sample state.

## Important limitations
This is a frontend-only demonstration. It does not include real authentication, a backend, database, SMS, WhatsApp, email, live market data, verified opportunities or real applications. Sample prices, farmer profiles, listings, opportunities and statistics are illustrative. Do not use this prototype to collect real personal or business data.

Some interactions are stored in browser localStorage and are limited to the browser/device used for the demo.

The cassava photo is "Harvested cassava roots 01" by Denis kasozi, used under CC BY-SA 4.0: [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Harvested_cassava_roots_01.jpg). Farmer directory photos are from Wikimedia Commons: [Ghanaian Vegetable Farmer](https://commons.wikimedia.org/wiki/File:Ghanaian_Vegetable_Farmer.jpg) by Vrinda Khushu, [MEDA's Grow project woman farmer](https://commons.wikimedia.org/wiki/File:A_woman_farmer_from_MEDA%27s_Grow_project_proudly_displaying_her_Certificate_of_Merit.png) by Alexhori1986, and [Ghanaian Cocoa Farmer on Phone](https://commons.wikimedia.org/wiki/File:Ghanaian_Cocoa_Farmer_on_Phone.jpg) by IanCamp are CC BY-SA 4.0; [USDA Ghana 2015-11-16 007a](https://commons.wikimedia.org/wiki/File:USDA_Ghana_2015-11-16_007a.jpg) is public domain. Facebook, TikTok and Instagram currently link to their platform home pages; replace those destinations with official AgroConnect profile URLs when available. WhatsApp links open a direct chat with +233 59 944 1148.
