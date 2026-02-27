import { v4 as uuid } from "uuid";

// ── Core interfaces ───────────────────────────────────────────────────────────

export type PodLayer      = "groundcover" | "herb" | "shrub" | "vine" | "tree";
export type SupportRole   = "nitrogen-fixer" | "pollinator" | "chop-and-drop" | "dynamic-accumulator";
export type ClimateKey    = "cold" | "cool" | "temperate" | "subtropical" | "tropical";

export interface PodType {
  id:            string;
  name:          string;
  icon:          string;
  description:   string;
  plants:        string[];          // plant keys used for recipe matching
  plantLabels:   string[];          // human-readable plant names
  growthModelId: string;
  nutritionTags: string[];
  difficulty:    "easy" | "moderate";
  color:         string;
  // New fields
  layer:         PodLayer;
  supportRoles:  SupportRole[];     // empty array = purely edible/food pod
  zoneKeys:      ClimateKey[];      // which climate zones this pod suits
  harvestNote:   string;            // rotation guidance specific to this pod
}

export interface GrowthStage {
  id:          string;
  name:        string;
  icon:        string;
  dayStart:    number;
  dayEnd:      number;
  description: string;
  whatToExpect: string;
  color:       string;
}

export interface GrowthModel {
  id:     string;
  name:   string;
  stages: GrowthStage[];
}

export interface Observation {
  id:         string;
  throwId:    string;
  stageId:    string;
  observedAt: string;
  notes:      string;
}

export interface Notification {
  id:           string;
  throwId:      string;
  stageId:      string;
  stageName:    string;
  stageIcon:    string;
  title:        string;
  body:         string;
  scheduledFor: string;
  read:         boolean;
  createdAt:    string;
}

export interface Recipe {
  id:            string;
  name:          string;
  icon:          string;
  plants:        string[];
  instructions:  string;
  nutritionTags: string[];
  time:          string;
  difficulty:    string;
}

export interface LocalState {
  observations:  Observation[];
  notifications: Notification[];
}

export const QUANTITY_LABELS = {
  small:  "Small handful",
  medium: "Medium bowlful",
  large:  "Large basketful",
} as const;

export const QUANTITY_ICONS = {
  small:  "🤏",
  medium: "🥣",
  large:  "🧺",
} as const;

export const QUANTITY_GRAMS = {
  small:  50,
  medium: 150,
  large:  400,
} as const;

// ── Pod Types ─────────────────────────────────────────────────────────────────
// ~20 pods covering 5 food-forest layers × all climate zones
// Each pod includes edible + support species (nitrogen fixers, pollinators,
// chop-and-drop accumulators) as agreed in the Birthright Forest Kit design.

export const POD_TYPES: PodType[] = [

  // ── GROUNDCOVER LAYER ─────────────────────────────────────────────────────

  {
    id:            "pod-cold-clover-carpet",
    name:          "Cold Clover Carpet",
    icon:          "🍀",
    description:   "Frost-hardy groundcover that fixes nitrogen while feeding pollinators and you",
    plants:        ["clover-white", "clover-red", "yarrow", "self-heal", "creeping-thyme"],
    plantLabels:   ["White clover", "Red clover", "Yarrow", "Self-heal", "Creeping thyme"],
    growthModelId: "temperate-herb",
    nutritionTags: ["protein", "minerals", "antimicrobial"],
    difficulty:    "easy",
    color:         "#86EFAC",
    layer:         "groundcover",
    supportRoles:  ["nitrogen-fixer", "pollinator"],
    zoneKeys:      ["cold", "cool"],
    harvestNote:   "Harvest clover flowers and young leaves (⅓ rule). Leave ⅔ blooming for pollinators and N-fixation.",
  },
  {
    id:            "pod-woodland-strawberry",
    name:          "Woodland Strawberry",
    icon:          "🍓",
    description:   "Alpine strawberries, wood sorrel and thyme form a dense, edible living mulch",
    plants:        ["strawberry-alpine", "wood-sorrel", "creeping-thyme", "clover-white"],
    plantLabels:   ["Alpine strawberry", "Wood sorrel", "Creeping thyme", "White clover"],
    growthModelId: "temperate-herb",
    nutritionTags: ["vitamin-c", "antioxidants", "digestive"],
    difficulty:    "easy",
    color:         "#FCA5A5",
    layer:         "groundcover",
    supportRoles:  ["nitrogen-fixer", "pollinator"],
    zoneKeys:      ["cool", "temperate"],
    harvestNote:   "Harvest fruits as they ripen. Thyme and sorrel: harvest ⅓ regularly to encourage dense spread.",
  },
  {
    id:            "pod-mediterranean-ground",
    name:          "Mediterranean Ground",
    icon:          "🌿",
    description:   "Drought-tolerant aromatic groundcover: thyme, oregano and strawberry for dry summers",
    plants:        ["creeping-thyme", "oregano", "strawberry-alpine", "phacelia", "clover-white"],
    plantLabels:   ["Creeping thyme", "Oregano", "Alpine strawberry", "Phacelia", "White clover"],
    growthModelId: "temperate-herb",
    nutritionTags: ["antimicrobial", "digestive", "antioxidants"],
    difficulty:    "easy",
    color:         "#FDE68A",
    layer:         "groundcover",
    supportRoles:  ["pollinator", "nitrogen-fixer"],
    zoneKeys:      ["temperate"],
    harvestNote:   "Harvest herbs as needed (⅓ max per visit). Phacelia is a chop-and-drop — cut before seed set, leave in place.",
  },
  {
    id:            "pod-subtropical-ground",
    name:          "Subtropical Ground",
    icon:          "🍠",
    description:   "Sweet potato leaves and purslane create fast, edible groundcover that suppresses weeds",
    plants:        ["sweet-potato", "purslane", "nasturtium", "lemongrass"],
    plantLabels:   ["Sweet potato", "Purslane", "Nasturtium", "Lemongrass (edge)"],
    growthModelId: "tropical-fast",
    nutritionTags: ["vitamin-a", "omega-3", "vitamin-c", "minerals"],
    difficulty:    "easy",
    color:         "#F97316",
    layer:         "groundcover",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["subtropical", "tropical"],
    harvestNote:   "Harvest sweet potato leaves continuously (⅓ rule). Tubers after 4 months. Purslane: cut and come again.",
  },
  {
    id:            "pod-tropical-taro-ground",
    name:          "Tropical Green Carpet",
    icon:          "🌱",
    description:   "Taro, lemongrass and sweet potato form a dense productive groundcover in humid climates",
    plants:        ["taro", "sweet-potato", "lemongrass", "purslane"],
    plantLabels:   ["Taro", "Sweet potato", "Lemongrass", "Purslane"],
    growthModelId: "tropical-fast",
    nutritionTags: ["carbohydrates", "minerals", "vitamin-a"],
    difficulty:    "easy",
    color:         "#4ADE80",
    layer:         "groundcover",
    supportRoles:  [],
    zoneKeys:      ["tropical"],
    harvestNote:   "Harvest outer taro leaves, young sweet potato shoots, and purslane continuously. Harvest taro corms after 9–12 months.",
  },

  // ── HERB LAYER ────────────────────────────────────────────────────────────

  {
    id:            "pod-cold-herb",
    name:          "Cold Hardy Herbs",
    icon:          "🌸",
    description:   "Frost-tolerant culinary and medicinal herbs that die back and return each year",
    plants:        ["mint", "lemon-balm", "chamomile", "yarrow", "borage"],
    plantLabels:   ["Mint", "Lemon balm", "Chamomile", "Yarrow", "Borage"],
    growthModelId: "temperate-herb",
    nutritionTags: ["antimicrobial", "digestive", "anti-inflammatory"],
    difficulty:    "easy",
    color:         "#C084FC",
    layer:         "herb",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["cold", "cool"],
    harvestNote:   "Harvest sprigs regularly to promote bushiness. Leave flowers for bees. Borage: chop back after flowering.",
  },
  {
    id:            "pod-herb-spiral",
    name:          "Herb Spiral",
    icon:          "🌱",
    description:   "Culinary and medicinal herbs for daily kitchen use",
    plants:        ["mint", "lemon-balm", "yarrow", "calendula"],
    plantLabels:   ["Mint", "Lemon balm", "Yarrow", "Calendula"],
    growthModelId: "temperate-herb",
    nutritionTags: ["antimicrobial", "digestive", "minerals"],
    difficulty:    "easy",
    color:         "#A8D5A2",
    layer:         "herb",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["cool", "temperate"],
    harvestNote:   "Cut herbs back by ⅓ regularly. Leave calendula flowers on for seed-saving and late pollinators.",
  },
  {
    id:            "pod-warm-herb",
    name:          "Warm Herb Guild",
    icon:          "☀️",
    description:   "Mediterranean herbs that thrive in heat and bounce back after cutting",
    plants:        ["rosemary", "lavender", "lemon-verbena", "calendula", "borage"],
    plantLabels:   ["Rosemary", "Lavender", "Lemon verbena", "Calendula", "Borage"],
    growthModelId: "temperate-herb",
    nutritionTags: ["antimicrobial", "digestive", "anti-inflammatory"],
    difficulty:    "easy",
    color:         "#818CF8",
    layer:         "herb",
    supportRoles:  ["pollinator", "chop-and-drop"],
    zoneKeys:      ["temperate", "subtropical"],
    harvestNote:   "Harvest rosemary and lavender tips (⅓). Borage flowers are edible; chop plants after flowering to mulch.",
  },
  {
    id:            "pod-tropical-herb",
    name:          "Tropical Herb Guild",
    icon:          "🌿",
    description:   "High-yield tropical herbs: lemongrass, tulsi, turmeric and ginger for daily kitchen use",
    plants:        ["lemongrass", "tulsi", "turmeric", "ginger", "moringa"],
    plantLabels:   ["Lemongrass", "Tulsi (holy basil)", "Turmeric", "Ginger", "Moringa (young)"],
    growthModelId: "tropical-fast",
    nutritionTags: ["anti-inflammatory", "antimicrobial", "digestive", "minerals"],
    difficulty:    "easy",
    color:         "#34D399",
    layer:         "herb",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["subtropical", "tropical"],
    harvestNote:   "Harvest lemongrass outer stalks. Tulsi: pinch tips constantly. Turmeric/ginger: harvest rhizomes after 8–10 months.",
  },

  // ── SHRUB LAYER ───────────────────────────────────────────────────────────

  {
    id:            "pod-cold-berry",
    name:          "Cold Hardy Berry",
    icon:          "🫐",
    description:   "Gooseberry, hawthorn and jostaberry: frost-proof shrubs that fruit even in harsh winters",
    plants:        ["gooseberry", "hawthorn", "jostaberry", "clover-white"],
    plantLabels:   ["Gooseberry", "Hawthorn", "Jostaberry", "White clover (underplant)"],
    growthModelId: "cold-hardy-shrub",
    nutritionTags: ["vitamin-c", "antioxidants", "minerals"],
    difficulty:    "moderate",
    color:         "#93C5FD",
    layer:         "shrub",
    supportRoles:  ["nitrogen-fixer", "pollinator"],
    zoneKeys:      ["cold", "cool"],
    harvestNote:   "Year 1–2: no harvest, let establish. Year 3+: harvest up to ⅓ of berries; leave rest for birds and seed spread.",
  },
  {
    id:            "pod-forest-edge",
    name:          "Forest Edge",
    icon:          "🌿",
    description:   "Shrubs and ground cover for forest margins",
    plants:        ["elderberry", "blackcurrant", "nettle", "wood-sorrel"],
    plantLabels:   ["Elderberry", "Blackcurrant", "Nettle", "Wood sorrel"],
    growthModelId: "temperate-shrub",
    nutritionTags: ["vitamin-c", "iron", "antioxidants"],
    difficulty:    "easy",
    color:         "#4A7C59",
    layer:         "shrub",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["cool", "temperate"],
    harvestNote:   "Elderflowers (spring) and berries (late summer): take ⅓. Nettle: harvest young tops spring only. Leave ⅔ for wildlife.",
  },
  {
    id:            "pod-warm-shrub",
    name:          "Warm Shrub Guild",
    icon:          "🌸",
    description:   "Mediterranean shrubs with comfrey as a dynamic accumulator and chop-and-drop anchor",
    plants:        ["rosemary", "lavender", "lemon-verbena", "comfrey", "sage"],
    plantLabels:   ["Rosemary", "Lavender", "Lemon verbena", "Comfrey", "Sage"],
    growthModelId: "temperate-shrub",
    nutritionTags: ["antimicrobial", "anti-inflammatory", "digestive"],
    difficulty:    "easy",
    color:         "#A78BFA",
    layer:         "shrub",
    supportRoles:  ["chop-and-drop", "dynamic-accumulator", "pollinator"],
    zoneKeys:      ["temperate"],
    harvestNote:   "Comfrey: chop 3–4× per year, leave leaves as mulch in place. Harvest herbs regularly. Never harvest more than ⅓ of any shrub.",
  },
  {
    id:            "pod-comfrey-guild",
    name:          "Comfrey Support Guild",
    icon:          "💚",
    description:   "Comfrey, borage and phacelia: the ultimate chop-and-drop and pollinator triad for any zone",
    plants:        ["comfrey", "borage", "phacelia", "clover-white"],
    plantLabels:   ["Comfrey (Bocking 14)", "Borage", "Phacelia", "White clover"],
    growthModelId: "temperate-herb",
    nutritionTags: ["minerals", "anti-inflammatory"],
    difficulty:    "easy",
    color:         "#60A5FA",
    layer:         "shrub",
    supportRoles:  ["chop-and-drop", "dynamic-accumulator", "pollinator", "nitrogen-fixer"],
    zoneKeys:      ["cool", "temperate", "subtropical"],
    harvestNote:   "Chop comfrey to ground level 3–4× per growing season; lay leaves as mulch. Do NOT compost — leave in situ. Flowers edible.",
  },
  {
    id:            "pod-subtropical-nitrogen",
    name:          "Nitrogen Shrub Guild",
    icon:          "🌿",
    description:   "Pigeon pea and leucaena are fast nitrogen-fixing shrubs that also feed you",
    plants:        ["pigeon-pea", "comfrey", "borage", "lemongrass"],
    plantLabels:   ["Pigeon pea", "Comfrey", "Borage", "Lemongrass (edge barrier)"],
    growthModelId: "tropical-fast",
    nutritionTags: ["protein", "minerals", "iron"],
    difficulty:    "easy",
    color:         "#BBF7D0",
    layer:         "shrub",
    supportRoles:  ["nitrogen-fixer", "chop-and-drop", "pollinator"],
    zoneKeys:      ["subtropical", "tropical"],
    harvestNote:   "Harvest pigeon pea pods when plump. Chop pigeon pea stems (not roots) to ground level 1–2× per year as mulch.",
  },

  // ── VINE LAYER ────────────────────────────────────────────────────────────

  {
    id:            "pod-vine-canopy",
    name:          "Vine Canopy",
    icon:          "🍇",
    description:   "Nasturtium and climbing beans: fast vertical yield with pollinator bonuses",
    plants:        ["nasturtium", "runner-bean", "borage"],
    plantLabels:   ["Nasturtium", "Runner bean", "Borage"],
    growthModelId: "temperate-vine",
    nutritionTags: ["vitamin-c", "protein", "healthy-fats"],
    difficulty:    "easy",
    color:         "#9B59B6",
    layer:         "vine",
    supportRoles:  ["nitrogen-fixer", "pollinator"],
    zoneKeys:      ["cool", "temperate"],
    harvestNote:   "Harvest nasturtium flowers and leaves freely; they regenerate fast. Beans: pick young for best yield. Leave some pods to self-seed.",
  },
  {
    id:            "pod-warm-vine",
    name:          "Warm Climbing Guild",
    icon:          "🌺",
    description:   "Runner beans, nasturtium and cucumber vine for warm summers with trellis or shrub support",
    plants:        ["runner-bean", "nasturtium", "cucumber-outdoor", "sweet-potato"],
    plantLabels:   ["Runner bean", "Nasturtium", "Outdoor cucumber", "Sweet potato vine"],
    growthModelId: "temperate-vine",
    nutritionTags: ["protein", "vitamin-c", "vitamin-a"],
    difficulty:    "easy",
    color:         "#FB923C",
    layer:         "vine",
    supportRoles:  ["nitrogen-fixer", "pollinator"],
    zoneKeys:      ["temperate", "subtropical"],
    harvestNote:   "Harvest beans and cucumbers when young. Let some nasturtium go to seed for next year. Sweet potato vine: harvest leaves ⅓ regularly.",
  },
  {
    id:            "pod-tropical-vine",
    name:          "Tropical Vine Guild",
    icon:          "🌿",
    description:   "Winged bean, yam and passionfruit: ultra-productive tropical vines for year-round harvest",
    plants:        ["winged-bean", "yam", "passionfruit", "snake-bean"],
    plantLabels:   ["Winged bean", "Yam", "Passionfruit", "Snake bean"],
    growthModelId: "tropical-fast",
    nutritionTags: ["protein", "carbohydrates", "vitamin-c", "minerals"],
    difficulty:    "moderate",
    color:         "#2DD4BF",
    layer:         "vine",
    supportRoles:  ["nitrogen-fixer"],
    zoneKeys:      ["subtropical", "tropical"],
    harvestNote:   "Winged bean: harvest pods and leaves continuously. Snake bean: pick young. Passionfruit: harvest when skin wrinkles.",
  },

  // ── TREE / CANOPY LAYER ───────────────────────────────────────────────────

  {
    id:            "pod-cold-pioneer-tree",
    name:          "Cold Pioneer Guild",
    icon:          "🌳",
    description:   "Siberian pea shrub and alder: cold-hardy nitrogen-fixing pioneer trees from seed",
    plants:        ["siberian-pea-shrub", "alder", "comfrey", "clover-white"],
    plantLabels:   ["Siberian pea shrub", "Alder (from seed)", "Comfrey (underplant)", "White clover (groundcover)"],
    growthModelId: "cold-hardy-shrub",
    nutritionTags: ["protein", "minerals"],
    difficulty:    "moderate",
    color:         "#7DD3FC",
    layer:         "tree",
    supportRoles:  ["nitrogen-fixer", "chop-and-drop", "pollinator"],
    zoneKeys:      ["cold"],
    harvestNote:   "Siberian pea pods edible in year 3+. Alder: coppice at 5–7 years to maintain as shrub. Comfrey: chop 3× per season.",
  },
  {
    id:            "pod-cool-pioneer-tree",
    name:          "Cool Pioneer Guild",
    icon:          "🌲",
    description:   "Elderberry, goumi and comfrey: a classic food-forest pioneer triad for cool climates",
    plants:        ["elderberry", "goumi", "comfrey", "yarrow"],
    plantLabels:   ["Elderberry", "Goumi (nitrogen-fixing shrub/tree)", "Comfrey", "Yarrow"],
    growthModelId: "temperate-shrub",
    nutritionTags: ["vitamin-c", "antioxidants", "minerals"],
    difficulty:    "moderate",
    color:         "#6EE7B7",
    layer:         "tree",
    supportRoles:  ["nitrogen-fixer", "dynamic-accumulator", "pollinator"],
    zoneKeys:      ["cool"],
    harvestNote:   "Goumi berries in year 2–3. Elderflowers and berries: take ⅓. Comfrey: chop and mulch in place all season.",
  },
  {
    id:            "pod-tropical-canopy",
    name:          "Tropical Canopy",
    icon:          "🌴",
    description:   "Moringa, amaranth and sweet potato: fast-growing tropical canopy species",
    plants:        ["moringa", "sweet-potato", "amaranth"],
    plantLabels:   ["Moringa", "Sweet potato", "Amaranth"],
    growthModelId: "tropical-fast",
    nutritionTags: ["protein", "iron", "vitamin-a"],
    difficulty:    "easy",
    color:         "#F4A460",
    layer:         "tree",
    supportRoles:  [],
    zoneKeys:      ["subtropical", "tropical"],
    harvestNote:   "Moringa: harvest young leaves and pods constantly; coppice to 1m to maintain as a productive shrub-tree.",
  },
  {
    id:            "pod-tropical-nitrogen-tree",
    name:          "Tropical Nitrogen Tree",
    icon:          "🌿",
    description:   "Leucaena and pigeon pea: fast nitrogen-fixing canopy pioneers for tropical food forests",
    plants:        ["leucaena", "pigeon-pea", "comfrey", "sweet-potato"],
    plantLabels:   ["Leucaena", "Pigeon pea", "Comfrey (underplant)", "Sweet potato (groundcover)"],
    growthModelId: "tropical-fast",
    nutritionTags: ["protein", "minerals"],
    difficulty:    "easy",
    color:         "#A3E635",
    layer:         "tree",
    supportRoles:  ["nitrogen-fixer", "chop-and-drop"],
    zoneKeys:      ["tropical"],
    harvestNote:   "Coppice leucaena every 6–12 months; lay branches as mulch. Harvest pigeon peas freely. Sweet potato: continuous leaf harvest.",
  },

  // ── ANNUAL/GRAIN LAYER ────────────────────────────────────────────────────

  {
    id:            "pod-meadow-mix",
    name:          "Meadow Mix",
    icon:          "🌼",
    description:   "Hardy wildflowers and groundcover: yarrow, clover and calendula for pollinators and medicine",
    plants:        ["yarrow", "clover-red", "calendula", "dandelion"],
    plantLabels:   ["Yarrow", "Red clover", "Calendula", "Dandelion"],
    growthModelId: "temperate-herb",
    nutritionTags: ["vitamin-c", "antioxidants", "minerals"],
    difficulty:    "easy",
    color:         "#7BC67E",
    layer:         "groundcover",
    supportRoles:  ["nitrogen-fixer", "pollinator", "dynamic-accumulator"],
    zoneKeys:      ["cold", "cool", "temperate"],
    harvestNote:   "Harvest flowers and young dandelion/yarrow leaves (⅓). Leave rest for pollinators and deep mineral cycling.",
  },
  {
    id:            "pod-grain-guild",
    name:          "Grain Guild",
    icon:          "🌾",
    description:   "Amaranth and sunflower: calorie-dense annuals that self-sow reliably",
    plants:        ["amaranth", "sunflower", "borage"],
    plantLabels:   ["Amaranth", "Sunflower", "Borage"],
    growthModelId: "temperate-annual",
    nutritionTags: ["carbohydrates", "protein", "iron", "vitamin-e"],
    difficulty:    "moderate",
    color:         "#DEB887",
    layer:         "herb",
    supportRoles:  ["pollinator"],
    zoneKeys:      ["cool", "temperate", "subtropical"],
    harvestNote:   "Harvest seed heads when fully dry. Leave 20% on the plant to self-sow next year. Borage: chop after seed set.",
  },
];

// ── Growth Models ─────────────────────────────────────────────────────────────

export const GROWTH_MODELS: GrowthModel[] = [
  {
    id:   "temperate-herb",
    name: "Temperate Herb",
    stages: [
      { id: "germination", name: "Germination", icon: "💧", dayStart: 0,   dayEnd: 14,  color: "#8B7355", description: "Seeds absorbing water",             whatToExpect: "No visible changes yet. Keep area slightly moist."        },
      { id: "sprout",      name: "Sprouting",   icon: "🌱", dayStart: 14,  dayEnd: 30,  color: "#90EE90", description: "First shoots emerge",               whatToExpect: "Look for tiny pale green shoots."                        },
      { id: "leafing",     name: "Leafing",     icon: "🍃", dayStart: 30,  dayEnd: 60,  color: "#2ECC71", description: "True leaves forming",               whatToExpect: "Plants recognizable now. Thin if overcrowded."           },
      { id: "flowering",   name: "Flowering",   icon: "🌸", dayStart: 60,  dayEnd: 90,  color: "#FF69B4", description: "Flowers appearing",                 whatToExpect: "Harvest flowers for tea. Leave 30% for pollinators."     },
      { id: "fruiting",    name: "Seeding",     icon: "🌻", dayStart: 90,  dayEnd: 120, color: "#F39C12", description: "Seeds developing",                  whatToExpect: "Harvest seeds when dry and brown."                       },
      { id: "spread",      name: "Spreading",   icon: "🌬️", dayStart: 120, dayEnd: 365, color: "#3498DB", description: "Self-spreading via seed dispersal", whatToExpect: "Expect new plants nearby next season."                  },
    ],
  },
  {
    id:   "temperate-shrub",
    name: "Temperate Shrub",
    stages: [
      { id: "germination", name: "Germination",     icon: "💧", dayStart: 0,   dayEnd: 21,   color: "#8B7355", description: "Seeds stratifying",         whatToExpect: "Shrub seeds take longer. Be patient."           },
      { id: "sprout",      name: "Sprouting",       icon: "🌱", dayStart: 21,  dayEnd: 45,   color: "#90EE90", description: "First shoots emerging",     whatToExpect: "Tiny woody stems appearing."                    },
      { id: "leafing",     name: "Establishing",    icon: "🍃", dayStart: 45,  dayEnd: 120,  color: "#2ECC71", description: "Building root system",      whatToExpect: "Slow above-ground growth. Roots are priority."  },
      { id: "flowering",   name: "First Flowering", icon: "🌸", dayStart: 365, dayEnd: 540,  color: "#FF69B4", description: "First flowers year 2+",     whatToExpect: "Year 2 first flowers. Harvest sparingly."       },
      { id: "fruiting",    name: "Fruiting",        icon: "🫐", dayStart: 540, dayEnd: 730,  color: "#F39C12", description: "First berries year 2-3",    whatToExpect: "Small first harvest. Doubles each year."        },
      { id: "spread",      name: "Established",     icon: "🌳", dayStart: 730, dayEnd: 3650, color: "#3498DB", description: "Mature self-seeding shrub", whatToExpect: "Colony forming. Divide or thin as needed."      },
    ],
  },
  {
    // Zones 3–5: seeds require cold stratification; very slow early growth
    id:   "cold-hardy-shrub",
    name: "Cold Hardy Shrub / Pioneer Tree",
    stages: [
      { id: "germination", name: "Cold Stratifying",  icon: "❄️", dayStart: 0,    dayEnd: 45,   color: "#BFDBFE", description: "Cold stratification period",     whatToExpect: "Seeds need cold to break dormancy. Plant in autumn or stratify in fridge for 4–6 weeks." },
      { id: "sprout",      name: "First Shoots",      icon: "🌱", dayStart: 45,   dayEnd: 90,   color: "#90EE90", description: "First shoots emerging",           whatToExpect: "Very small, slow shoots. Protect from late frosts."                                    },
      { id: "leafing",     name: "Slow Establish",    icon: "🍃", dayStart: 90,   dayEnd: 365,  color: "#2ECC71", description: "Building cold-resistant roots",   whatToExpect: "Year 1 is nearly all root growth. Do not harvest."                                     },
      { id: "flowering",   name: "First Flowering",   icon: "🌸", dayStart: 365,  dayEnd: 730,  color: "#FF69B4", description: "First flowers in year 2–3",       whatToExpect: "Some species flower year 2. Still establishing."                                       },
      { id: "fruiting",    name: "First Fruiting",    icon: "🫐", dayStart: 730,  dayEnd: 1095, color: "#F39C12", description: "First fruit and pods in year 3+", whatToExpect: "Small harvest. Leave most fruit for wildlife and seed."                                 },
      { id: "spread",      name: "Forest Anchor",     icon: "🌳", dayStart: 1095, dayEnd: 7300, color: "#3498DB", description: "Established anchor species",      whatToExpect: "Self-seeding begins. Coppice as needed to manage size."                                 },
    ],
  },
  {
    id:   "tropical-fast",
    name: "Tropical Fast-Growing",
    stages: [
      { id: "germination", name: "Germination",     icon: "💧", dayStart: 0,   dayEnd: 7,    color: "#8B7355", description: "Very fast germination",      whatToExpect: "Watch within the week."               },
      { id: "sprout",      name: "Sprouting",       icon: "🌱", dayStart: 7,   dayEnd: 21,   color: "#90EE90", description: "Rapid early growth",         whatToExpect: "Fast shoots. Manage spacing."          },
      { id: "leafing",     name: "Canopy Building", icon: "🌴", dayStart: 21,  dayEnd: 60,   color: "#2ECC71", description: "Rapid canopy development",   whatToExpect: "Harvest young leaves for nutrition."  },
      { id: "flowering",   name: "Flowering",       icon: "🌺", dayStart: 60,  dayEnd: 90,   color: "#FF69B4", description: "Flowers and pods forming",   whatToExpect: "Pods edible when young."              },
      { id: "fruiting",    name: "Pod Production",  icon: "🌿", dayStart: 90,  dayEnd: 180,  color: "#F39C12", description: "Continuous pod production",  whatToExpect: "Harvest continuously for best yield." },
      { id: "spread",      name: "Established",     icon: "🌳", dayStart: 180, dayEnd: 1825, color: "#3498DB", description: "Established food forest",    whatToExpect: "Coppice to maintain productivity."    },
    ],
  },
  {
    id:   "temperate-annual",
    name: "Temperate Annual",
    stages: [
      { id: "germination", name: "Germination", icon: "💧", dayStart: 0,   dayEnd: 10,  color: "#8B7355", description: "Fast germination",       whatToExpect: "Activity within 10 days."             },
      { id: "sprout",      name: "Sprouting",   icon: "🌱", dayStart: 10,  dayEnd: 25,  color: "#90EE90", description: "Seedlings establishing", whatToExpect: "Thin to 30cm spacing if dense."       },
      { id: "leafing",     name: "Leafing",     icon: "🍃", dayStart: 25,  dayEnd: 50,  color: "#2ECC71", description: "Rapid leaf growth",      whatToExpect: "Harvest outer leaves. Peak nutrition." },
      { id: "flowering",   name: "Flowering",   icon: "🌸", dayStart: 50,  dayEnd: 80,  color: "#FF69B4", description: "Going to seed",          whatToExpect: "Harvest now or let go to seed."       },
      { id: "fruiting",    name: "Seed Set",    icon: "🌾", dayStart: 80,  dayEnd: 110, color: "#F39C12", description: "Seeds maturing",         whatToExpect: "Collect dry seeds for replanting."    },
      { id: "spread",      name: "Self-Sown",   icon: "🌬️", dayStart: 110, dayEnd: 365, color: "#3498DB", description: "Seeds shed naturally",   whatToExpect: "New plants appear next spring."       },
    ],
  },
  {
    id:   "temperate-vine",
    name: "Temperate Vine",
    stages: [
      { id: "germination", name: "Germination",  icon: "💧", dayStart: 0,   dayEnd: 14,  color: "#8B7355", description: "Vine seeds germinating",  whatToExpect: "Keep moist. Up to 2 weeks."                 },
      { id: "sprout",      name: "Sprouting",    icon: "🌱", dayStart: 14,  dayEnd: 28,  color: "#90EE90", description: "First tendrils emerging", whatToExpect: "Provide a surface to climb."                },
      { id: "leafing",     name: "Climbing",     icon: "🍃", dayStart: 28,  dayEnd: 60,  color: "#2ECC71", description: "Rapid vertical growth",   whatToExpect: "Harvest young leaves and flowers."          },
      { id: "flowering",   name: "Flowering",    icon: "🌺", dayStart: 60,  dayEnd: 90,  color: "#FF69B4", description: "Prolific flowering",      whatToExpect: "Edible flowers! Leave some for pollinators." },
      { id: "fruiting",    name: "Fruiting",     icon: "🍇", dayStart: 90,  dayEnd: 150, color: "#F39C12", description: "Fruit and pods forming",  whatToExpect: "Harvest pods young and tender."             },
      { id: "spread",      name: "Self-Seeding", icon: "🌬️", dayStart: 150, dayEnd: 365, color: "#3498DB", description: "Seeds spreading",         whatToExpect: "Will self-seed prolifically."               },
    ],
  },
];

// ── Climate Zones ─────────────────────────────────────────────────────────────
// Kit compositions use the ⅓ harvest rotation by default (take ⅓, leave ⅔).
// Each kit size balances: groundcover + herb + shrub + vine + tree/canopy layers.

export interface ClimateZone {
  key:         ClimateKey;
  label:       string;
  emoji:       string;
  description: string;
  usda:        string;
  biome:       string;   // human-readable biome label
  examples:    string;
  color:       string;
  podIds:      string[];
  kitSizes: {
    pods:        number;
    composition: { podId: string; count: number; role: string }[];
  }[];
}

export const CLIMATE_ZONES: ClimateZone[] = [
  {
    key:         "cold",
    label:       "Cold",
    emoji:       "🧊",
    description: "Hard winters, short summers. Ground freezes deeply.",
    usda:        "Zones 3–5",
    biome:       "Boreal / Cold Temperate",
    examples:    "Canada, Scandinavia, Siberia, high-altitude mountain regions",
    color:       "#93C5FD",
    podIds: [
      "pod-cold-clover-carpet",
      "pod-cold-herb",
      "pod-cold-berry",
      "pod-cold-pioneer-tree",
      "pod-meadow-mix",
      "pod-grain-guild",
    ],
    kitSizes: [
      {
        pods: 12,
        composition: [
          { podId: "pod-cold-clover-carpet", count: 3, role: "Groundcover + N-fixer" },
          { podId: "pod-cold-herb",          count: 3, role: "Herb layer"            },
          { podId: "pod-cold-berry",         count: 3, role: "Shrub layer"           },
          { podId: "pod-cold-pioneer-tree",  count: 2, role: "Canopy pioneer"        },
          { podId: "pod-meadow-mix",         count: 1, role: "Pollinator meadow"     },
        ],
      },
      {
        pods: 24,
        composition: [
          { podId: "pod-cold-clover-carpet", count: 6, role: "Groundcover + N-fixer" },
          { podId: "pod-cold-herb",          count: 5, role: "Herb layer"            },
          { podId: "pod-cold-berry",         count: 5, role: "Shrub layer"           },
          { podId: "pod-cold-pioneer-tree",  count: 4, role: "Canopy pioneer"        },
          { podId: "pod-meadow-mix",         count: 2, role: "Pollinator meadow"     },
          { podId: "pod-grain-guild",        count: 2, role: "Annual calorie crop"   },
        ],
      },
    ],
  },
  {
    key:         "cool",
    label:       "Cool Temperate",
    emoji:       "🌥️",
    description: "Mild summers, cold winters. Occasional hard frosts.",
    usda:        "Zones 6–7",
    biome:       "Temperate Oceanic / Humid Continental",
    examples:    "UK, Northern Europe, Pacific Northwest, NE USA, New Zealand South Island",
    color:       "#6EE7B7",
    podIds: [
      "pod-cold-clover-carpet",
      "pod-woodland-strawberry",
      "pod-cold-herb",
      "pod-herb-spiral",
      "pod-forest-edge",
      "pod-cold-berry",
      "pod-cool-pioneer-tree",
      "pod-vine-canopy",
      "pod-comfrey-guild",
      "pod-meadow-mix",
      "pod-grain-guild",
    ],
    kitSizes: [
      {
        pods: 12,
        composition: [
          { podId: "pod-woodland-strawberry", count: 2, role: "Groundcover"          },
          { podId: "pod-herb-spiral",         count: 2, role: "Herb layer"           },
          { podId: "pod-forest-edge",         count: 2, role: "Shrub layer"          },
          { podId: "pod-comfrey-guild",       count: 2, role: "Support + mulch"      },
          { podId: "pod-vine-canopy",         count: 2, role: "Vine layer"           },
          { podId: "pod-cool-pioneer-tree",   count: 1, role: "Canopy pioneer"       },
          { podId: "pod-meadow-mix",          count: 1, role: "Pollinator meadow"    },
        ],
      },
      {
        pods: 24,
        composition: [
          { podId: "pod-cold-clover-carpet",  count: 3, role: "Groundcover + N-fixer" },
          { podId: "pod-woodland-strawberry", count: 3, role: "Groundcover"            },
          { podId: "pod-herb-spiral",         count: 3, role: "Herb layer"             },
          { podId: "pod-forest-edge",         count: 3, role: "Shrub layer"            },
          { podId: "pod-comfrey-guild",       count: 3, role: "Support + mulch"        },
          { podId: "pod-vine-canopy",         count: 3, role: "Vine layer"             },
          { podId: "pod-cool-pioneer-tree",   count: 2, role: "Canopy pioneer"         },
          { podId: "pod-cold-berry",          count: 2, role: "Hardy fruit shrub"      },
          { podId: "pod-meadow-mix",          count: 1, role: "Pollinator meadow"      },
          { podId: "pod-grain-guild",         count: 1, role: "Annual calorie crop"    },
        ],
      },
    ],
  },
  {
    key:         "temperate",
    label:       "Warm Temperate",
    emoji:       "🌤️",
    description: "Warm summers, mild winters. Rare frosts. Widest plant diversity.",
    usda:        "Zones 8–9",
    biome:       "Mediterranean / Warm Oceanic",
    examples:    "Mediterranean coast, SE USA, Southern Europe, coastal California, NZ North Island",
    color:       "#FDE68A",
    podIds: [
      "pod-mediterranean-ground",
      "pod-woodland-strawberry",
      "pod-herb-spiral",
      "pod-warm-herb",
      "pod-forest-edge",
      "pod-warm-shrub",
      "pod-comfrey-guild",
      "pod-vine-canopy",
      "pod-warm-vine",
      "pod-meadow-mix",
      "pod-grain-guild",
    ],
    kitSizes: [
      {
        pods: 12,
        composition: [
          { podId: "pod-mediterranean-ground", count: 2, role: "Groundcover"         },
          { podId: "pod-warm-herb",            count: 2, role: "Herb layer"          },
          { podId: "pod-warm-shrub",           count: 2, role: "Shrub layer"         },
          { podId: "pod-comfrey-guild",        count: 2, role: "Support + mulch"     },
          { podId: "pod-warm-vine",            count: 2, role: "Vine layer"          },
          { podId: "pod-forest-edge",          count: 1, role: "Shrub layer"         },
          { podId: "pod-grain-guild",          count: 1, role: "Annual calorie crop" },
        ],
      },
      {
        pods: 24,
        composition: [
          { podId: "pod-mediterranean-ground", count: 3, role: "Groundcover"           },
          { podId: "pod-woodland-strawberry",  count: 2, role: "Groundcover"           },
          { podId: "pod-warm-herb",            count: 3, role: "Herb layer"            },
          { podId: "pod-herb-spiral",          count: 2, role: "Herb layer"            },
          { podId: "pod-warm-shrub",           count: 3, role: "Shrub layer"           },
          { podId: "pod-comfrey-guild",        count: 3, role: "Support + mulch"       },
          { podId: "pod-warm-vine",            count: 3, role: "Vine layer"            },
          { podId: "pod-forest-edge",          count: 2, role: "Shrub layer"           },
          { podId: "pod-meadow-mix",           count: 2, role: "Pollinator meadow"     },
          { podId: "pod-grain-guild",          count: 1, role: "Annual calorie crop"   },
        ],
      },
    ],
  },
  {
    key:         "subtropical",
    label:       "Subtropical",
    emoji:       "🌞",
    description: "Hot summers, warm winters. No hard frost. Year-round growing.",
    usda:        "Zones 9–11",
    biome:       "Subtropical Humid / Dry",
    examples:    "Florida, Texas, Southern China, North Africa, Northern Australia, SE Asia margins",
    color:       "#FCA5A5",
    podIds: [
      "pod-subtropical-ground",
      "pod-tropical-herb",
      "pod-warm-herb",
      "pod-tropical-canopy",
      "pod-subtropical-nitrogen",
      "pod-comfrey-guild",
      "pod-warm-vine",
      "pod-tropical-vine",
      "pod-grain-guild",
    ],
    kitSizes: [
      {
        pods: 12,
        composition: [
          { podId: "pod-subtropical-ground",   count: 2, role: "Groundcover"           },
          { podId: "pod-tropical-herb",        count: 2, role: "Herb layer"            },
          { podId: "pod-subtropical-nitrogen", count: 2, role: "N-fixer shrub"         },
          { podId: "pod-tropical-canopy",      count: 2, role: "Canopy"                },
          { podId: "pod-tropical-vine",        count: 2, role: "Vine layer"            },
          { podId: "pod-comfrey-guild",        count: 1, role: "Support + mulch"       },
          { podId: "pod-grain-guild",          count: 1, role: "Annual calorie crop"   },
        ],
      },
      {
        pods: 24,
        composition: [
          { podId: "pod-subtropical-ground",   count: 4, role: "Groundcover"           },
          { podId: "pod-tropical-herb",        count: 4, role: "Herb layer"            },
          { podId: "pod-subtropical-nitrogen", count: 4, role: "N-fixer shrub"         },
          { podId: "pod-tropical-canopy",      count: 4, role: "Canopy"                },
          { podId: "pod-tropical-vine",        count: 4, role: "Vine layer"            },
          { podId: "pod-comfrey-guild",        count: 2, role: "Support + mulch"       },
          { podId: "pod-warm-vine",            count: 1, role: "Vine layer"            },
          { podId: "pod-grain-guild",          count: 1, role: "Annual calorie crop"   },
        ],
      },
    ],
  },
  {
    key:         "tropical",
    label:       "Tropical",
    emoji:       "🌴",
    description: "Hot and humid year-round. No winter. Fastest growth of any climate zone.",
    usda:        "Zones 12–13",
    biome:       "Tropical Rainforest / Monsoon",
    examples:    "Amazon basin, SE Asia, Central Africa, Caribbean, Pacific Islands",
    color:       "#86EFAC",
    podIds: [
      "pod-tropical-taro-ground",
      "pod-subtropical-ground",
      "pod-tropical-herb",
      "pod-subtropical-nitrogen",
      "pod-tropical-canopy",
      "pod-tropical-nitrogen-tree",
      "pod-tropical-vine",
    ],
    kitSizes: [
      {
        pods: 12,
        composition: [
          { podId: "pod-tropical-taro-ground",   count: 2, role: "Groundcover"         },
          { podId: "pod-tropical-herb",          count: 2, role: "Herb layer"          },
          { podId: "pod-subtropical-nitrogen",   count: 2, role: "N-fixer shrub"       },
          { podId: "pod-tropical-canopy",        count: 2, role: "Canopy"              },
          { podId: "pod-tropical-nitrogen-tree", count: 2, role: "Canopy N-fixer"      },
          { podId: "pod-tropical-vine",          count: 2, role: "Vine layer"          },
        ],
      },
      {
        pods: 24,
        composition: [
          { podId: "pod-tropical-taro-ground",   count: 4, role: "Groundcover"         },
          { podId: "pod-subtropical-ground",     count: 2, role: "Groundcover"         },
          { podId: "pod-tropical-herb",          count: 4, role: "Herb layer"          },
          { podId: "pod-subtropical-nitrogen",   count: 3, role: "N-fixer shrub"       },
          { podId: "pod-tropical-canopy",        count: 4, role: "Canopy"              },
          { podId: "pod-tropical-nitrogen-tree", count: 4, role: "Canopy N-fixer"      },
          { podId: "pod-tropical-vine",          count: 3, role: "Vine layer"          },
        ],
      },
    ],
  },
];

// ── Recipes ───────────────────────────────────────────────────────────────────

export const RECIPES: Recipe[] = [
  { id: "r1",  name: "Spring Dandelion Salad",        icon: "🥗", plants: ["dandelion", "clover-red", "nasturtium"],            instructions: "Gather young leaves, rinse well. Toss with olive oil and lemon. Add flowers for color.",                                   nutritionTags: ["vitamin-c", "iron", "calcium"],                time: "5 min",     difficulty: "easy"     },
  { id: "r2",  name: "Nettle Iron Tea",               icon: "🫖", plants: ["nettle", "mint", "lemon-balm"],                     instructions: "Use tongs to pick young nettle tops. Steep with mint and lemon balm for 10 min.",                                         nutritionTags: ["iron", "minerals", "anti-inflammatory"],       time: "15 min",    difficulty: "easy"     },
  { id: "r3",  name: "Elderflower Cordial",           icon: "🌸", plants: ["elderberry"],                                       instructions: "Collect 20 flower heads, steep in 1L hot water with sugar and lemon for 24h. Strain and bottle.",                         nutritionTags: ["vitamin-c", "antioxidants"],                   time: "overnight", difficulty: "moderate" },
  { id: "r4",  name: "Moringa Powder",               icon: "💚", plants: ["moringa"],                                          instructions: "Dry leaves in shade 3-5 days. Grind to powder. Add 1 tsp to smoothies or soups daily.",                                   nutritionTags: ["protein", "iron", "calcium", "vitamin-a"],     time: "5 days",    difficulty: "easy"     },
  { id: "r5",  name: "Calendula Salve",              icon: "🌻", plants: ["calendula"],                                        instructions: "Infuse dried petals in olive oil for 2 weeks. Strain, mix with beeswax. Apply to skin.",                                  nutritionTags: ["anti-inflammatory", "wound-healing"],          time: "2 weeks",   difficulty: "moderate" },
  { id: "r6",  name: "Amaranth Porridge",            icon: "🥣", plants: ["amaranth"],                                         instructions: "Toast seeds lightly. Simmer 1 cup in 2.5 cups water for 20 min. Add banana or honey.",                                    nutritionTags: ["protein", "calcium", "iron"],                  time: "25 min",    difficulty: "easy"     },
  { id: "r7",  name: "Nasturtium Capers",            icon: "🫙", plants: ["nasturtium"],                                       instructions: "Pickle green nasturtium seeds in vinegar, salt and sugar for 2+ weeks. Use like capers.",                                  nutritionTags: ["vitamin-c", "antimicrobial"],                  time: "2 weeks",   difficulty: "easy"     },
  { id: "r8",  name: "Forest Floor Soup",            icon: "🍲", plants: ["nettle", "dandelion", "wood-sorrel"],               instructions: "Saute onion, add nettle and dandelion leaves, cover with stock. Simmer 15 min. Finish with sorrel.",                       nutritionTags: ["iron", "vitamin-c", "calcium"],                time: "20 min",    difficulty: "easy"     },
  { id: "r9",  name: "Sunflower Butter",             icon: "🌻", plants: ["sunflower"],                                        instructions: "Roast hulled seeds 10 min at 180C. Blend with a pinch of salt and oil until smooth.",                                      nutritionTags: ["vitamin-e", "protein", "healthy-fats"],        time: "20 min",    difficulty: "easy"     },
  { id: "r10", name: "Yarrow First Aid Wash",        icon: "🩹", plants: ["yarrow"],                                           instructions: "Steep fresh yarrow flowers in boiling water for 10 min. Cool completely. Use to wash minor cuts.",                        nutritionTags: ["antimicrobial", "anti-inflammatory"],          time: "15 min",    difficulty: "easy"     },
  { id: "r11", name: "Lemongrass Ginger Tea",        icon: "🍵", plants: ["lemongrass", "ginger", "tulsi"],                   instructions: "Bruise lemongrass stalk, slice ginger. Simmer in water 10 min. Add fresh tulsi leaves, steep 5 min.",                      nutritionTags: ["anti-inflammatory", "digestive", "antimicrobial"], time: "20 min", difficulty: "easy" },
  { id: "r12", name: "Pigeon Pea Dal",               icon: "🫘", plants: ["pigeon-pea"],                                       instructions: "Shell dried peas, soak 2h. Simmer 45 min with turmeric, cumin, salt. Finish with fried garlic and mustard seed.",          nutritionTags: ["protein", "iron", "minerals"],                 time: "1 hr",      difficulty: "easy"     },
  { id: "r13", name: "Sweet Potato Leaf Stir Fry",   icon: "🥬", plants: ["sweet-potato"],                                     instructions: "Wash young sweet potato leaves. Stir fry with garlic, chili and soy. Serve over rice.",                                     nutritionTags: ["vitamin-a", "iron", "calcium"],                time: "10 min",    difficulty: "easy"     },
  { id: "r14", name: "Comfrey Leaf Mulch Tea",       icon: "💧", plants: ["comfrey"],                                          instructions: "Stuff a bucket with comfrey leaves, weigh down, fill with water. Steep 3–4 weeks. Dilute 1:10 and apply as liquid feed to plants.", nutritionTags: ["minerals", "dynamic-accumulator"],         time: "4 weeks",   difficulty: "easy"     },
  { id: "r15", name: "Fresh Borage Flower Salad",    icon: "💙", plants: ["borage"],                                           instructions: "Pick fresh borage flowers (star-shaped, blue). Scatter over salads or float on cold drinks. Mild cucumber flavour.",       nutritionTags: ["antioxidants", "minerals"],                    time: "2 min",     difficulty: "easy"     },
];

// ── localStorage helpers ──────────────────────────────────────────────────────

const LS_KEY      = "eden-pods-v2";
const LS_ZONE_KEY = "eden-climate-zone";
const EMPTY: LocalState = { observations: [], notifications: [] };

export function loadLocal(): LocalState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch { return EMPTY; }
}

export function saveLocal(s: LocalState): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

export function loadSavedZone(): ClimateKey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_ZONE_KEY);
    return raw as ClimateKey | null;
  } catch { return null; }
}

export function saveZone(key: ClimateKey): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_ZONE_KEY, key); } catch {}
}

// ── State helpers ─────────────────────────────────────────────────────────────

export function addObservation(
  data: Omit<Observation, "id" | "observedAt">
): Observation {
  const s = loadLocal();
  const o: Observation = { ...data, id: uuid(), observedAt: new Date().toISOString() };
  saveLocal({ ...s, observations: [o, ...s.observations] });
  return o;
}

export function seedNotifications(
  throwId:       string,
  throwDate:     string,
  growthModelId: string
): void {
  const s = loadLocal();
  if (s.notifications.some((n) => n.throwId === throwId)) return;
  const model = GROWTH_MODELS.find((m) => m.id === growthModelId);
  if (!model) return;
  const base = new Date(throwDate);
  const now  = new Date();
  const newNotifs: Notification[] = [];
  for (const stage of model.stages) {
    const d = new Date(base);
    d.setDate(d.getDate() + stage.dayStart);
    if (d < now) continue;
    newNotifs.push({
      id:           uuid(),
      throwId,
      stageId:      stage.id,
      stageName:    stage.name,
      stageIcon:    stage.icon,
      title:        `${stage.icon} ${stage.name} stage starting`,
      body:         stage.whatToExpect,
      scheduledFor: d.toISOString(),
      read:         false,
      createdAt:    new Date().toISOString(),
    });
  }
  saveLocal({ ...s, notifications: [...newNotifs, ...s.notifications] });
}

export function markNotificationRead(id: string): void {
  const s = loadLocal();
  saveLocal({
    ...s,
    notifications: s.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  });
}

export function markAllRead(): void {
  const s = loadLocal();
  saveLocal({
    ...s,
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  });
}

export function getDueNotifications(
  notifications: Notification[]
): Notification[] {
  const now = new Date().toISOString();
  return notifications.filter((n) => !n.read && n.scheduledFor <= now);
}

export function getCurrentStage(throwDate: string, model: GrowthModel) {
  const days = Math.floor(
    (Date.now() - new Date(throwDate).getTime()) / 86400000
  );
  let current = model.stages[0];
  for (const s of model.stages) {
    if (days >= s.dayStart) current = s;
  }
  const len      = Math.max(current.dayEnd - current.dayStart, 1);
  const progress = Math.min(
    100,
    Math.max(0, ((days - current.dayStart) / len) * 100)
  );
  return { stage: current, daysSince: days, progress };
}

export function getNextStage(
  throwDate: string,
  model:     GrowthModel
): GrowthStage | null {
  const { stage } = getCurrentStage(throwDate, model);
  const idx = model.stages.findIndex((s) => s.id === stage.id);
  return model.stages[idx + 1] ?? null;
}

export function getBirthrightProjection(podCount: number, years = 6) {
  return Array.from({ length: years + 1 }, (_, y) => {
    const pods = Math.min(podCount * Math.pow(2, y), 99999);
    const sqm  = pods * 4;
    return {
      year: y,
      pods,
      area:
        sqm >= 10000
          ? `${(sqm / 10000).toFixed(1)} ha`
          : `${sqm.toLocaleString()} m²`,
    };
  });
}

// ── Zone-filtered pod helpers ─────────────────────────────────────────────────

/** Return all pods available in a given climate zone */
export function getPodsForZone(zoneKey: ClimateKey): PodType[] {
  return POD_TYPES.filter((p) => p.zoneKeys.includes(zoneKey));
}

/** Return pods by layer within a zone */
export function getPodsByLayer(
  zoneKey: ClimateKey,
  layer:   PodLayer
): PodType[] {
  return getPodsForZone(zoneKey).filter((p) => p.layer === layer);
}

/** Return support/function pods only (nitrogen fixers, chop-and-drop, etc.) */
export function getSupportPods(zoneKey: ClimateKey): PodType[] {
  return getPodsForZone(zoneKey).filter((p) => p.supportRoles.length > 0);
}

/** Return the kit composition for a given zone and size (12 or 24) */
export function getKitComposition(zoneKey: ClimateKey, size: 12 | 24) {
  const zone = CLIMATE_ZONES.find((z) => z.key === zoneKey);
  if (!zone) return null;
  const kit = zone.kitSizes.find((k) => k.pods === size);
  if (!kit) return null;
  return kit.composition.map((item) => ({
    ...item,
    pod: POD_TYPES.find((p) => p.id === item.podId)!,
  }));
}
