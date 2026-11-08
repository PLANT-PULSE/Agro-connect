(() => {
  "use strict";

  const cropNames = ["tomato", "maize", "cassava", "plantain", "pepper", "rice", "yam", "pineapple"];

  function getCrop(prompt) {
    const crop = cropNames.find(name => new RegExp(`\\b${name}\\b`, "i").test(prompt));
    return crop ? crop[0].toUpperCase() + crop.slice(1) : "your produce";
  }

  function generateResponse(prompt) {
    const text = prompt.trim();
    const lower = text.toLowerCase();
    const crop = getCrop(text);
    const regionMatch = text.match(/\b(?:Greater Accra|Ashanti|Eastern|Western|Central|Northern|Upper East|Upper West|Volta|Bono|Ahafo|Oti|Savannah|North East|Western North)\s+Region\b/i);
    const region = regionMatch ? regionMatch[0] : "your region";

    if (/\b(caption|social media|instagram|facebook|tiktok|post)\b/i.test(lower)) {
      return `SOCIAL POST DRAFT\n\nFresh ${crop.toLowerCase()} from ${region}, grown with care and ready for your table. 🌱\n\nLooking for quality local produce? Send us a message to discuss availability and delivery.\n\n#GhanaAgriculture #SupportLocalFarmers #AgroConnect\n\nTip: Add your harvest photo, confirmed quantity, price and contact link before posting.`;
    }

    if (/\b(listing|description|advert|promote|product copy|sell)\b/i.test(lower)) {
      return `PRODUCE LISTING DRAFT\n\nTitle: Fresh ${crop}\n\nDescription: Quality ${crop.toLowerCase()}, carefully harvested and available for buyers in ${region}. Share your required quantity and preferred collection or delivery arrangements to discuss supply.\n\nDetails to complete:\n• Quantity available: [enter quantity and unit]\n• Price: [enter price per unit]\n• Location: [community, district, region]\n• Availability: [ready now or harvest date]\n• Packaging and delivery: [add details]\n\nPlease confirm every field before publishing.`;
    }

    if (/\b(buyer|requirement|procure|purchase|sourcing|supplier)\b/i.test(lower)) {
      return `BUYER REQUIREMENT DRAFT\n\nTitle: Seeking ${crop}\n\nCommodity: ${crop}\nQuantity: [enter amount and unit]\nDelivery location: ${region}\nRequired by: [enter date]\nQuality requirements: Clean, fresh produce meeting the agreed grade and packaging requirements.\nBudget: [enter price range or mark negotiable]\n\nMessage to suppliers: Please share your available quantity, harvest or supply date, product photos, price and delivery options.\n\nReview the quantity, date and quality terms before publishing.`;
    }

    if (/\b(opportunity|grant|proposal|project|application|training|funding)\b/i.test(lower)) {
      return `PROJECT / OPPORTUNITY DRAFT\n\nTitle: Improving market access for smallholder farmers\n\nObjective: Help farmers in ${region} strengthen production planning and connect with reliable buyers.\n\nProposed activities:\n1. Identify participating farmers and their priority needs.\n2. Provide practical training and market-readiness support.\n3. Connect participants with buyers and track outcomes.\n\nExpected results: Better-prepared farmers, clearer supply information and stronger buyer connections.\n\nNext, add your organisation details, target group, timeline, budget, eligibility criteria and verified application contact. This is a draft, not a confirmed grant or funding offer.`;
    }

    if (/\b(event|workshop|meeting|field day|community day)\b/i.test(lower)) {
      return `EVENT PLAN DRAFT\n\nEvent: ${text}\nLocation: ${region} · [confirm venue]\nPurpose: Bring participants together to share practical information and agree on useful next steps.\n\nSuggested run of show:\n• 09:00 — Registration and welcome\n• 09:30 — Introductions and event objectives\n• 10:00 — Main session or demonstration\n• 11:30 — Questions and group discussion\n• 12:15 — Actions, contacts and closing\n\nPreparation checklist: Confirm date and venue, invite participants, assign a facilitator, arrange materials and refreshments, set a budget, and collect feedback. Adjust the schedule to fit your audience.`;
    }

    if (/\b(email|letter|message|invitation)\b/i.test(lower)) {
      return `MESSAGE DRAFT\n\nSubject: ${text}\n\nHello [name],\n\nI am reaching out about ${text.toLowerCase()}. We are coordinating with farmers and agricultural businesses in ${region} and would like to share the relevant details with you.\n\nPlease let me know a suitable time to discuss the next steps. You can reply with your availability or any questions.\n\nKind regards,\n[Your name]\n[Organisation and contact details]\n\nReplace the bracketed fields and check the details before sending.`;
    }

    if (/\b(poem|story|slogan|motto)\b/i.test(lower)) {
      return `A SHORT CREATIVE DRAFT\n\nFrom Ghana's soil, new green shoots rise,\nWith patient hands beneath wide skies.\nEach harvest carries hope along,\nFrom farm to market, growing strong.\n\nTheme requested: ${text}\n\nTell me the audience, tone or length you want, and you can adapt the draft further.`;
    }

    if (/\b(plan|calendar|grow|plant|farming|farm|business)\b/i.test(lower)) {
      return `${crop.toUpperCase()} FARMING / BUSINESS PLAN\n\n1. Set a target\nDefine the area, expected harvest volume, target buyer and selling period for ${crop.toLowerCase()} in ${region}.\n\n2. Prepare production\nCheck local soil and water conditions, source suitable inputs, plan labour and keep a simple record of expenses and field activities.\n\n3. Plan the market\nContact buyers before harvest, confirm quality and packaging needs, and compare transport options. Do not rely on an unconfirmed buyer or price.\n\n4. Track results\nRecord planting and harvest dates, quantities, costs, sales and lessons for the next season.\n\nBefore acting, confirm timing and crop guidance with a local agricultural extension officer; seasons and conditions vary by location.`;
    }

    if (/\b(price|market|cost|trend|rate)\b/i.test(lower)) {
      return `MARKET-PRICE CHECKLIST FOR ${crop.toUpperCase()}\n\nI can't verify live market prices in this demo. For a useful local estimate, record:\n• Market and district in ${region}\n• Price and unit (for example, GH₵ per crate or tonne)\n• Date collected and information source\n• Grade, quality and packaging\n• Transport costs and expected selling date\n\nCompare at least two recent, reliable sources before setting a price. The sample prices in this prototype are illustrative, not live quotations.`;
    }

    return `DRAFT TO BUILD ON\n\nI understood your request as:\n“${text}”\n\nHere is a practical starting structure:\n\nPurpose: ${text}\n\nSuggested content:\n• Who this is for: [name the farmers, buyers or partners]\n• Location and context: ${region}\n• Main details: [add the quantities, dates, budget or requirements that apply]\n• Next step: [state what the reader should do and how to contact you]\n\nTell me the format you want—such as a plan, listing, announcement, buyer request, proposal or social post—and I can shape the draft around it.`;
  }

  function mountChat() {
    if (document.getElementById("agroChatPanel")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <button class="btn btn-success agro-chat-launcher" id="agroChatLauncher" type="button"
        data-bs-toggle="offcanvas" data-bs-target="#agroChatPanel" aria-controls="agroChatPanel"
        aria-label="Open AgroConnect AI assistant">
        <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
        <span class="d-none d-sm-inline">Ask Agro AI</span>
      </button>
      <section class="offcanvas offcanvas-end agro-chat-panel" tabindex="-1" id="agroChatPanel"
        aria-labelledby="agroChatTitle" data-bs-scroll="false">
        <header class="offcanvas-header agro-chat-header">
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="agro-chat-avatar"><i class="bi bi-stars" aria-hidden="true"></i></span>
              <div>
                <h2 class="offcanvas-title h5 mb-0" id="agroChatTitle">AgroConnect AI</h2>
                <span class="small text-white-50">Agriculture writing assistant</span>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-light" id="agroChatClear">Clear</button>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close chat"></button>
          </div>
        </header>
        <div class="offcanvas-body d-flex flex-column p-0">
          <div class="agro-chat-notice">Prototype generator: responses are created in your browser. It is not connected to a live AI service and does not provide verified prices or professional advice.</div>
          <div class="agro-chat-messages flex-grow-1" id="agroChatMessages" role="log" aria-live="polite" aria-relevant="additions text">
            <div class="agro-chat-message assistant">
              <span class="agro-chat-speaker">AgroConnect AI</span>
              <div class="agro-chat-bubble">Hi! I can help draft a farm plan, produce listing, buyer request, project proposal or social post. Type a request below to get started.</div>
            </div>
          </div>
          <div class="agro-chat-prompts px-3 pb-2" aria-label="Example prompts">
            <button type="button" class="btn btn-sm btn-outline-success" data-chat-prompt="Write a social media caption for my tomato harvest">Write a caption</button>
            <button type="button" class="btn btn-sm btn-outline-success" data-chat-prompt="Create a maize farming plan for Ashanti Region">Make a farm plan</button>
            <button type="button" class="btn btn-sm btn-outline-success" data-chat-prompt="Draft a buyer requirement for cassava">Draft buyer request</button>
          </div>
          <form class="agro-chat-form p-3" id="agroChatForm">
            <label class="visually-hidden" for="agroChatInput">Type your request</label>
            <textarea class="form-control" id="agroChatInput" rows="2" maxlength="1000"
              placeholder="Ask for a plan, listing, proposal, caption..." required></textarea>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="small text-secondary">Up to 1,000 characters · demo only</span>
              <button class="btn btn-success" id="agroChatSend" type="submit">
                <span>Generate</span> <i class="bi bi-arrow-up-circle ms-1" aria-hidden="true"></i>
              </button>
            </div>
          </form>
        </div>
      </section>`);

    const panel = document.getElementById("agroChatPanel");
    const messages = document.getElementById("agroChatMessages");
    const form = document.getElementById("agroChatForm");
    const input = document.getElementById("agroChatInput");
    const send = document.getElementById("agroChatSend");
    const prompts = document.querySelectorAll("[data-chat-prompt]");

    const scrollToLatest = () => { messages.scrollTop = messages.scrollHeight; };
    const appendMessage = (content, speaker, className) => {
      const wrapper = document.createElement("div");
      wrapper.className = `agro-chat-message ${className}`;
      const label = document.createElement("span");
      label.className = "agro-chat-speaker";
      label.textContent = speaker;
      const bubble = document.createElement("div");
      bubble.className = "agro-chat-bubble";
      bubble.textContent = content;
      wrapper.append(label, bubble);
      messages.appendChild(wrapper);
      scrollToLatest();
      return wrapper;
    };

    async function submitPrompt(value) {
      const prompt = value.trim();
      if (!prompt || send.disabled) return;
      appendMessage(prompt, "You", "user");
      input.value = "";
      send.disabled = true;
      prompts.forEach(button => { button.disabled = true; });
      const thinking = appendMessage("Preparing a draft...", "AgroConnect AI", "assistant");
      await new Promise(resolve => setTimeout(resolve, 450));
      thinking.querySelector(".agro-chat-bubble").textContent = generateResponse(prompt);
      scrollToLatest();
      send.disabled = false;
      prompts.forEach(button => { button.disabled = false; });
      input.focus();
    }

    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      submitPrompt(input.value);
    });

    prompts.forEach(button => button.addEventListener("click", () => {
      input.value = button.dataset.chatPrompt || "";
      input.focus();
      submitPrompt(input.value);
    }));

    document.getElementById("agroChatClear").addEventListener("click", () => {
      messages.replaceChildren();
      appendMessage("Chat cleared. What would you like help drafting?", "AgroConnect AI", "assistant");
      input.focus();
    });

    panel.addEventListener("shown.bs.offcanvas", () => input.focus());
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.bootstrap?.Offcanvas) {
      console.error("AgroConnect AI chat requires the Bootstrap 5 bundle.");
      return;
    }
    mountChat();
  });
})();
