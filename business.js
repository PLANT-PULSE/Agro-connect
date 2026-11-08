(() => {
  "use strict";

  const KEY = "agroBusinessState";
  const money = value => `GH₵${Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const isoDate = offset => new Date(Date.now() - offset * 86400000).toISOString();
  let idSequence = 0;
  const id = prefix => {
    let candidate;
    do {
      idSequence += 1;
      candidate = `${prefix}-${Date.now().toString(36)}-${idSequence.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    } while ([...state.transactions, ...state.subscriptions, ...state.campaigns, ...state.partnerships, ...state.logistics, ...state.revenue, ...state.payments].some(record => record.id === candidate));
    return candidate;
  };
  const defaults = {
    transactionCommission: 3,
    logisticsCommission: 10,
    farmerPlans: { Free: 0, Basic: 20, Professional: 50, Agribusiness: 100 },
    buyerPlans: { Starter: 100, Business: 250, Enterprise: 500 },
    ads: { "Featured product": 20, "Featured farmer": 50, "Sponsored agribusiness": 100 },
    partnerships: { "Community outreach": 250, "Farmer engagement": 500, "Institutional partnership": 1000 }
  };
  const farmerPlans = [
    { name: "Free", features: ["Basic farmer profile", "Up to 3 product listings", "Standard marketplace visibility", "Basic buyer enquiries"] },
    { name: "Basic", features: ["Up to 10 product listings", "Enhanced profile", "Basic sales analytics", "Improved marketplace visibility"] },
    { name: "Professional", features: ["Up to 30 product listings", "Advanced sales analytics", "Priority placement", "Verification application", "Buyer enquiry management"] },
    { name: "Agribusiness", features: ["Fair-use unlimited listings", "Advanced analytics and reports", "Featured profile", "Multiple farm locations", "Priority buyer matching"] }
  ];
  const buyerPlans = [
    { name: "Starter", features: ["Buyer business profile", "Standard farmer discovery", "5 supplier enquiries / month", "Basic procurement requests"] },
    { name: "Business", features: ["Advanced farmer search", "Supplier comparison", "20 procurement requests / month", "Contact management", "Priority support"] },
    { name: "Enterprise", features: ["Advanced supplier discovery", "Bulk supplier matching", "Performance insights", "Downloadable reports", "Dedicated support"] }
  ];
  const farmerNames = ["Mr Nartey", "Ama Serwaa", "Kwame Asante", "Abena Osei", "Yaw Boateng", "Akua Mensima", "Kofi Owusu", "Adwoa Frimpong", "Kojo Mensah", "Esi Nyarko"];
  const buyerNames = ["Accra Fresh Foods", "Kumasi Grain Traders", "Cape Coast Market Hub", "Golden Coast Exporters", "Volta Valley Kitchens", "Tamale Agro Processing", "Eastern Harvest Ltd.", "Ashanti Wholesale Foods"];
  const produce = ["Tomatoes", "Maize", "Cassava", "Plantain", "Pepper", "Rice", "Yam", "Pineapple"];
  const locations = ["Accra", "Kasoa", "Cape Coast", "Takoradi", "Kumasi", "Tamale", "Koforidua", "Ho", "Sunyani"];

  function seed() {
    const transactions = Array.from({ length: 20 }, (_, index) => {
      const amount = [4800, 3600, 1700, 2900, 5200, 6800, 2400, 4100][index % 8];
      const status = index < 12 ? "Completed" : ["Pending settlement", "Pending payment", "Cancelled", "Failed"][index % 4];
      const rate = defaults.transactionCommission;
      return {
        id: `TX-${String(index + 1).padStart(4, "0")}`,
        buyer: buyerNames[index % buyerNames.length],
        farmer: farmerNames[index % farmerNames.length],
        product: produce[index % produce.length],
        quantity: `${1 + index % 5} tonnes`,
        unitPrice: amount / (1 + index % 5),
        amount,
        commissionRate: rate,
        commission: status === "Completed" ? Math.round(amount * rate) / 100 : 0,
        farmerPayable: amount - Math.round(amount * rate) / 100,
        status,
        paymentMethod: ["Mobile Money", "Bank Transfer", "Debit/Credit Card"][index % 3],
        date: isoDate(index * 3 + 1),
        revenueId: status === "Completed" ? `REV-TX-${String(index + 1).padStart(4, "0")}` : null
      };
    });
    const subscriptions = Array.from({ length: 10 }, (_, index) => {
      const type = index < 7 ? "farmer" : "buyer";
      const plans = type === "farmer" ? ["Basic", "Professional", "Agribusiness", "Free"] : ["Starter", "Business", "Enterprise"];
      const plan = plans[index % plans.length];
      const amount = (type === "farmer" ? defaults.farmerPlans : defaults.buyerPlans)[plan];
      return {
        id: `SUB-${String(index + 1).padStart(4, "0")}`,
        type,
        customer: type === "farmer" ? farmerNames[index % farmerNames.length] : buyerNames[index % buyerNames.length],
        plan,
        amount,
        status: index === 9 ? "Expired" : "Active",
        paymentStatus: index === 9 ? "Expired" : "Paid",
        startedAt: isoDate(index * 12 + 2),
        renewalDate: new Date(Date.now() + (30 - index) * 86400000).toISOString(),
        revenueId: index === 9 || amount === 0 ? null : `REV-SUB-${String(index + 1).padStart(4, "0")}`
      };
    });
    const campaigns = Array.from({ length: 8 }, (_, index) => ({
      id: `AD-${String(index + 1).padStart(4, "0")}`,
      customer: farmerNames[index % farmerNames.length],
      type: ["Featured product", "Featured farmer", "Sponsored agribusiness"][index % 3],
      title: `${produce[index % produce.length]} harvest promotion`,
      duration: index % 3 === 1 ? 30 : 7,
      amount: defaults.ads[["Featured product", "Featured farmer", "Sponsored agribusiness"][index % 3]],
      status: index < 4 ? "Active" : index < 6 ? "Pending approval" : "Completed",
      impressions: 850 + index * 137,
      clicks: 41 + index * 9,
      createdAt: isoDate(index * 5 + 2),
      paymentStatus: index < 7 ? "Paid" : "Pending",
      revenueId: index < 7 ? `REV-AD-${String(index + 1).padStart(4, "0")}` : null
    }));
    const partnerships = Array.from({ length: 5 }, (_, index) => ({
      id: `PART-${String(index + 1).padStart(4, "0")}`,
      organisation: ["Ghana Rural Development Network", "Coastal Farmers Initiative", "Northern Food Systems", "Women in Agribusiness Ghana", "Green Growth Foundation"][index],
      type: ["NGO", "Agricultural programme", "Training institution", "Financial institution", "Development organisation"][index],
      contact: ["Nana Agyeman", "Esi Hammond", "Yakubu Issah", "Akosua Badu", "Kwesi Armah"][index],
      email: `partnership${index + 1}@example.org`,
      service: ["Community outreach", "Farmer engagement", "Institutional partnership"][index % 3],
      budget: [250, 500, 1000, 500, 250][index],
      audience: ["Central Region farmers", "Smallholder women farmers", "Northern Region cooperatives", "Agribusiness learners", "Eastern Region growers"][index],
      duration: 30 + index * 10,
      status: index < 3 ? "Approved" : index === 3 ? "Pending review" : "Rejected",
      paymentStatus: index < 2 ? "Paid" : "Pending",
      createdAt: isoDate(index * 8 + 1),
      revenueId: index < 2 ? `REV-PART-${String(index + 1).padStart(4, "0")}` : null
    }));
    const logistics = Array.from({ length: 10 }, (_, index) => ({
      id: `LOG-${String(index + 1).padStart(4, "0")}`,
      buyer: buyerNames[index % buyerNames.length],
      farmer: farmerNames[index % farmerNames.length],
      produce: produce[index % produce.length],
      quantity: `${2 + index % 8} tonnes`,
      pickup: locations[index % locations.length],
      delivery: locations[(index + 3) % locations.length],
      vehicle: ["Medium truck", "Large truck", "Refrigerated truck"][index % 3],
      cost: 450 + index * 125,
      commissionRate: defaults.logisticsCommission,
      commission: index < 4 ? Math.round((450 + index * 125) * defaults.logisticsCommission) / 100 : 0,
      operator: index < 4 ? ["Kofi Transport", "North Star Haulage", "Akua Logistics", "Asante Cargo"][index] : "",
      status: index < 3 ? "Completed" : index === 3 ? "In transit" : "Awaiting quotations",
      createdAt: isoDate(index * 4 + 1),
      revenueId: index < 3 ? `REV-LOG-${String(index + 1).padStart(4, "0")}` : null
    }));
    const revenue = [];
    transactions.filter(x => x.revenueId).forEach(x => revenue.push({ id: x.revenueId, source: "Transaction commission", customer: x.buyer, description: `${x.product} purchase · ${x.farmer}`, amount: x.commission, paymentMethod: x.paymentMethod, date: x.date, status: "Paid", sourceId: x.id }));
    subscriptions.filter(x => x.revenueId).forEach(x => revenue.push({ id: x.revenueId, source: `${x.type === "farmer" ? "Farmer" : "Buyer"} subscription`, customer: x.customer, description: `${x.plan} plan`, amount: x.amount, paymentMethod: "Mobile Money", date: x.startedAt, status: "Paid", sourceId: x.id }));
    campaigns.filter(x => x.revenueId).forEach(x => revenue.push({ id: x.revenueId, source: "Advertising", customer: x.customer, description: x.title, amount: x.amount, paymentMethod: "Mobile Money", date: x.createdAt, status: "Paid", sourceId: x.id }));
    partnerships.filter(x => x.revenueId).forEach(x => revenue.push({ id: x.revenueId, source: "Partnership", customer: x.organisation, description: x.service, amount: x.budget, paymentMethod: "Bank Transfer", date: x.createdAt, status: "Paid", sourceId: x.id }));
    logistics.filter(x => x.revenueId).forEach(x => revenue.push({ id: x.revenueId, source: "Logistics commission", customer: x.buyer, description: `${x.produce} delivery · ${x.operator}`, amount: x.commission, paymentMethod: "Bank Transfer", date: x.createdAt, status: "Paid", sourceId: x.id }));
    const payments = [
      ...transactions.filter(x => x.status === "Completed").map(x => ({ id: `PAY-${x.id}`, amount: x.amount, method: x.paymentMethod, service: "transaction", entityId: x.id, status: "Paid", date: x.date, customer: x.buyer })),
      ...subscriptions.filter(x => x.paymentStatus === "Paid" && x.amount > 0).map(x => ({ id: `PAY-${x.id}`, amount: x.amount, method: "Mobile Money", service: "subscription", kind: x.type, entityId: x.id, status: "Paid", date: x.startedAt, customer: x.customer })),
      ...campaigns.filter(x => x.paymentStatus === "Paid").map(x => ({ id: `PAY-${x.id}`, amount: x.amount, method: "Mobile Money", service: "advertising", entityId: x.id, status: "Paid", date: x.createdAt, customer: x.customer })),
      ...partnerships.filter(x => x.paymentStatus === "Paid").map(x => ({ id: `PAY-${x.id}`, amount: x.budget, method: "Bank Transfer", service: "partnership", entityId: x.id, status: "Paid", date: x.createdAt, customer: x.organisation })),
      ...logistics.filter(x => x.revenueId).map(x => ({ id: `PAY-${x.id}`, amount: x.cost, method: "Bank Transfer", service: "logistics", entityId: x.id, status: "Paid", date: x.createdAt, customer: x.buyer }))
    ];
    return {
      version: 1,
      config: structuredClone(defaults),
      transactions,
      subscriptions,
      campaigns,
      partnerships,
      logistics,
      revenue,
      payments,
      transportOperators: [
        { name: "Kofi Transport", vehicle: "Large truck", region: "Greater Accra", rating: 4.8 },
        { name: "North Star Haulage", vehicle: "Refrigerated truck", region: "Northern Region", rating: 4.7 },
        { name: "Akua Logistics", vehicle: "Medium truck", region: "Central Region", rating: 4.9 },
        { name: "Asante Cargo", vehicle: "Large truck", region: "Ashanti Region", rating: 4.6 },
        { name: "Volta Valley Transit", vehicle: "Medium truck", region: "Volta Region", rating: 4.5 },
        { name: "Coastal Freight Ghana", vehicle: "Refrigerated truck", region: "Western Region", rating: 4.8 }
      ],
      partnershipDirectory: [
        "Ghana Rural Development Network", "Coastal Farmers Initiative", "Northern Food Systems",
        "Women in Agribusiness Ghana", "Green Growth Foundation"
      ]
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) {
        const fresh = seed();
        localStorage.setItem(KEY, JSON.stringify(fresh));
        return fresh;
      }
      const parsed = JSON.parse(saved);
      if (parsed.version === 1 && parsed.config && parsed.revenue && parsed.transactions) return parsed;
      console.error("AgroConnect business data was incomplete; the demo dataset was restored.");
    } catch (error) {
      console.error("Unable to read AgroConnect business data; restoring the demo dataset.", error);
    }
    const fresh = seed();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }

  let state = loadState();
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const rateAmount = (amount, rate) => Math.round((Number(amount) * Number(rate) / 100 + Number.EPSILON) * 100) / 100;
  const calculateTransactionCommission = (amount, rate = state.config.transactionCommission) => rateAmount(amount, rate);
  const calculateLogisticsCommission = (amount, rate = state.config.logisticsCommission) => rateAmount(amount, rate);
  const calculateSubscriptionRevenue = subscription => subscription.paymentStatus === "Paid" ? Number(subscription.amount) : 0;
  const calculateAdvertisingRevenue = campaign => campaign.paymentStatus === "Paid" ? Number(campaign.amount) : 0;
  const calculatePartnershipRevenue = partnership => partnership.paymentStatus === "Paid" ? Number(partnership.budget) : 0;
  const calculateTotalPlatformRevenue = () => state.revenue.filter(x => x.status === "Paid").reduce((sum, x) => sum + Number(x.amount), 0);
  const addRevenue = entry => {
    if (state.revenue.some(x => x.id === entry.id || (x.source === entry.source && x.sourceId === entry.sourceId))) return false;
    state.revenue.unshift(entry);
    return true;
  };
  const addPayment = (payment, successful) => {
    const record = {
      id: id("PAY"), amount: Number(payment.amount), method: payment.method,
      service: payment.service, kind: payment.kind, entityId: payment.entityId, status: successful ? "Paid" : "Failed",
      date: new Date().toISOString(), customer: payment.customer || "Demo customer"
    };
    state.payments.unshift(record);
    return record;
  };
  const notify = message => {
    if (typeof window.toast === "function") window.toast(message);
    else console.info(message);
  };
  const roleFiles = {
    farmer: "farmer-dashboard.html", buyer: "buyer-dashboard.html",
    organisation: "organisation-dashboard.html", transport: "transport-dashboard.html",
    admin: "admin-dashboard.html"
  };
  const roleLabels = { farmer: "Farmer", buyer: "Buyer", organisation: "Organisation", transport: "Transport operator", admin: "Super administrator" };
  const tabNames = {
    overview: "Overview", transactions: "Transactions", subscriptions: "Subscriptions",
    advertising: "Advertising", partnerships: "Partnerships", logistics: "Logistics",
    settings: "Financial settings"
  };
  let currentRole = "farmer";
  let currentTab = "overview";
  let charts = [];
  let paymentDraft = null;

  function dashboardTabs(role) {
    if (role === "admin") return ["overview", "transactions", "subscriptions", "advertising", "partnerships", "logistics", "settings"];
    if (role === "farmer") return ["overview", "subscriptions", "advertising", "transactions"];
    if (role === "buyer") return ["overview", "subscriptions", "transactions", "logistics"];
    if (role === "organisation") return ["overview", "partnerships", "advertising"];
    return ["overview", "logistics"];
  }

  function statusBadge(status) {
    const className = /paid|completed|active|approved|delivered/i.test(status) ? "success" : /failed|cancelled|rejected|expired/i.test(status) ? "danger" : "warning";
    return `<span class="badge text-bg-${className}">${escapeHtml(status)}</span>`;
  }

  function metric(label, value, icon, note = "") {
    return `<div class="col-sm-6 col-xl-3"><div class="card p-3 h-100"><div class="d-flex justify-content-between align-items-start"><span class="small muted">${escapeHtml(label)}</span><span class="icon-circle"><i class="bi ${icon}"></i></span></div><div class="stat-number mt-2">${value}</div>${note ? `<div class="small muted">${note}</div>` : ""}</div></div>`;
  }

  function table(headers, rows, emptyMessage = "No records yet.") {
    return `<div class="table-responsive"><table class="table align-middle"><thead><tr>${headers.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows || `<tr><td colspan="${headers.length}"><div class="empty-state">${emptyMessage}</div></td></tr>`}</tbody></table></div>`;
  }

  function plansView(kind) {
    const isFarmer = kind === "farmer";
    const plans = isFarmer ? farmerPlans : buyerPlans;
    const prices = isFarmer ? state.config.farmerPlans : state.config.buyerPlans;
    const current = state.subscriptions.find(x => x.type === kind && x.status === "Active");
    const title = isFarmer ? "Farmer subscriptions" : "Buyer subscriptions";
    return `<div class="d-flex justify-content-between flex-wrap align-items-end gap-3 mb-4"><div><div class="eyebrow">${escapeHtml(title)}</div><h2 class="section-title mb-1">Choose the plan that fits your business</h2><p class="muted mb-0">Demo subscriptions renew monthly. Payment is simulated; no money is transferred.</p></div><div class="notice">Current plan: <strong>${escapeHtml(current?.plan || (isFarmer ? "Free" : "None"))}</strong></div></div><div class="row g-3 mb-4">${plans.map((plan, index) => {
      const price = Number(prices[plan.name] ?? 0);
      const isCurrent = current?.plan === plan.name || (!current && isFarmer && plan.name === "Free");
      return `<div class="col-md-6 col-xl-3"><div class="card p-4 h-100 ${isCurrent ? "border-success border-2" : ""}"><span class="pill align-self-start">${isCurrent ? "Current plan" : plan.name}</span><h3 class="fw-bold mt-3">${escapeHtml(plan.name)}</h3><div class="price mb-3">${money(price)}<small class="muted fw-normal"> / month</small></div><ul class="small ps-3 flex-grow-1">${plan.features.map(feature => `<li class="mb-2">${escapeHtml(feature)}</li>`).join("")}</ul><button class="btn ${isCurrent ? "btn-outline-success" : "btn-success"} w-100" data-action="subscribe" data-kind="${kind}" data-plan="${escapeHtml(plan.name)}" ${isCurrent ? "disabled" : ""}>${isCurrent ? "Current plan" : price === 0 ? "Choose free plan" : current ? "Change plan" : "Select plan"}</button></div></div>`;
    }).join("")}</div><h3 class="h5 fw-bold mt-4">Subscription history and invoices</h3>${table(["Customer", "Plan", "Monthly price", "Renewal", "Status", "Invoice"], state.subscriptions.filter(x => x.type === kind).map(x => `<tr><td>${escapeHtml(x.customer)}</td><td>${escapeHtml(x.plan)}</td><td>${money(x.amount)}</td><td>${new Date(x.renewalDate).toLocaleDateString()}</td><td>${statusBadge(x.paymentStatus)}</td><td><button class="btn btn-sm btn-outline-success" data-action="receipt" data-id="${x.id}">View invoice</button></td></tr>`).join(""))}<h3 class="h5 fw-bold mt-4">Payment history</h3>${table(["Payment ID", "Service", "Amount", "Method", "Date", "Status"], state.payments.filter(x => x.service === "subscription" && x.kind === kind).map(x => `<tr><td>${escapeHtml(x.id)}</td><td>${escapeHtml(x.service)} · ${escapeHtml(x.entityId)}</td><td>${money(x.amount)}</td><td>${escapeHtml(x.method)}</td><td>${new Date(x.date).toLocaleDateString()}</td><td>${statusBadge(x.status)}</td></tr>`).join(""))}`;
  }

  function transactionRows(list, admin = false) {
    return list.map(x => `<tr><td>${escapeHtml(x.id)}</td><td>${escapeHtml(x.buyer)}</td><td>${escapeHtml(x.farmer)}</td><td>${escapeHtml(x.product)} · ${escapeHtml(x.quantity)}</td><td>${money(x.amount)}</td><td>${Number(x.commissionRate)}% · ${money(x.commission)}</td><td>${money(x.farmerPayable)}</td><td>${statusBadge(x.status)}</td><td>${new Date(x.date).toLocaleDateString()}</td><td><button class="btn btn-sm btn-outline-success" data-action="details" data-id="${x.id}">Details</button>${admin && x.status === "Pending settlement" ? ` <button class="btn btn-sm btn-success" data-action="settle" data-id="${x.id}">Settle</button>` : ""}</td></tr>`).join("");
  }

  function transactionsView(role) {
    const admin = role === "admin";
    const rows = admin ? state.transactions : state.transactions.slice(0, 8);
    const volume = state.transactions.filter(x => x.status === "Completed").reduce((sum, x) => sum + x.amount, 0);
    const earned = state.transactions.filter(x => x.status === "Completed").reduce((sum, x) => sum + x.commission, 0);
    const headers = ["ID", "Buyer", "Farmer", "Produce", "Transaction value", "Commission", "Farmer payable", "Status", "Date", "Actions"];
    return `${admin ? `<div class="row g-3 mb-4">${metric("Transaction volume", money(volume), "bi-basket")}${metric("Commission revenue", money(earned), "bi-coin")}${metric("Successful sales", state.transactions.filter(x => x.status === "Completed").length, "bi-check2-circle")}${metric("Pending settlements", state.transactions.filter(x => x.status === "Pending settlement").length, "bi-hourglass")}</div><div class="filter-panel mb-3"><div class="row g-2"><div class="col-md-4"><input id="txSearch" class="form-control" placeholder="Search farmer, buyer or produce"></div><div class="col-md-2"><select id="txStatus" class="form-select"><option value="">All statuses</option>${["Completed", "Pending settlement", "Pending payment", "Cancelled", "Failed"].map(x => `<option>${x}</option>`).join("")}</select></div><div class="col-md-2"><label class="visually-hidden" for="txFrom">From date</label><input id="txFrom" class="form-control" type="date"></div><div class="col-md-2"><label class="visually-hidden" for="txTo">To date</label><input id="txTo" class="form-control" type="date"></div><div class="col-md-2"><button class="btn btn-outline-success w-100" data-action="export" data-export="transactions">Export CSV</button></div></div></div>` : `<div class="d-flex justify-content-between flex-wrap gap-3 mb-4"><div><div class="eyebrow">Marketplace commerce</div><h2 class="section-title mb-1">${role === "farmer" ? "My sales and earnings" : "Procurement and transactions"}</h2><p class="muted">Successful produce purchases contribute only the configured platform commission to revenue.</p></div>${role === "buyer" ? `<button class="btn btn-success" data-action="new-transaction"><i class="bi bi-cart-plus me-2"></i>Simulate produce purchase</button>` : ""}</div>`}${table(headers, transactionRows(rows, admin), "No matching produce transactions.")}`;
  }

  function advertisingView(role) {
    const admin = role === "admin";
    const revenue = state.revenue.filter(x => x.source === "Advertising").reduce((sum, x) => sum + x.amount, 0);
    const campaigns = state.campaigns;
    return `${admin ? `<div class="row g-3 mb-4">${metric("Advertising revenue", money(revenue), "bi-megaphone")}${metric("Active campaigns", campaigns.filter(x => x.status === "Active").length, "bi-broadcast")}${metric("Total impressions", campaigns.reduce((sum, x) => sum + x.impressions, 0).toLocaleString(), "bi-eye")}${metric("Product clicks", campaigns.reduce((sum, x) => sum + x.clicks, 0).toLocaleString(), "bi-cursor")}</div>` : `<div class="mb-4"><div class="eyebrow">Advertising marketplace</div><h2 class="section-title mb-1">Promote your farm or business</h2><p class="muted">Choose a visibility package. Each campaign is reviewed before going live.</p></div><div class="card p-4 mb-4"><h3 class="h5 fw-bold">Create a campaign</h3><form id="adForm" class="row g-3"><div class="col-md-4"><label class="form-label">Promotion package</label><select class="form-select" name="type" required>${Object.keys(state.config.ads).map(x => `<option>${escapeHtml(x)} · ${money(state.config.ads[x])}</option>`).join("")}</select></div><div class="col-md-4"><label class="form-label">Product or business to feature</label><input class="form-control" name="title" required maxlength="100" placeholder="e.g. Fresh tomato harvest"></div><div class="col-md-4"><label class="form-label">Campaign duration</label><select class="form-select" name="duration"><option value="7">7 days</option><option value="30">30 days</option></select></div><div class="col-12"><button class="btn btn-success">Continue to payment</button></div></form></div>`}<h3 class="h5 fw-bold">${admin ? "Campaign review and performance" : "My campaigns"}</h3>${table(["Campaign", "Customer", "Package", "Duration", "Price", "Impressions", "Clicks", "Click rate", "Status", "Actions"], campaigns.map(x => `<tr><td>${escapeHtml(x.title)}</td><td>${escapeHtml(x.customer)}</td><td>${escapeHtml(x.type)}</td><td>${x.duration} days</td><td>${money(x.amount)}</td><td>${x.impressions.toLocaleString()}</td><td>${x.clicks.toLocaleString()}</td><td>${x.impressions ? `${(x.clicks * 100 / x.impressions).toFixed(1)}%` : "—"}</td><td>${statusBadge(x.status)}</td><td>${admin && x.status === "Pending approval" ? `<button class="btn btn-sm btn-success" data-action="campaign-status" data-id="${x.id}" data-status="Active">Approve</button> <button class="btn btn-sm btn-outline-danger" data-action="campaign-status" data-id="${x.id}" data-status="Rejected">Reject</button>` : admin && x.status === "Active" ? `<button class="btn btn-sm btn-outline-warning" data-action="campaign-status" data-id="${x.id}" data-status="Paused">Pause</button>` : !admin ? `<button class="btn btn-sm btn-outline-success" data-action="receipt" data-id="${x.id}">Invoice</button>` : "—"}</td></tr>`).join(""))}`;
  }

  function partnershipView(role) {
    const admin = role === "admin";
    const revenue = state.revenue.filter(x => x.source === "Partnership").reduce((sum, x) => sum + x.amount, 0);
    return `${admin ? `<div class="row g-3 mb-4">${metric("Partnership revenue", money(revenue), "bi-building")}${metric("Partner organisations", state.partnershipDirectory.length, "bi-people")}${metric("Applications to review", state.partnerships.filter(x => x.status === "Pending review").length, "bi-file-earmark-check")}${metric("Active partnerships", state.partnerships.filter(x => x.status === "Approved").length, "bi-diagram-3")}</div>` : `<div class="mb-4"><div class="eyebrow">Institutional partnerships</div><h2 class="section-title mb-1">Reach farmers through a trusted local network</h2><p class="muted">Apply for outreach, training, farmer registration and programme-promotion services.</p></div><div class="row g-3 mb-4">${Object.entries(state.config.partnerships).map(([name, price]) => `<div class="col-md-4"><div class="card p-3 h-100"><h3 class="h6 fw-bold">${escapeHtml(name)}</h3><div class="price">${money(price)} <small class="muted fw-normal">/ campaign</small></div></div></div>`).join("")}</div><div class="card p-4 mb-4"><h3 class="h5 fw-bold">Partnership application</h3><form id="partnershipForm" class="row g-3"><div class="col-md-6"><label class="form-label">Organisation name</label><input class="form-control" name="organisation" required maxlength="120"></div><div class="col-md-6"><label class="form-label">Organisation type</label><select name="type" class="form-select"><option>NGO</option><option>Government programme</option><option>Financial institution</option><option>Training institution</option><option>Agricultural business</option></select></div><div class="col-md-4"><label class="form-label">Contact person</label><input class="form-control" name="contact" required maxlength="80"></div><div class="col-md-4"><label class="form-label">Email</label><input class="form-control" name="email" type="email" required></div><div class="col-md-4"><label class="form-label">Phone</label><input class="form-control" name="phone" required></div><div class="col-md-4"><label class="form-label">Requested service</label><select name="service" class="form-select">${Object.keys(state.config.partnerships).map(x => `<option>${escapeHtml(x)}</option>`).join("")}</select></div><div class="col-md-4"><label class="form-label">Expected audience</label><input class="form-control" name="audience" required placeholder="e.g. Central Region farmers"></div><div class="col-md-2"><label class="form-label">Duration (days)</label><input class="form-control" name="duration" type="number" min="1" value="30" required></div><div class="col-md-2"><label class="form-label">Proposed budget (GH₵)</label><input class="form-control" name="budget" type="number" min="0" value="${Number(state.config.partnerships["Community outreach"])}" required></div><div class="col-12"><label class="form-label">Organisation description</label><textarea class="form-control" name="description" rows="2" maxlength="500" required></textarea></div><div class="col-12"><button class="btn btn-success">Submit application</button></div></form></div>`}<h3 class="h5 fw-bold">${admin ? "Review partnership applications and campaigns" : "My partnership applications and invoices"}</h3>${table(["Organisation", "Type", "Contact", "Service", "Audience", "Budget", "Payment", "Application status", "Actions"], state.partnerships.map(x => `<tr><td>${escapeHtml(x.organisation)}</td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.contact)}</td><td>${escapeHtml(x.service)}</td><td>${escapeHtml(x.audience)}</td><td>${money(x.budget)}</td><td>${statusBadge(x.paymentStatus)}</td><td>${statusBadge(x.status)}</td><td>${admin && x.status === "Pending review" ? `<button class="btn btn-sm btn-success" data-action="partnership-status" data-id="${x.id}" data-status="Approved">Approve</button> <button class="btn btn-sm btn-outline-danger" data-action="partnership-status" data-id="${x.id}" data-status="Rejected">Reject</button>` : `<button class="btn btn-sm btn-outline-success" data-action="receipt" data-id="${x.id}">Invoice</button>`}</td></tr>`).join(""))}`;
  }

  function logisticsView(role) {
    const admin = role === "admin";
    const operator = role === "transport";
    const revenue = state.revenue.filter(x => x.source === "Logistics commission").reduce((sum, x) => sum + x.amount, 0);
    const requests = state.logistics;
    return `${admin ? `<div class="row g-3 mb-4">${metric("Delivery requests", requests.length, "bi-truck")}${metric("Active deliveries", requests.filter(x => !["Completed", "Cancelled"].includes(x.status)).length, "bi-box-seam")}${metric("Completed deliveries", requests.filter(x => x.status === "Completed").length, "bi-check2-circle")}${metric("Logistics commissions", money(revenue), "bi-coin")}</div>` : operator ? `<div class="mb-4"><div class="eyebrow">Transport operator workspace</div><h2 class="section-title mb-1">Delivery opportunities and earnings</h2><p class="muted">Accept a job, update delivery progress and track completed operator payouts.</p></div><div class="card p-4 mb-4"><h3 class="h5 fw-bold">Register transport business</h3><form id="operatorForm" class="row g-3"><div class="col-md-4"><label class="form-label">Business name</label><input name="name" class="form-control" required></div><div class="col-md-4"><label class="form-label">Vehicle</label><select name="vehicle" class="form-select"><option>Medium truck</option><option>Large truck</option><option>Refrigerated truck</option></select></div><div class="col-md-4"><label class="form-label">Operating region</label><input name="region" class="form-control" required placeholder="e.g. Ashanti Region"></div><div class="col-12"><button class="btn btn-success">Register transport operator</button></div></form></div>` : `<div class="mb-4"><div class="eyebrow">Produce logistics</div><h2 class="section-title mb-1">Request a delivery</h2><p class="muted">Request transport and compare operator quotations. The 10% demo coordination fee is shown separately.</p></div><div class="card p-4 mb-4"><h3 class="h5 fw-bold">New transport request</h3><form id="logisticsForm" class="row g-3"><div class="col-md-4"><label class="form-label">Produce type</label><select class="form-select" name="produce">${produce.map(x => `<option>${x}</option>`).join("")}</select></div><div class="col-md-4"><label class="form-label">Quantity</label><input class="form-control" name="quantity" required placeholder="e.g. 5 tonnes"></div><div class="col-md-4"><label class="form-label">Vehicle requirements</label><select class="form-select" name="vehicle"><option>Medium truck</option><option>Large truck</option><option>Refrigerated truck</option></select></div><div class="col-md-4"><label class="form-label">Pickup location</label><select class="form-select" name="pickup">${locations.map(x => `<option>${x}</option>`).join("")}</select></div><div class="col-md-4"><label class="form-label">Delivery location</label><select class="form-select" name="delivery">${locations.map(x => `<option>${x}</option>`).join("")}</select></div><div class="col-md-4"><label class="form-label">Estimated transport cost (GH₵)</label><input class="form-control" name="cost" type="number" min="1" value="850" required><div class="small muted">Platform fee: ${Number(state.config.logisticsCommission)}% when delivery completes.</div></div><div class="col-12"><button class="btn btn-success">Submit delivery request</button></div></form></div>`}<h3 class="h5 fw-bold">${admin ? "Logistics operations" : operator ? "Available delivery requests" : "My delivery requests"}</h3>${table(["ID", "Buyer", "Produce / quantity", "Route", "Vehicle", "Transport cost", "Platform fee", "Operator payout", "Status", "Actions"], requests.map(x => {
      const actions = admin && ["Awaiting quotations", "Quotation received"].includes(x.status) ? `<button class="btn btn-sm btn-success" data-action="assign-operator" data-id="${x.id}">Assign operator</button>` : operator && ["Awaiting quotations", "Request submitted"].includes(x.status) ? `<button class="btn btn-sm btn-success" data-action="accept-job" data-id="${x.id}">Submit quotation</button>` : operator && x.status === "Transport assigned" ? `<button class="btn btn-sm btn-outline-success" data-action="delivery-status" data-id="${x.id}" data-status="Pickup in progress">Start pickup</button>` : operator && x.status === "Pickup in progress" ? `<button class="btn btn-sm btn-outline-success" data-action="delivery-status" data-id="${x.id}" data-status="In transit">Start transit</button>` : operator && x.status === "In transit" ? `<button class="btn btn-sm btn-success" data-action="delivery-status" data-id="${x.id}" data-status="Delivered">Mark delivered</button>` : operator && x.status === "Delivered" ? `<button class="btn btn-sm btn-success" data-action="pay-delivery" data-id="${x.id}">Confirm delivery and payout</button>` : "—";
      const deliveryCost = Number(x.quote || x.cost);
      const deliveryCommission = x.commission || calculateLogisticsCommission(deliveryCost);
      return `<tr><td>${escapeHtml(x.id)}</td><td>${escapeHtml(x.buyer)}</td><td>${escapeHtml(x.produce)} · ${escapeHtml(x.quantity)}</td><td>${escapeHtml(x.pickup)} → ${escapeHtml(x.delivery)}</td><td>${escapeHtml(x.vehicle)}${x.operator ? `<div class="small muted">${escapeHtml(x.operator)}</div>` : ""}</td><td>${money(deliveryCost)}${x.quote ? `<div class="small muted">Operator quote</div>` : ""}</td><td>${money(deliveryCommission)}</td><td>${money(deliveryCost - deliveryCommission)}</td><td>${statusBadge(x.status)}</td><td>${actions}</td></tr>`;
    }).join(""))}<div class="notice mt-3">Demo request estimates and commissions are illustrative. No carrier booking or real payment is made.</div>`;
  }

  function settingsView() {
    const inputs = [
      ["transactionCommission", "Produce transaction commission (%)", state.config.transactionCommission],
      ["logisticsCommission", "Logistics commission (%)", state.config.logisticsCommission],
      ...Object.entries(state.config.farmerPlans).map(([key, value]) => [`farmerPlans.${key}`, `Farmer ${key} subscription (GH₵ / month)`, value]),
      ...Object.entries(state.config.buyerPlans).map(([key, value]) => [`buyerPlans.${key}`, `Buyer ${key} subscription (GH₵ / month)`, value]),
      ...Object.entries(state.config.ads).map(([key, value]) => [`ads.${key}`, `${key} price (GH₵)`, value]),
      ...Object.entries(state.config.partnerships).map(([key, value]) => [`partnerships.${key}`, `${key} package (GH₵)`, value])
    ];
    return `<div class="mb-4"><div class="eyebrow">Financial controls</div><h2 class="section-title mb-1">Revenue settings</h2><p class="muted">Changes update future quotes and subscriptions. Existing paid records retain the rate captured at purchase.</p></div><form id="settingsForm" class="card p-4"><div class="row g-3">${inputs.map(([name, label, value]) => `<div class="col-md-6 col-xl-4"><label class="form-label" for="setting-${name.replace(/[. ]/g, "-")}">${escapeHtml(label)}</label><input class="form-control" id="setting-${name.replace(/[. ]/g, "-")}" name="${escapeHtml(name)}" type="number" min="0" max="${name.endsWith("Commission") ? "100" : "10000000"}" step="0.01" value="${Number(value)}" required></div>`).join("")}</div><div class="mt-4"><button class="btn btn-success">Review and save settings</button></div></form><div class="notice mt-3">A confirmation step is required before changes are saved. Demo settings are stored only in this browser.</div>`;
  }

  function revenueRows() {
    const search = (document.getElementById("revenueSearch")?.value || "").toLowerCase();
    const source = document.getElementById("revenueSource")?.value || "";
    const sort = document.getElementById("revenueSort")?.value || "date-desc";
    const records = state.revenue.filter(x => x.status === "Paid" && (!source || x.source === source) && `${x.id} ${x.source} ${x.customer} ${x.description}`.toLowerCase().includes(search));
    records.sort((a, b) => sort === "amount-desc" ? b.amount - a.amount : sort === "amount-asc" ? a.amount - b.amount : sort === "date-asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
    return records.map(x => `<tr><td>${escapeHtml(x.id)}</td><td>${escapeHtml(x.source)}</td><td>${escapeHtml(x.customer)}</td><td>${escapeHtml(x.description)}</td><td>${money(x.amount)}</td><td>${escapeHtml(x.paymentMethod)}</td><td>${new Date(x.date).toLocaleDateString()}</td><td>${statusBadge(x.status)}</td><td><button class="btn btn-sm btn-outline-success" data-action="revenue-details" data-id="${x.id}">Details</button></td></tr>`).join("");
  }

  function chartsMarkup() {
    return `<div class="row g-3 mt-1"><div class="col-lg-7"><div class="card p-3"><h3 class="h6 fw-bold">Monthly platform revenue</h3><canvas id="revenueMonthly" height="115"></canvas></div></div><div class="col-lg-5"><div class="card p-3"><h3 class="h6 fw-bold">Revenue by source</h3><canvas id="revenueSources" height="150"></canvas></div></div><div class="col-lg-6"><div class="card p-3"><h3 class="h6 fw-bold">Produce transaction volume</h3><canvas id="transactionVolume" height="125"></canvas></div></div><div class="col-lg-6"><div class="card p-3"><h3 class="h6 fw-bold">Subscription growth</h3><canvas id="subscriptionGrowth" height="125"></canvas></div></div><div class="col-lg-6"><div class="card p-3"><h3 class="h6 fw-bold">Advertising campaign clicks</h3><canvas id="campaignPerformance" height="125"></canvas></div></div><div class="col-lg-6"><div class="card p-3"><h3 class="h6 fw-bold">Logistics commission trend</h3><canvas id="logisticsTrend" height="125"></canvas></div></div></div>`;
  }

  function overviewView(role) {
    const total = calculateTotalPlatformRevenue();
    const completedTransactions = state.transactions.filter(x => x.status === "Completed");
    const transactionRevenue = state.revenue.filter(x => x.source === "Transaction commission").reduce((sum, x) => sum + x.amount, 0);
    const farmerRevenue = state.revenue.filter(x => x.source === "Farmer subscription").reduce((sum, x) => sum + x.amount, 0);
    const buyerRevenue = state.revenue.filter(x => x.source === "Buyer subscription").reduce((sum, x) => sum + x.amount, 0);
    const adRevenue = state.revenue.filter(x => x.source === "Advertising").reduce((sum, x) => sum + x.amount, 0);
    const partnershipRevenue = state.revenue.filter(x => x.source === "Partnership").reduce((sum, x) => sum + x.amount, 0);
    const logisticsRevenue = state.revenue.filter(x => x.source === "Logistics commission").reduce((sum, x) => sum + x.amount, 0);
    const mrr = state.subscriptions.filter(x => x.status === "Active" && x.paymentStatus === "Paid").reduce((sum, x) => sum + x.amount, 0);
    if (role !== "admin") {
      const tabs = dashboardTabs(role).filter(x => x !== "overview");
      return `<div class="mb-4"><div class="eyebrow">${escapeHtml(roleLabels[role])} workspace</div><h2 class="section-title">Welcome to your business dashboard</h2><p class="muted">Explore your tools below. Demo payments are simulated and no real money is moved.</p></div><div class="row g-3">${metric("Platform marketplace", "Open", "bi-shop", `<a href="marketplace.html">Browse listings</a>`)}${metric("Available services", tabs.length, "bi-grid-1x2", "Choose a workspace module from the sidebar.")}${metric("Demo payment methods", "3", "bi-credit-card", "Mobile Money, card or bank transfer.")}${metric("Business data", "Saved", "bi-cloud-check", "Your demo activity persists in this browser.")}</div><div class="row g-3 mt-2">${tabs.map(tab => `<div class="col-md-6 col-xl-4"><button class="card p-4 w-100 text-start h-100 portal-shortcut" data-action="tab" data-tab="${tab}"><span class="icon-circle mb-3"><i class="bi ${tab === "subscriptions" ? "bi-stars" : tab === "advertising" ? "bi-megaphone" : tab === "partnerships" ? "bi-building" : tab === "logistics" ? "bi-truck" : "bi-receipt"}"></i></span><strong>${escapeHtml(tabNames[tab])}</strong><span class="small muted mt-2">Open your ${escapeHtml(tabNames[tab].toLowerCase())} tools.</span></button></div>`).join("")}</div>`;
    }
    const sources = [
      ["Transaction commissions", transactionRevenue], ["Farmer subscriptions", farmerRevenue],
      ["Buyer subscriptions", buyerRevenue], ["Advertising", adRevenue],
      ["Partnerships", partnershipRevenue], ["Logistics", logisticsRevenue]
    ];
    const average = completedTransactions.length ? completedTransactions.reduce((sum, x) => sum + x.amount, 0) / completedTransactions.length : 0;
    return `<div class="mb-4"><div class="eyebrow">Commercial performance</div><h2 class="section-title mb-1">Platform revenue overview</h2><p class="muted">Revenue includes paid platform fees only—not gross agricultural or transport transaction value.</p></div><div class="row g-3">${metric("Total platform revenue", money(total), "bi-cash-stack")}${metric("Produce commissions", money(transactionRevenue), "bi-basket")}${metric("Farmer subscription revenue", money(farmerRevenue), "bi-person-check")}${metric("Buyer subscription revenue", money(buyerRevenue), "bi-building-check")}${metric("Advertising revenue", money(adRevenue), "bi-megaphone")}${metric("Partnership revenue", money(partnershipRevenue), "bi-diagram-3")}${metric("Logistics commissions", money(logisticsRevenue), "bi-truck")}${metric("Monthly recurring revenue", money(mrr), "bi-arrow-repeat")}</div><div class="row g-3 mt-1">${metric("Transaction volume", money(completedTransactions.reduce((sum, x) => sum + x.amount, 0)), "bi-box-seam")}${metric("Successful transactions", completedTransactions.length, "bi-check2-circle")}${metric("Average transaction", money(average), "bi-graph-up")}${metric("Pending settlements", state.transactions.filter(x => x.status === "Pending settlement").length, "bi-hourglass")}</div>${chartsMarkup()}<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4"><h3 class="h5 fw-bold mb-0">Revenue ledger</h3><button class="btn btn-outline-success btn-sm" data-action="export" data-export="revenue">Export revenue CSV</button></div><div class="filter-panel my-3"><div class="row g-2"><div class="col-md-5"><label class="visually-hidden" for="revenueSearch">Search revenue</label><input id="revenueSearch" class="form-control" placeholder="Search customer, source or description"></div><div class="col-md-4"><select id="revenueSource" class="form-select"><option value="">All revenue sources</option>${[...new Set(state.revenue.map(x => x.source))].map(x => `<option>${escapeHtml(x)}</option>`).join("")}</select></div><div class="col-md-3"><select id="revenueSort" class="form-select"><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="amount-desc">Largest amount</option><option value="amount-asc">Smallest amount</option></select></div></div></div>${table(["Revenue ID", "Source", "Customer", "Description", "Platform revenue", "Payment method", "Date", "Payment", "Actions"], revenueRows()).replace("<tbody>", '<tbody id="revenueRows">')}`;
  }

  function tabContent(role, tab) {
    if (tab === "overview") return overviewView(role);
    if (tab === "transactions") return transactionsView(role);
    if (tab === "subscriptions") {
      if (role === "admin") {
        const active = state.subscriptions.filter(x => x.status === "Active");
        const recurring = active.filter(x => x.paymentStatus === "Paid").reduce((sum, x) => sum + x.amount, 0);
        const paid = state.revenue.filter(x => x.source.includes("subscription")).reduce((sum, x) => sum + x.amount, 0);
        const conversion = state.subscriptions.length ? Math.round(active.length * 100 / state.subscriptions.length) : 0;
        return `<div class="row g-3 mb-4">${metric("Active subscriptions", active.length, "bi-person-check")}${metric("Expired subscriptions", state.subscriptions.filter(x => x.status === "Expired").length, "bi-person-x")}${metric("Monthly recurring revenue", money(recurring), "bi-arrow-repeat")}${metric("Subscription revenue", money(paid), "bi-cash-coin")}${metric("Demo conversion rate", `${conversion}%`, "bi-graph-up-arrow")}</div><div class="card p-3 mb-3"><canvas id="planPopularity" height="85"></canvas></div><h3 class="h5 fw-bold">All subscriptions</h3>${table(["ID", "Account type", "Customer", "Plan", "Price", "Renewal", "Payment", "Status"], state.subscriptions.map(x => `<tr><td>${escapeHtml(x.id)}</td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.customer)}</td><td>${escapeHtml(x.plan)}</td><td>${money(x.amount)}</td><td>${new Date(x.renewalDate).toLocaleDateString()}</td><td>${statusBadge(x.paymentStatus)}</td><td>${statusBadge(x.status)}</td></tr>`).join(""))}`;
      }
      return plansView(role === "buyer" ? "buyer" : "farmer");
    }
    if (tab === "advertising") return advertisingView(role);
    if (tab === "partnerships") return partnershipView(role);
    if (tab === "logistics") return logisticsView(role);
    if (tab === "settings") return settingsView();
    return `<div class="empty-state">This workspace is not available for the selected role.</div>`;
  }

  function renderPortal() {
    document.querySelectorAll("canvas").forEach(canvas => {
      const existing = charts.find(chart => chart.canvas === canvas);
      if (existing) { existing.destroy(); charts = charts.filter(chart => chart !== existing); }
    });
    const items = dashboardTabs(currentRole);
    if (!items.includes(currentTab)) currentTab = "overview";
    const navIcon = { overview: "bi-grid", transactions: "bi-receipt", subscriptions: "bi-stars", advertising: "bi-megaphone", partnerships: "bi-building", logistics: "bi-truck", settings: "bi-gear" };
    const content = `<div class="container-fluid"><div class="row"><aside class="col-lg-2 sidebar"><div class="small text-uppercase muted fw-bold px-3 mb-2">${escapeHtml(roleLabels[currentRole])} workspace</div>${items.map(tab => `<a href="#" class="${currentTab === tab ? "active" : ""}" data-tab="${tab}"><i class="bi ${navIcon[tab]}"></i>${escapeHtml(tabNames[tab])}</a>`).join("")}<hr><a href="index.html"><i class="bi bi-house"></i>Public website</a><a href="marketplace.html"><i class="bi bi-shop"></i>Marketplace</a></aside><main class="col-lg-10 dash-main"><div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"><div><div class="eyebrow">AgroConnect · demo workspace</div><h1 class="section-title h2 mb-0">${escapeHtml(roleLabels[currentRole])} dashboard</h1></div><div class="d-flex align-items-center gap-2"><label class="small muted" for="roleSwitcher">Switch role</label><select id="roleSwitcher" class="form-select form-select-sm" style="width:auto">${Object.entries(roleLabels).map(([role, label]) => `<option value="${role}" ${role === currentRole ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></div></div><section id="portalContent">${tabContent(currentRole, currentTab)}</section><div class="notice mt-4">Prototype only: payments, subscriptions, commissions and delivery activity are simulated in this browser. No real money is transferred.</div></main></div></div>${modalMarkup()}`;
    document.body.innerHTML = nav() + content + footer();
    if (!document.body.dataset.portalWired) {
      document.body.addEventListener("click", handleClick);
      document.body.addEventListener("submit", handleSubmit);
      document.body.addEventListener("change", handleChange);
      document.body.dataset.portalWired = "true";
    }
    drawCharts();
  }

  function modalMarkup() {
    return `<div class="modal fade" id="businessModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content border-0 rounded-4"><div class="modal-header"><h2 class="modal-title h5 fw-bold" id="businessModalTitle">Confirm</h2><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="businessModalBody"></div><div class="modal-footer" id="businessModalFooter"></div></div></div></div>`;
  }

  function openModal(title, body, buttons) {
    const modal = document.getElementById("businessModal");
    if (!modal) return;
    document.getElementById("businessModalTitle").textContent = title;
    document.getElementById("businessModalBody").innerHTML = body;
    document.getElementById("businessModalFooter").innerHTML = buttons;
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  function closeModal() {
    const modal = document.getElementById("businessModal");
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  function drawCharts() {
    if (typeof Chart === "undefined") return;
    const colors = ["#176b45", "#2d9b62", "#e5b84b", "#267b9c", "#8064a2", "#dd8050"];
    const make = (canvas, config) => {
      const element = document.getElementById(canvas);
      if (!element) return;
      charts.push(new Chart(element, config));
    };
    const monthLabels = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 5 + index);
      return date.toLocaleString("en", { month: "short" });
    });
    const monthBuckets = monthLabels.map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 5 + index);
      return state.revenue.filter(x => {
        const entryDate = new Date(x.date);
        return x.status === "Paid" && entryDate.getMonth() === date.getMonth() && entryDate.getFullYear() === date.getFullYear();
      }).reduce((sum, x) => sum + x.amount, 0);
    });
    const chartOptions = { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };
    make("revenueMonthly", { type: "line", data: { labels: monthLabels, datasets: [{ data: monthBuckets, borderColor: colors[0], backgroundColor: "rgba(45,155,98,.12)", fill: true, tension: .35 }] }, options: chartOptions });
    const sources = ["Transaction commission", "Farmer subscription", "Buyer subscription", "Advertising", "Partnership", "Logistics commission"];
    make("revenueSources", { type: "doughnut", data: { labels: sources, datasets: [{ data: sources.map(source => state.revenue.filter(x => x.source === source && x.status === "Paid").reduce((sum, x) => sum + x.amount, 0)), backgroundColor: colors }] }, options: { responsive: true, plugins: { legend: { position: "bottom" } } } });
    make("transactionVolume", { type: "line", data: { labels: monthLabels, datasets: [{ label: "Transaction value", data: monthLabels.map((_, i) => state.transactions.filter(x => x.status === "Completed" && new Date(x.date).getMonth() === new Date(new Date().setMonth(new Date().getMonth() - 5 + i)).getMonth()).reduce((sum, x) => sum + x.amount, 0)), borderColor: colors[3], tension: .3 }] }, options: chartOptions });
    const planNames = ["Free", "Basic", "Professional", "Agribusiness", "Starter", "Business", "Enterprise"];
    make("subscriptionGrowth", { type: "line", data: { labels: monthLabels, datasets: [{ label: "Cumulative active plans", data: monthLabels.map((_, index) => Math.max(0, state.subscriptions.filter(x => x.status === "Active").length - (monthLabels.length - index - 1))), borderColor: colors[1], tension: .3 }] }, options: chartOptions });
    make("planPopularity", { type: "bar", data: { labels: planNames, datasets: [{ label: "Subscribers", data: planNames.map(plan => state.subscriptions.filter(x => x.plan === plan && x.status === "Active").length), backgroundColor: colors }] }, options: chartOptions });
    make("campaignPerformance", { type: "bar", data: { labels: state.campaigns.slice(0, 8).map(x => x.title.slice(0, 18)), datasets: [{ label: "Clicks", data: state.campaigns.slice(0, 8).map(x => x.clicks), backgroundColor: colors[2] }] }, options: chartOptions });
    make("logisticsTrend", { type: "line", data: { labels: monthLabels, datasets: [{ label: "Platform commission", data: monthLabels.map((_, index) => state.logistics.filter(x => x.revenueId && new Date(x.createdAt).getMonth() === new Date(new Date().setMonth(new Date().getMonth() - 5 + index)).getMonth()).reduce((sum, x) => sum + x.commission, 0)), borderColor: colors[4], tension: .3 }] }, options: chartOptions });
  }

  function beginPayment(payment) {
    paymentDraft = payment;
    openModal("Confirm demo payment", `<p>${escapeHtml(payment.description)}</p><div class="d-flex justify-content-between border-top pt-3"><strong>Amount due</strong><strong>${money(payment.amount)}</strong></div><label class="form-label mt-3" for="paymentMethod">Payment method</label><select class="form-select" id="paymentMethod"><option>Mobile Money</option><option>Debit/Credit Card</option><option>Bank Transfer</option></select><label class="form-label mt-3" for="paymentOutcome">Demo outcome</label><select class="form-select" id="paymentOutcome"><option value="success">Simulate successful payment</option><option value="failure">Simulate failed payment</option></select><div class="notice mt-3">This is a local demonstration; no payment provider is contacted and no money is transferred.</div>`, `<button class="btn btn-outline-secondary" data-dismiss-modal>Cancel</button><button class="btn btn-success" data-action="confirm-payment">Confirm demo payment</button>`);
  }

  function confirmPayment() {
    if (!paymentDraft) return;
    const draft = paymentDraft;
    const method = document.getElementById("paymentMethod")?.value || "Mobile Money";
    const successful = document.getElementById("paymentOutcome")?.value !== "failure";
    const payment = addPayment({ ...draft, method }, successful);
    if (!successful) {
      if (draft.service === "transaction") {
        const transaction = state.transactions.find(x => x.id === draft.entityId);
        if (transaction) transaction.status = "Failed";
      }
      if (draft.service === "subscription") {
        const sub = state.subscriptions.find(x => x.id === draft.entityId);
        if (sub) sub.paymentStatus = "Failed";
      }
      if (draft.service === "advertising") {
        const campaign = state.campaigns.find(x => x.id === draft.entityId);
        if (campaign) campaign.paymentStatus = "Failed";
      }
      if (draft.service === "partnership") {
        const app = state.partnerships.find(x => x.id === draft.entityId);
        if (app) app.paymentStatus = "Failed";
      }
      paymentDraft = null;
      save();
      closeModal();
      notify("Demo payment failed. No revenue was recorded.");
      renderPortal();
      return;
    }
    let revenue = null;
    if (draft.service === "transaction") {
      const transaction = state.transactions.find(x => x.id === draft.entityId);
      if (transaction && transaction.status !== "Completed") {
        transaction.status = "Completed";
        transaction.paymentMethod = method;
        transaction.commissionRate = Number(state.config.transactionCommission);
        transaction.commission = calculateTransactionCommission(transaction.amount, transaction.commissionRate);
        transaction.farmerPayable = transaction.amount - transaction.commission;
        transaction.revenueId = id("REV");
        revenue = { id: transaction.revenueId, source: "Transaction commission", customer: transaction.buyer, description: `${transaction.product} purchase · ${transaction.farmer}`, amount: transaction.commission, paymentMethod: method, date: payment.date, status: "Paid", sourceId: transaction.id };
      }
    } else if (draft.service === "subscription") {
      const prior = state.subscriptions.find(x => x.type === draft.kind && x.status === "Active");
      if (prior) prior.status = "Replaced";
      const subscription = state.subscriptions.find(x => x.id === draft.entityId);
      if (subscription) {
        subscription.status = "Active";
        subscription.paymentStatus = "Paid";
        subscription.plan = draft.plan;
        subscription.amount = draft.amount;
        subscription.startedAt = payment.date;
        subscription.renewalDate = new Date(Date.now() + 30 * 86400000).toISOString();
        subscription.revenueId = id("REV");
        subscription.paymentMethod = method;
        revenue = { id: subscription.revenueId, source: `${draft.kind === "farmer" ? "Farmer" : "Buyer"} subscription`, customer: subscription.customer, description: `${subscription.plan} plan`, amount: calculateSubscriptionRevenue(subscription), paymentMethod: method, date: payment.date, status: "Paid", sourceId: subscription.id };
      }
    } else if (draft.service === "advertising") {
      const campaign = state.campaigns.find(x => x.id === draft.entityId);
      if (campaign) {
        campaign.paymentStatus = "Paid";
        campaign.status = "Pending approval";
        campaign.revenueId = id("REV");
        revenue = { id: campaign.revenueId, source: "Advertising", customer: campaign.customer, description: campaign.title, amount: calculateAdvertisingRevenue(campaign), paymentMethod: method, date: payment.date, status: "Paid", sourceId: campaign.id };
      }
    } else if (draft.service === "partnership") {
      const partnership = state.partnerships.find(x => x.id === draft.entityId);
      if (partnership) {
        partnership.paymentStatus = "Paid";
        partnership.status = "Pending review";
        partnership.revenueId = id("REV");
        revenue = { id: partnership.revenueId, source: "Partnership", customer: partnership.organisation, description: partnership.service, amount: calculatePartnershipRevenue(partnership), paymentMethod: method, date: payment.date, status: "Paid", sourceId: partnership.id };
      }
    } else if (draft.service === "logistics") {
      const job = state.logistics.find(x => x.id === draft.entityId);
      if (job) {
        job.status = "Completed";
        job.commissionRate = Number(state.config.logisticsCommission);
        job.commission = calculateLogisticsCommission(job.quote || job.cost, job.commissionRate);
        job.revenueId = id("REV");
        job.paymentMethod = method;
        revenue = { id: job.revenueId, source: "Logistics commission", customer: job.buyer, description: `${job.produce} delivery · ${job.operator}`, amount: job.commission, paymentMethod: method, date: payment.date, status: "Paid", sourceId: job.id };
      }
    }
    if (revenue) addRevenue(revenue);
    paymentDraft = null;
    save();
    closeModal();
    notify(`Demo payment successful. Receipt ${payment.id} is available in payment history.`);
    renderPortal();
  }

  function newTransaction() {
    const productOptions = (window.AGRO?.listings || []).map(x => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.name)} · ${escapeHtml(x.farmer)} · ${money(x.price)}/tonne</option>`).join("");
    openModal("Simulate produce purchase", `<form id="transactionForm" class="row g-3"><div class="col-12"><label class="form-label">Produce listing</label><select class="form-select" name="product" required>${productOptions}</select></div><div class="col-6"><label class="form-label">Quantity (tonnes)</label><input class="form-control" name="quantity" type="number" min="0.1" max="1000" step="0.1" value="1" required></div><div class="col-6"><label class="form-label">Buyer business</label><select class="form-select" name="buyer">${buyerNames.map(x => `<option>${escapeHtml(x)}</option>`).join("")}</select></div><div class="col-12 small muted">The ${Number(state.config.transactionCommission)}% commission is calculated from the purchase value and recorded only when the simulated payment succeeds.</div></form>`, `<button class="btn btn-outline-secondary" data-dismiss-modal>Cancel</button><button class="btn btn-success" data-action="prepare-transaction">Continue</button>`);
  }

  function prepareTransaction() {
    const form = document.getElementById("transactionForm");
    if (!form?.reportValidity()) return;
    const formData = new FormData(form);
    const product = (window.AGRO?.listings || []).find(x => String(x.id) === formData.get("product"));
    if (!product) return;
    const quantity = Number(formData.get("quantity"));
    const amount = Math.round(product.price * quantity * 100) / 100;
    const transaction = {
      id: id("TX"), buyer: String(formData.get("buyer")), farmer: product.farmer,
      product: product.name, quantity: `${quantity} tonnes`, unitPrice: product.price,
      amount, commissionRate: Number(state.config.transactionCommission), commission: 0,
      farmerPayable: amount, status: "Pending payment", paymentMethod: "",
      date: new Date().toISOString(), revenueId: null
    };
    state.transactions.unshift(transaction);
    save();
    beginPayment({ service: "transaction", entityId: transaction.id, amount, description: `${transaction.product} · ${transaction.quantity}`, customer: transaction.buyer });
  }

  function handleClick(event) {
    const tabLink = event.target.closest("[data-tab]");
    if (tabLink) {
      event.preventDefault();
      currentTab = tabLink.dataset.tab;
      renderPortal();
      return;
    }
    const target = event.target.closest("[data-action]");
    if (!target) {
      if (event.target.closest("[data-dismiss-modal]")) closeModal();
      return;
    }
    const action = target.dataset.action;
    const entityId = target.dataset.id;
    if (action === "tab") {
      currentTab = target.dataset.tab;
      renderPortal();
      return;
    }
    if (action === "confirm-payment") return confirmPayment();
    if (action === "new-transaction") return newTransaction();
    if (action === "prepare-transaction") return prepareTransaction();
    if (action === "subscribe") return subscribe(target.dataset.kind, target.dataset.plan);
    if (action === "receipt") return showReceipt(entityId);
    if (action === "details") return showTransactionDetails(entityId);
    if (action === "revenue-details") return showRevenueDetails(entityId);
    if (action === "export") return exportCsv(target.dataset.export);
    if (action === "campaign-status") {
      const campaign = state.campaigns.find(x => x.id === entityId);
      if (campaign) { campaign.status = target.dataset.status; save(); notify(`Campaign ${campaign.status.toLowerCase()}.`); renderPortal(); }
    }
    if (action === "partnership-status") {
      const partnership = state.partnerships.find(x => x.id === entityId);
      if (partnership) { partnership.status = target.dataset.status; if (partnership.status === "Approved" && !state.partnershipDirectory.includes(partnership.organisation)) state.partnershipDirectory.push(partnership.organisation); save(); notify(`Partnership ${partnership.status.toLowerCase()}.`); renderPortal(); }
    }
    if (action === "settle") {
      const transaction = state.transactions.find(x => x.id === entityId);
      if (transaction) { transaction.status = "Completed"; transaction.commissionRate = Number(state.config.transactionCommission); transaction.commission = calculateTransactionCommission(transaction.amount, transaction.commissionRate); transaction.farmerPayable = transaction.amount - transaction.commission; transaction.revenueId = id("REV"); addRevenue({ id: transaction.revenueId, source: "Transaction commission", customer: transaction.buyer, description: `${transaction.product} purchase · ${transaction.farmer}`, amount: transaction.commission, paymentMethod: transaction.paymentMethod || "Bank Transfer", date: new Date().toISOString(), status: "Paid", sourceId: transaction.id }); save(); notify("Settlement completed; platform commission recorded once."); renderPortal(); }
    }
    if (action === "assign-operator") assignOperator(entityId);
    if (action === "accept-job") acceptJob(entityId);
    if (action === "delivery-status") updateDelivery(entityId, target.dataset.status);
    if (action === "pay-delivery") {
      const job = state.logistics.find(x => x.id === entityId);
      if (job?.status === "Delivered") {
        const cost = Number(job.quote || job.cost);
        beginPayment({ service: "logistics", entityId: job.id, amount: cost, customer: job.buyer, description: `Delivery ${job.id} · ${job.produce} · carrier payout ${money(cost - calculateLogisticsCommission(cost))}` });
      }
    }
    if (action === "confirm-operator") {
      const job = state.logistics.find(x => x.id === entityId);
      const operator = document.getElementById("operatorChoice")?.value;
      if (job && operator) { job.operator = operator; job.status = "Transport assigned"; save(); closeModal(); notify("Transport operator assigned."); renderPortal(); }
    }
    if (action === "confirm-accept-job") {
      const job = state.logistics.find(x => x.id === entityId);
      const quote = Number(document.getElementById("operatorQuote")?.value);
      if (job && Number.isFinite(quote) && quote > 0) { job.operator = target.dataset.operator; job.quote = quote; job.status = "Quotation received"; save(); closeModal(); notify("Transport quotation submitted for administrator review."); renderPortal(); }
    }
    if (action === "save-settings") {
      try {
        const values = JSON.parse(target.dataset.settings);
        for (const [key, raw] of Object.entries(values)) {
          const value = Number(raw);
          if (!Number.isFinite(value) || value < 0 || (key.endsWith("Commission") && value > 100)) throw new Error(`Invalid financial setting: ${key}`);
          const [group, name] = key.split(".");
          if (name) state.config[group][name] = value;
          else state.config[group] = value;
        }
        save();
        closeModal();
        notify("Revenue settings saved for future demo activity.");
        renderPortal();
      } catch (error) {
        console.error("Unable to save financial settings.", error);
        notify("Settings could not be saved. Check the values and try again.");
      }
    }
  }

  function subscribe(kind, plan) {
    const prices = kind === "farmer" ? state.config.farmerPlans : state.config.buyerPlans;
    const amount = Number(prices[plan]);
    if (!Number.isFinite(amount)) return;
    if (amount === 0) {
      const prior = state.subscriptions.find(x => x.type === kind && x.status === "Active");
      if (prior) prior.status = "Replaced";
      state.subscriptions.unshift({ id: id("SUB"), type: kind, customer: kind === "farmer" ? "Mr Nartey" : "Accra Fresh Foods", plan, amount: 0, status: "Active", paymentStatus: "Paid", startedAt: new Date().toISOString(), renewalDate: new Date(Date.now() + 30 * 86400000).toISOString(), revenueId: null });
      save();
      notify("Free plan activated.");
      renderPortal();
      return;
    }
    const customer = kind === "farmer" ? "Mr Nartey" : "Accra Fresh Foods";
    const sub = { id: id("SUB"), type: kind, customer, plan, amount, status: "Pending payment", paymentStatus: "Pending", startedAt: new Date().toISOString(), renewalDate: new Date(Date.now() + 30 * 86400000).toISOString(), revenueId: null };
    state.subscriptions.unshift(sub);
    save();
    beginPayment({ service: "subscription", entityId: sub.id, kind, plan, amount, customer, description: `${kind === "farmer" ? "Farmer" : "Buyer"} ${plan} subscription · monthly` });
  }

  function showReceipt(entityId) {
    const record = state.subscriptions.find(x => x.id === entityId) || state.campaigns.find(x => x.id === entityId) || state.partnerships.find(x => x.id === entityId);
    if (!record) return;
    const customer = record.customer || record.organisation;
    openModal("Demo invoice / receipt", `<div class="notice mb-3">Demonstration invoice only. No funds were transferred.</div><dl class="row mb-0"><dt class="col-5">Record</dt><dd class="col-7">${escapeHtml(record.id)}</dd><dt class="col-5">Customer</dt><dd class="col-7">${escapeHtml(customer)}</dd><dt class="col-5">Description</dt><dd class="col-7">${escapeHtml(record.plan || record.title || record.service)}</dd><dt class="col-5">Amount</dt><dd class="col-7">${money(record.amount ?? record.budget)}</dd><dt class="col-5">Payment status</dt><dd class="col-7">${escapeHtml(record.paymentStatus)}</dd><dt class="col-5">Date</dt><dd class="col-7">${new Date(record.startedAt || record.createdAt).toLocaleString()}</dd></dl>`, `<button class="btn btn-success" data-dismiss-modal>Close</button>`);
  }

  function showTransactionDetails(entityId) {
    const transaction = state.transactions.find(x => x.id === entityId);
    if (!transaction) return;
    openModal("Produce transaction breakdown", `<dl class="row mb-0"><dt class="col-6">Transaction ID</dt><dd class="col-6">${escapeHtml(transaction.id)}</dd><dt class="col-6">Buyer</dt><dd class="col-6">${escapeHtml(transaction.buyer)}</dd><dt class="col-6">Farmer</dt><dd class="col-6">${escapeHtml(transaction.farmer)}</dd><dt class="col-6">Product / quantity</dt><dd class="col-6">${escapeHtml(transaction.product)} · ${escapeHtml(transaction.quantity)}</dd><dt class="col-6">Unit price</dt><dd class="col-6">${money(transaction.unitPrice)}</dd><dt class="col-6">Gross transaction value</dt><dd class="col-6">${money(transaction.amount)}</dd><dt class="col-6">Commission (${Number(transaction.commissionRate)}%)</dt><dd class="col-6">${money(transaction.commission)}</dd><dt class="col-6">Farmer payable</dt><dd class="col-6"><strong>${money(transaction.farmerPayable)}</strong></dd><dt class="col-6">Status</dt><dd class="col-6">${escapeHtml(transaction.status)}</dd><dt class="col-6">Date</dt><dd class="col-6">${new Date(transaction.date).toLocaleString()}</dd></dl>`, `<button class="btn btn-success" data-dismiss-modal>Close</button>`);
  }

  function showRevenueDetails(entityId) {
    const record = state.revenue.find(x => x.id === entityId);
    if (!record) return;
    openModal("Revenue record details", `<dl class="row mb-0"><dt class="col-5">Revenue ID</dt><dd class="col-7">${escapeHtml(record.id)}</dd><dt class="col-5">Source</dt><dd class="col-7">${escapeHtml(record.source)}</dd><dt class="col-5">Customer</dt><dd class="col-7">${escapeHtml(record.customer)}</dd><dt class="col-5">Description</dt><dd class="col-7">${escapeHtml(record.description)}</dd><dt class="col-5">Platform revenue</dt><dd class="col-7"><strong>${money(record.amount)}</strong></dd><dt class="col-5">Payment method / status</dt><dd class="col-7">${escapeHtml(record.paymentMethod)} / ${escapeHtml(record.status)}</dd><dt class="col-5">Date</dt><dd class="col-7">${new Date(record.date).toLocaleString()}</dd></dl>`, `<button class="btn btn-success" data-dismiss-modal>Close</button>`);
  }

  function assignOperator(jobId) {
    const job = state.logistics.find(x => x.id === jobId);
    const eligible = state.transportOperators.filter(x => x.vehicle === job?.vehicle || job?.vehicle === "Medium truck");
    if (!job || !eligible.length) return notify("No matching demo transport operators are available.");
    const cost = Number(job.quote || job.cost);
    openModal("Assign transport operator", `<p>Select a demo carrier for ${escapeHtml(job.produce)} from ${escapeHtml(job.pickup)} to ${escapeHtml(job.delivery)}.</p><select class="form-select" id="operatorChoice">${eligible.map(x => `<option value="${escapeHtml(x.name)}">${escapeHtml(x.name)} · ${escapeHtml(x.vehicle)} · ★ ${x.rating}</option>`).join("")}</select><div class="notice mt-3">Transport price: ${money(cost)}. Platform commission: ${money(calculateLogisticsCommission(cost))}.</div>`, `<button class="btn btn-outline-secondary" data-dismiss-modal>Cancel</button><button class="btn btn-success" data-action="confirm-operator" data-id="${jobId}">Assign operator</button>`);
  }

  function acceptJob(jobId) {
    const job = state.logistics.find(x => x.id === jobId);
    if (!job) return;
    const carrier = state.transportOperators.find(x => x.vehicle === job.vehicle) || state.transportOperators[0];
    openModal("Submit transport quotation", `<dl class="row"><dt class="col-5">Carrier</dt><dd class="col-7">${escapeHtml(carrier.name)}</dd><dt class="col-5">Route</dt><dd class="col-7">${escapeHtml(job.pickup)} → ${escapeHtml(job.delivery)}</dd></dl><label class="form-label" for="operatorQuote">Transport quote (GH₵)</label><input id="operatorQuote" class="form-control" type="number" min="1" step="0.01" value="${Number(job.cost)}"><div class="small muted mt-2">Platform commission rate: ${Number(state.config.logisticsCommission)}%.</div>`, `<button class="btn btn-outline-secondary" data-dismiss-modal>Cancel</button><button class="btn btn-success" data-action="confirm-accept-job" data-id="${jobId}" data-operator="${escapeHtml(carrier.name)}">Submit quotation</button>`);
  }

  function updateDelivery(jobId, status) {
    const job = state.logistics.find(x => x.id === jobId);
    if (!job) return;
    if (status === "Delivered" && currentRole === "transport") {
      job.status = "Delivered";
      save();
      notify("Delivery marked delivered. Confirm settlement to record the platform fee and operator payout.");
      return renderPortal();
    }
    job.status = status;
    save();
    notify(`Delivery status updated: ${status}.`);
    renderPortal();
  }

  function handleSubmit(event) {
    const form = event.target;
    if (form.id === "adForm") {
      event.preventDefault();
      const data = new FormData(form);
      const selected = String(data.get("type"));
      const type = Object.keys(state.config.ads).find(x => selected.startsWith(x));
      const campaign = { id: id("AD"), customer: currentRole === "organisation" ? "Green Growth Foundation" : "Mr Nartey", type, title: String(data.get("title")).trim(), duration: Number(data.get("duration")), amount: Number(state.config.ads[type]), status: "Pending payment", impressions: 0, clicks: 0, createdAt: new Date().toISOString(), paymentStatus: "Pending", revenueId: null };
      state.campaigns.unshift(campaign);
      save();
      beginPayment({ service: "advertising", entityId: campaign.id, amount: campaign.amount, customer: campaign.customer, description: `${campaign.type} · ${campaign.title} · ${campaign.duration} days` });
    }
    if (form.id === "partnershipForm") {
      event.preventDefault();
      const data = new FormData(form);
      const service = String(data.get("service"));
      const configuredPrice = Number(state.config.partnerships[service]);
      const proposed = Number(data.get("budget"));
      const budget = service === "Institutional partnership" ? proposed : configuredPrice;
      const partnership = {
        id: id("PART"), organisation: String(data.get("organisation")).trim(),
        type: String(data.get("type")), contact: String(data.get("contact")).trim(),
        email: String(data.get("email")).trim(), phone: String(data.get("phone")).trim(),
        description: String(data.get("description")).trim(), service, budget,
        audience: String(data.get("audience")).trim(), duration: Number(data.get("duration")),
        status: "Pending payment", paymentStatus: "Pending", createdAt: new Date().toISOString(), revenueId: null
      };
      state.partnerships.unshift(partnership);
      save();
      beginPayment({ service: "partnership", entityId: partnership.id, amount: budget, customer: partnership.organisation, description: `${service} campaign · ${partnership.duration} days` });
    }
    if (form.id === "logisticsForm") {
      event.preventDefault();
      const data = new FormData(form);
      const cost = Number(data.get("cost"));
      state.logistics.unshift({
        id: id("LOG"), buyer: currentRole === "buyer" ? "Accra Fresh Foods" : "Demo buyer",
        farmer: "Mr Nartey", produce: String(data.get("produce")), quantity: String(data.get("quantity")),
        pickup: String(data.get("pickup")), delivery: String(data.get("delivery")), vehicle: String(data.get("vehicle")),
        cost, commissionRate: Number(state.config.logisticsCommission), commission: 0,
        operator: "", status: "Request submitted", createdAt: new Date().toISOString(), revenueId: null
      });
      save();
      notify("Delivery request saved. Demo transport operators can now submit quotations.");
      renderPortal();
    }
    if (form.id === "operatorForm") {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name")).trim();
      if (!state.transportOperators.some(x => x.name.toLowerCase() === name.toLowerCase())) state.transportOperators.push({ name, vehicle: String(data.get("vehicle")), region: String(data.get("region")), rating: 5 });
      save();
      notify("Transport business registered in the demo directory.");
      renderPortal();
    }
    if (form.id === "settingsForm") {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form).entries());
      const fields = Object.entries(values).map(([key, value]) => {
        const [group, name] = key.split(".");
        return { group, name, value: Number(value) };
      });
      openModal("Confirm financial settings", `<p>Review the proposed configuration. These rates apply to new demo activity only.</p><div class="table-responsive"><table class="table table-sm"><tbody>${fields.map(x => `<tr><td>${escapeHtml(x.name ? `${x.group} · ${x.name}` : x.group)}</td><td class="text-end">${!x.name && x.group.endsWith("Commission") ? `${x.value}%` : money(x.value)}</td></tr>`).join("")}</tbody></table></div>`, `<button class="btn btn-outline-secondary" data-dismiss-modal>Cancel</button><button class="btn btn-success" data-action="save-settings" data-settings="${escapeHtml(JSON.stringify(values))}">Confirm and save</button>`);
    }
  }

  function handleChange(event) {
    if (event.target.id === "roleSwitcher") {
      const next = event.target.value;
      if (roleFiles[next]) location.href = roleFiles[next];
    }
    if (["txSearch", "txStatus", "txFrom", "txTo"].includes(event.target.id)) {
      const search = (document.getElementById("txSearch")?.value || "").toLowerCase();
      const status = document.getElementById("txStatus")?.value || "";
      const from = document.getElementById("txFrom")?.value || "";
      const to = document.getElementById("txTo")?.value || "";
      const rows = state.transactions.filter(x => {
        const date = x.date.slice(0, 10);
        return `${x.id} ${x.buyer} ${x.farmer} ${x.product}`.toLowerCase().includes(search) && (!status || x.status === status) && (!from || date >= from) && (!to || date <= to);
      });
      const body = document.querySelector("#portalContent tbody");
      if (body) body.innerHTML = transactionRows(rows, true) || `<tr><td colspan="10"><div class="empty-state">No matching transactions.</div></td></tr>`;
    }
    if (["revenueSearch", "revenueSource", "revenueSort"].includes(event.target.id)) {
      const body = document.getElementById("revenueRows");
      if (body) body.innerHTML = revenueRows() || `<tr><td colspan="9"><div class="empty-state">No revenue records match those filters.</div></td></tr>`;
    }
  }

  function exportCsv(kind) {
    let records, headers;
    if (kind === "transactions") {
      headers = ["Transaction ID", "Buyer", "Farmer", "Product", "Quantity", "Gross amount", "Commission rate", "Commission", "Farmer payable", "Status", "Date"];
      records = state.transactions.map(x => [x.id, x.buyer, x.farmer, x.product, x.quantity, x.amount, x.commissionRate, x.commission, x.farmerPayable, x.status, x.date]);
    } else {
      headers = ["Revenue ID", "Source", "Customer", "Description", "Amount", "Payment method", "Date", "Status"];
      records = state.revenue.filter(x => x.status === "Paid").map(x => [x.id, x.source, x.customer, x.description, x.amount, x.paymentMethod, x.date, x.status]);
    }
    const csv = [headers, ...records].map(row => row.map(value => {
      const text = String(value ?? "");
      const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safe.replace(/"/g, '""')}"`;
    }).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `agroconnect-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function renderBusinessDashboard() {
    currentRole = document.body.dataset.role || "farmer";
    if (!roleLabels[currentRole]) currentRole = "farmer";
    currentTab = "overview";
    renderPortal();
  }

  function renderSponsoredListings() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    const active = state.campaigns.filter(x => x.status === "Active" && x.paymentStatus === "Paid");
    if (!active.length) return;
    active.forEach(campaign => { campaign.impressions += 1; });
    save();
    grid.insertAdjacentHTML("afterbegin", active.map(campaign => `<div class="col-md-6 col-xl-4"><article class="card p-4 h-100 border-success"><div class="d-flex justify-content-between align-items-center"><span class="badge text-bg-success">Sponsored</span><span class="small muted">${escapeHtml(campaign.duration)} days</span></div><div class="icon-circle mt-4"><i class="bi bi-megaphone"></i></div><h3 class="h5 fw-bold mt-3">${escapeHtml(campaign.title)}</h3><p class="small muted mb-2">${escapeHtml(campaign.customer)} · ${escapeHtml(campaign.type)}</p><p class="small flex-grow-1">Promoted campaign from an AgroConnect business partner.</p><a class="btn btn-outline-success btn-sm" data-sponsored-click="${escapeHtml(campaign.id)}" href="login.html">Contact this advertiser</a></article></div>`).join(""));
    grid.querySelectorAll("[data-sponsored-click]").forEach(link => link.addEventListener("click", () => {
      const campaign = state.campaigns.find(x => x.id === link.dataset.sponsoredClick);
      if (campaign) { campaign.clicks += 1; save(); }
    }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (["dashboard", "business-dashboard"].includes(document.body.dataset.page)) renderBusinessDashboard();
    if (document.body.dataset.page === "marketplace") renderSponsoredListings();
  });
})();
