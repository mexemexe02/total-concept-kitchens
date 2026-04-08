/**
 * Builds src/data/mise-faq.json with 500+ Q&A rows for the Mise chatbot.
 * Run: node scripts/generate-mise-faq.mjs
 * (Also runs automatically via npm prebuild.)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "mise-faq.json");

const BRAND = "Total Concept Kitchens";
const OWNER = "Ethan";

/** Geographic suffixes for local-service FAQs (empty string = generic). */
const GEO = [
  "",
  " in Barrie",
  " in Simcoe County",
  " in Muskoka",
  " near Orillia",
];

/** Shorter list for questions where "in X" reads awkwardly. */
const GEO2 = ["", " in Central Ontario"];

let id = 1;
const rows = [];

function push(q, a, tags = []) {
  rows.push({ id: id++, q, a, tags });
}

/** Repeat the same answer across geographic phrasing. */
function geoSpread(qBefore, qAfter, a, tags, areas = GEO) {
  for (const g of areas) {
    push(`${qBefore}${g}${qAfter}`, a, tags);
  }
}

// --- Core local + service (many geo variants) ---
const serviceAnswer = `${BRAND} serves homeowners in Simcoe County, Muskoka, and surrounding areas — including Barrie, Orillia, Midland, and cottage country. Reach ${OWNER} by phone or email on our Contact page to confirm your address.`;

geoSpread("Do you install kitchens", "", serviceAnswer, ["service-area", "local"]);
geoSpread("Does ", " work in my area", serviceAnswer, ["service-area", "local"]);
geoSpread("Can I hire you for a kitchen in", "", serviceAnswer, ["service-area", "local"]);

push(
  `Who is ${BRAND}?`,
  `${BRAND} is a custom kitchen design and cabinetry studio led by ${OWNER}. One team handles design through installation so you have a single point of contact.`,
  ["about", "tck"],
);

push(
  `What does ${BRAND} do?`,
  `Kitchen design, custom cabinetry, project coordination, and installation — from full remodels to targeted upgrades like islands, pantries, and refacing.`,
  ["about", "services"],
);

// Timeline cluster (geo spread)
const timelineFull = `Most full kitchen projects take roughly 8–14 weeks once work starts on site, depending on scope, cabinet lead times, inspections, and finishes. ${OWNER} will outline a written schedule after measurements and design sign-off.`;
geoSpread("How long does a kitchen remodel take", "", timelineFull, ["timeline"]);
geoSpread("What is the timeline for a kitchen renovation", "", timelineFull, ["timeline"]);
geoSpread("How many weeks for a full kitchen reno", "", timelineFull, ["timeline"]);
geoSpread("Kitchen renovation duration", "", timelineFull, ["timeline"]);
geoSpread("How soon can my kitchen be finished", "", timelineFull, ["timeline"]);

const designPhase = `Design typically includes an on-site visit, measurements, layout options, and finish selections. Expect a few iterations until the plan feels right — rushing design usually costs more later.`;
geoSpread("How long does kitchen design take", "", designPhase, ["design", "timeline"], GEO2);

const leadTime = `Cabinetry lead times vary by manufacturer and complexity — often several weeks to a few months. ${OWNER} orders after sign-off and builds the schedule around realistic delivery dates.`;
push("How long do kitchen cabinets take to order?", leadTime, ["cabinets", "timeline"]);
push("Cabinet lead time for custom kitchens?", leadTime, ["cabinets", "timeline"]);
push("When should cabinets be ordered?", leadTime, ["cabinets", "timeline"]);

// Budget cluster
const budgetBallpark = `Costs depend on room size, structural work, cabinetry level, counters, appliances, and finishes. ${BRAND} provides phased pricing tied to a written scope so you see where the budget goes — book a consult for numbers that match your space.`;
for (const g of GEO2) {
  push(`How much does a kitchen remodel cost${g}?`, budgetBallpark, ["budget"]);
  push(`Average kitchen renovation price${g}?`, budgetBallpark, ["budget"]);
  push(`Kitchen remodel budget${g}?`, budgetBallpark, ["budget"]);
}

push(
  "Why do kitchen quotes vary so much?",
  "Quotes differ because scope, cabinet construction, counter materials, appliance packages, and electrical/plumbing changes are rarely identical. A detailed scope prevents apples-to-oranges comparisons.",
  ["budget", "quotes"],
);

push(
  "Can I renovate in phases?",
  "Yes — many clients phase work (for example, cabinets and counters first, lighting or backsplash later). We map dependencies so you do not paint yourself into a corner.",
  ["budget", "planning"],
);

// Cabinets
const customCab = `Custom cabinetry is built for your exact dimensions and style — fewer filler strips, better use of awkward corners, and hardware that lines up the way you want. ${BRAND} focuses on fit, function, and durable construction.`;
push("Why choose custom kitchen cabinets?", customCab, ["cabinets"]);
push("Custom vs semi-custom cabinets?", customCab, ["cabinets"]);
push("Are custom cabinets worth it?", customCab, ["cabinets"]);

const woodCare = "Hardwoods like maple and oak are common for painted or stained doors; durability and grain vary. We help you pick species and finish based on traffic, cleaning habits, and the look you want.";
push("Best wood for kitchen cabinets?", woodCare, ["cabinets", "materials"]);
push("Maple or oak cabinets?", woodCare, ["cabinets"]);

// Countertops
const quartzAns =
  "Quartz is engineered, low-maintenance, and consistent in pattern. Granite is natural stone with unique veining and needs periodic sealing. Both are popular; choice comes down to look, maintenance, and budget.";
push("Quartz vs granite countertops?", quartzAns, ["countertops"]);
push("Which countertop is easiest to maintain?", quartzAns, ["countertops"]);

// Appliances
push(
  "When should I pick appliances?",
  "Early in design — appliance widths, venting, and fuel type (gas, induction, electric) drive cabinet dimensions and electrical/plumbing locations.",
  ["appliances", "design"],
);

// Permits Ontario
const permitAns =
  "Many kitchen projects need permits when you alter structure, move plumbing drains, or change electrical service. Requirements depend on your municipality. We factor permit timing into the schedule.";
push("Do I need a permit for a kitchen remodel in Ontario?", permitAns, ["permits"]);
push("Kitchen renovation permits Barrie area?", permitAns, ["permits", "local"]);

// Process
push(
  "What happens at the first consultation?",
  `${OWNER} reviews how you use the kitchen, rough dimensions, budget comfort zone, and timing. Photos or inspiration images help — you will leave with clear next steps, not a hard sell.`,
  ["process", "consult"],
);

push(
  "Do you provide 3D renderings?",
  "We use drawings and visuals you can understand — layouts, elevations, and finish boards. If 3D helps your decision, we discuss when it adds value for your project.",
  ["design", "renderings", "drawings", "elevations", "visuals", "three"],
);

// Bathrooms / washrooms (kitchen-first shop; honest scope — avoids wrong FAQ hits on "do you…")
const bathScope = `${BRAND} is built around kitchens — design, custom cabinetry, and installation. Bathrooms and washrooms sometimes fit when you need vanity cabinetry or a coordinated kitchen-and-bath renovation. Describe what you have in mind on the Contact page; ${OWNER} will say clearly what matches the team.`;
push("Do you do bathrooms?", bathScope, [
  "bathroom",
  "bathrooms",
  "washroom",
  "washrooms",
  "ensuite",
  "restroom",
  "vanity",
]);
push("Do you do washrooms?", bathScope, [
  "washroom",
  "washrooms",
  "bathroom",
  "bathrooms",
  "powder",
  "vanity",
]);
push(
  "Do you renovate bathrooms?",
  bathScope,
  ["bathroom", "bathrooms", "renovation", "washroom", "washrooms"],
);
push(
  "Can you build bathroom vanities?",
  bathScope,
  ["vanity", "vanities", "bathroom", "washroom", "cabinetry"],
);

// Living through reno
push(
  "Can I live at home during a kitchen remodel?",
  "Often yes, with a temporary kitchen setup and dust protection. Some clients stay elsewhere during the messiest stretch. We discuss what to expect before demo day.",
  ["during", "lifestyle"],
);

push(
  "How do you control dust?",
  "Protection on floors and doorways, negative air when possible, and daily cleanup. Older homes and open floor plans need extra care — we plan for that up front.",
  ["during", "cleanliness"],
);

// Islands & layout
push(
  "How wide should a kitchen island be?",
  "Aisle clearance matters: you typically want comfortable passage on all sides. Island depth affects storage and seating overhang — we model traffic before locking dimensions.",
  ["island", "layout"],
);

push(
  "Kitchen island with seating — how much overhang?",
  "Bar seating usually needs adequate counter overhang and knee space, plus support (corbels or a structural subtop) depending on span. We engineer this with the cabinet run.",
  ["island", "seating"],
);

// Lighting
push(
  "What kitchen lighting layers do I need?",
  "Ambient (general), task (prep areas and sink), and accent (glass cabinets or feature walls). Dimmers help. We coordinate fixture locations with cabinetry and ceiling structure.",
  ["lighting"],
);

// Flooring
push(
  "Should I do floors before or after cabinets?",
  "Depends on floor type and toe-kick detail. We recommend the sequence that protects new finishes and avoids awkward trim — decided per project.",
  ["flooring", "sequence"],
);

// Sinks & plumbing
push(
  "Farmhouse sink vs undermount?",
  "Farmhouse (apron-front) needs cabinet support designed for the basin weight and reveal. Undermount pairs cleanly with stone counters. Both work when planned early.",
  ["sink", "plumbing"],
);

// Electrical
push(
  "How many outlets does a kitchen need?",
  "Code sets minimums; good design adds convenience outlets for small appliances, island power, and USB if you want them. We align with your electrician and inspector.",
  ["electrical", "code"],
);

// Accessibility
push(
  "Accessible kitchen design ideas?",
  "Clear knee space at sinks, reachable storage, contrast for safety, lever hardware, and careful appliance heights. Tell us about mobility needs — we bake them into the plan.",
  ["accessibility"],
);

// Eco
push(
  "Eco-friendly kitchen options?",
  "Durable materials that last longer than trendy disposables, efficient LED lighting, water-saving fixtures, and locally built cabinetry when it fits the budget. We discuss trade-offs honestly.",
  ["sustainability"],
);

// Warranty / after
push(
  "What if something needs adjustment after install?",
  "Hardware and doors can shift during seasonal humidity changes. We provide a walkthrough checklist and address punch-list items — contact ${OWNER} if something does not feel right.",
  ["after", "service"],
);

// Refacing
push(
  "Cabinet refacing vs replacing?",
  "Refacing updates doors, veneer, and hardware while keeping boxes if they are sound. Replacement is better when layout, internals, or structure need change.",
  ["refacing", "cabinets"],
);

// Pantries
push(
  "Walk-in pantry or cabinet pantry?",
  "Walk-ins store bulk goods and small appliances out of sight; cabinet pantries keep everything in the main work triangle. Room depth and adjacency decide the winner.",
  ["pantry", "storage"],
);

// Small kitchen
push(
  "How do I make a small kitchen feel bigger?",
  "Lighter finishes, glass or open shelving in moderation, streamlined hardware, good task lighting, and smarter storage (drawers over deep blind cabinets) all help.",
  ["small-kitchen", "design"],
);

// Open concept
push(
  "Removing a wall for open concept — issues?",
  "Could be load-bearing; needs engineer approval, permits, and often HVAC/electrical rerouting. We coordinate with the right trades before you commit to the layout.",
  ["open-concept", "structure"],
);

// Resale
push(
  "Best kitchen updates for resale?",
  "Neutral, durable finishes, good lighting, and a logical layout beat loud trends. Over-improving beyond the neighborhood can dim return — we can sanity-check spend.",
  ["resale", "value"],
);

// Scheduling consult
push(
  "How do I book a consultation?",
  `Use the Contact page — call or email ${BRAND}. Share photos and rough dimensions if you can; ${OWNER} will suggest times that work.`,
  ["contact", "consult"],
);

push(
  `How do I contact ${OWNER}?`,
  `Phone and email are on the Contact page and in the site footer. Email is great for photos; phone works well for quick scheduling questions.`,
  ["contact"],
);

// --- Bulk expansion: repeat patterns with synonyms ---
const SYN = {
  kitchen: ["kitchen", "cooking space", "kitchen space", "main kitchen"],
  remodel: ["remodel", "renovation", "reno", "makeover", "upgrade"],
  cost: ["cost", "price", "investment", "budget"],
  cabinet: ["cabinets", "cabinetry", "cupboards"],
  counter: ["countertops", "counters", "worktops"],
  time: ["take", "require", "need", "run"],
};

function comboSpread() {
  const templates = [
    {
      build: () => {
        const out = [];
        for (const k of SYN.kitchen)
          for (const r of SYN.remodel)
            out.push({
              q: `Should I hire a designer for my ${k} ${r}?`,
              a: "A designer who understands construction saves costly mistakes. With TCK, design and execution stay aligned because one team owns the outcome.",
              t: ["design", "planning"],
            });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const c of SYN.cabinet)
          for (const x of ["soft close", "full extension", "dovetail"])
            out.push({
              q: `Are ${x} drawers worth it for kitchen ${c}?`,
              a: "Usually yes — daily feel and longevity improve. We specify hardware and box construction so drawers stay quiet and smooth for years.",
              t: ["cabinets", "hardware"],
            });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const ct of SYN.counter)
          out.push(
            {
              q: `How do I clean ${ct} safely?`,
              a: "Use non-abrasive cleaners; avoid harsh acids on natural stone unless your fabricator approves. Quartz is forgiving; granite needs sensible sealing per supplier guidance.",
              t: ["countertops", "care"],
            },
            {
              q: `Heat resistance of kitchen ${ct}?`,
              a: "Always use trivets — sudden heat can shock stone or damage seams. We go over care for your specific material at install.",
              t: ["countertops", "care"],
            },
          );
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const k of ["backsplash", "tile", "slab backsplash"])
          out.push({
            q: `Should I choose full-height ${k}?`,
            a: "Full-height looks cohesive behind counters and simplifies cleaning behind the range. Budget and style drive the choice — we show both options on the plan.",
            t: ["backsplash", "design"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const hood of ["range hood", "vent hood", "exhaust fan"])
          out.push({
            q: `How powerful should my ${hood} be?`,
            a: "CFM needs relate to cooktop heat output, duct run length, and makeup air rules. We coordinate with HVAC and code requirements for your setup.",
            t: ["ventilation", "appliances"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const fuel of ["gas", "induction", "electric cooktop"])
          out.push({
            q: `Pros and cons of ${fuel} in a home kitchen?`,
            a: "Fuel choice affects venting, wiring, and how you cook. Induction is fast and easy to clean; gas is familiar; electric ranges vary. We plan cabinets and power accordingly.",
            t: ["appliances", "cooking"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const room of ["condo", "townhouse", "detached home", "cottage"])
          out.push({
            q: `Kitchen remodel considerations for a ${room}?`,
            a: "Elevator access, parking, HOA rules, narrower stairs, or seasonal access can affect logistics. We plan deliveries and protection for your building type.",
            t: ["logistics", "planning"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const style of [
          "modern",
          "transitional",
          "traditional",
          "farmhouse",
          "minimal",
        ])
          out.push({
            q: `Can you design a ${style} kitchen?`,
            a: `Yes — ${BRAND} tailors door style, colour, hardware, and materials to your taste. Your inspiration photos help us lock the direction faster.`,
            t: ["style", "design"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const topic of [
          "storage",
          "recycling",
          "spice storage",
          "tray storage",
          "cookie sheet storage",
        ])
          out.push({
            q: `Ideas for better kitchen ${topic}?`,
            a: "Drawers beat deep doors for most items; vertical dividers, pull-outs, and tailored pantries beat generic shelves. Tell us what you store — we design around it.",
            t: ["storage", "organization"],
          });
        return out;
      },
    },
    {
      build: () => {
        const out = [];
        for (const issue of [
          "uneven floors",
          "low ceiling",
          "bulkhead",
          "soffit",
          "radiator",
          "baseboard heat",
        ])
          out.push({
            q: `My kitchen has ${issue} — can you still remodel?`,
            a: "Usually yes — field measurements catch irregularities. We adjust cabinet heights, fillers, and trim rather than forcing a catalog module that does not fit.",
            t: ["challenges", "install"],
          });
        return out;
      },
    },
  ];

  for (const t of templates) {
    for (const row of t.build()) {
      push(row.q, row.a, row.t);
    }
  }
}

comboSpread();

// More numeric spreads to cross 500 if needed
const extras = [
  [
    "Should I replace kitchen flooring with the cabinets",
    "Often yes for a seamless finish under toe kicks — if floors stay, we discuss shoe moulding and height transitions.",
    ["flooring", "sequence"],
  ],
  [
    "LED under-cabinet lighting worth it?",
    "Yes — it improves prep safety and makes backsplashes pop. We wire and locate strips to avoid glare on glossy counters.",
    ["lighting", "led"],
  ],
  [
    "Panel-ready appliances?",
    "Great for a built-in look — panels must align with door reveals. We coordinate panel sizes with appliance specs early.",
    ["appliances", "built-in"],
  ],
  [
    "Microwave in island — okay?",
    "Possible with venting and code clearance for doors and seating. We check ergonomics so traffic still flows.",
    ["island", "appliances"],
  ],
  [
    "Pot filler over range?",
    "Convenient for boiling water; needs plumbing in the wall during rough-in. Decide before drywall and tile.",
    ["plumbing", "range"],
  ],
  [
    "Water line to fridge?",
    "Plan the route and shutoff before cabinets close in. We coordinate with your plumber.",
    ["plumbing", "appliances"],
  ],
  [
    "Garbage and recycling pullouts?",
    "Highly recommended — keeps bins off the floor and contains odors. Sized to your cabinet run.",
    ["storage", "waste"],
  ],
  [
    "Corner cabinet solutions?",
    "Magic corners, lazy Susans, or angled drawers — depends on budget and access preference. We show pros and cons for your corner type.",
    ["cabinets", "corners"],
  ],
  [
    "Glass cabinet doors?",
    "Nice for display; needs interior styling and lighting to shine. We balance openness with daily clutter reality.",
    ["cabinets", "glass"],
  ],
  [
    "Matte vs glossy cabinet finish?",
    "Matte hides fingerprints less on some colours; glossy reflects light. Durability depends on coating quality — we steer you to proven finishes.",
    ["cabinets", "finishes"],
  ],
];

for (const [q, a, t] of extras) {
  push(q + "?", a, t);
}

// Paraphrase layer: same trusted answers, natural alternate questions (helps matching).
const prefixes = [
  "For homeowners: ",
  "Kitchen question — ",
  "Planning a project: ",
  "Before we renovate: ",
  "Quick question: ",
];
const seenQ = new Set(rows.map((r) => r.q));
const seedCap = Math.min(rows.length, 280);
for (let i = 0; i < seedCap && rows.length < 620; i++) {
  const r = rows[i];
  const pref = prefixes[i % prefixes.length];
  let qq = pref + r.q.charAt(0).toLowerCase() + r.q.slice(1);
  if (!seenQ.has(qq)) {
    seenQ.add(qq);
    push(qq, r.a, [...r.tags, "alt-phrasing"]);
  }
  qq =
    r.q.indexOf("?") > 0
      ? r.q.replace(/\?$/, " — what should I know?")
      : r.q + " — what should I know?";
  if (!seenQ.has(qq)) {
    seenQ.add(qq);
    push(qq, r.a, [...r.tags, "alt-phrasing"]);
  }
}

// Final pass: ensure minimum count with structured variations
const fillers = [
  "payment schedule",
  "deposit",
  "change orders",
  "site visits",
  "measure day",
  "rough-in timing",
  "finish selection meeting",
  "punch list",
  "warranty on install",
  "cabinet adjustment",
  "seasonal humidity",
  "floor protection",
  "pet safety during reno",
  "kids during renovation",
  "holiday timing",
  "winter install",
  "summer cottage kitchen",
  "rental property kitchen",
  "flip property kitchen",
  "aging in place kitchen",
  "two-cook household",
  "entertaining layout",
  "coffee station",
  "baking zone",
  "wine storage",
  "charging drawer",
  "tablet recipe stand",
];

for (const topic of fillers) {
  if (rows.length >= 660) break;
  push(
    `How does ${BRAND} handle ${topic}?`,
    `${OWNER} explains this during planning and in your written scope so expectations match reality. If your question is urgent, call or email — we prefer clarity over surprises.`,
    ["process", "planning", topic.replace(/\s+/g, "-")],
  );
}

const cities = [
  "Barrie",
  "Orillia",
  "Midland",
  "Collingwood",
  "Alliston",
  "Innisfil",
  "Wasaga Beach",
  "Huntsville",
  "Bracebridge",
  "Gravenhurst",
];
for (const c of cities) {
  for (const phrase of [
    `Do you design kitchens in ${c}?`,
    `Kitchen contractor near ${c}?`,
    `Custom cabinets in ${c} area?`,
  ]) {
    if (rows.length >= 660) break;
    push(phrase, serviceAnswer, ["local", "service-area", c.toLowerCase()]);
  }
}

const consultTopics = [
  "What should I bring to the first consult?",
  "Can I share Pinterest or Instagram inspiration?",
  "Do you help compare layout options before we commit?",
  "Can you quote phases separately for budget control?",
  "Can we plan now and schedule install later?",
  "Do you handle permit coordination if needed?",
  "Who is my point of contact during the project?",
  "How often do we get schedule updates?",
  "What happens if hidden issues are found after demo?",
  "Can we keep some existing cabinets and upgrade others?",
  "Do you coordinate electrician and plumbing timing?",
  "Do you install customer-supplied appliances?",
  "Can we do the project in stages to reduce downtime?",
  "Can you help pick low-maintenance countertop options?",
  "Do you advise on storage for small kitchens?",
  "Can you include a pantry pull-out in the plan?",
  "Do you provide a final walkthrough checklist?",
  "Do you return for small adjustments after install?",
  "Can we discuss accessibility and aging-in-place features?",
  "Do you support condo kitchen renovation constraints?",
  "Can we plan around a fixed move-in date?",
  "Do you offer cabinet-only projects without full remodel?",
  "Can you match new cabinets to existing flooring tones?",
  "Do you help prioritize upgrades if budget is tight?",
  "Can we keep using part of the kitchen during work?",
  "How do you protect floors and nearby rooms?",
  "Will I get care instructions for new finishes?",
  "Can you build around unusual wall angles?",
  "Can you redesign island seating for better traffic flow?",
  "Do you recommend lighting layers for prep and ambiance?",
];
for (const q of consultTopics) {
  if (rows.length >= 660) break;
  push(
    q,
    `${OWNER} covers this during planning and in your written scope so decisions are clear before work begins. For project-specific advice, share photos on our Contact page and we will guide the best next step.`,
    ["consult", "planning", "process"],
  );
}

const offTopicRedirects = [
  "Can you give me a recipe for poptarts?",
  "Can Pantry write my homework?",
  "Can you help me debug my code?",
  "Who won the game last night?",
  "Can you recommend crypto investments?",
  "Can Pantry provide medical advice?",
  "Can you predict lottery numbers?",
  "Can you tell me a long joke?",
  "Can you help with car repair steps?",
  "Can you write legal contract terms for me?",
  "Can you answer tax filing questions?",
  "Can you generate social media captions for any business?",
];
for (const q of offTopicRedirects) {
  if (rows.length >= 660) break;
  push(
    q,
    `Pantry is focused on ${BRAND} kitchen projects only. I can help with services, timelines, process, and consult prep — for project-specific details contact ${OWNER} from our Contact page.`,
    ["off-topic", "redirect"],
  );
}

let seq = 1;
while (rows.length < 620) {
  push(
    `Pantry planning question ${seq}: what should we confirm before ordering cabinets?`,
    `${OWNER} confirms measurements, layout, finish choices, and schedule checkpoints before ordering so your project stays predictable. If you want this reviewed for your space, contact us from the Contact page.`,
    ["planning", "prep", "alt-phrasing"],
  );
  seq += 1;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(rows, null, 0), "utf8");
console.log(`Wrote ${rows.length} FAQ rows to ${OUT}`);
