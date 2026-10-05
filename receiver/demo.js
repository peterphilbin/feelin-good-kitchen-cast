// Preview mode: open receiver/?demo in a browser. Keys: 1 splash · 2 browse (←/→ to move) · 3 recipe
// · 4 cook intro · 5 gather · 6 step with timers · 7 done. The real data comes from the phone app.
const demoSections = [
  { id: "rise", number: "01", title: "Rise & Shine", emoji: "🍳", theme: "SUNRISE" },
  { id: "midday", number: "02", title: "Midday Fuel", emoji: "🌯", theme: "GARDEN" },
  { id: "evening", number: "03", title: "Evening Wins", emoji: "🍔", theme: "SUNSET" },
  { id: "super", number: "04", title: "Super Fresh", emoji: "🥦", theme: "FRESH" },
  { id: "kids", number: "05", title: "Little Foodies", emoji: "🍕", theme: "PLAYFUL" },
];
const r = (id, sectionId, title, art, minutes, servings, description) =>
  ({ id, sectionId, title, art, minutes, servings, steps: 4, description, swap: "Whole-wheat tortilla, beans and spinach mean big fibre and protein — no greasy hash brown required." });
const demoRecipes = [
  r("breakfast-burrito", "rise", "Loaded Veggie Breakfast Burrito", ["🌯", "🥚", "🫑"], 20, 2, "A massive, protein-packed morning burrito bursting with black beans, fluffy eggs and fresh salsa."),
  r("protein-pancakes", "rise", "10-Minute Protein Pancakes", ["🥞", "🍌", "🫐"], 10, 2, "Fluffy, wholesome flapjacks made with banana, oats and protein powder — zero refined flour."),
  r("avocado-egg-toast", "rise", "Crispy Avocado & Egg Toast", ["🥑", "🍳", "🍞"], 10, 1, "Sourdough toast loaded with creamy mashed avocado, chilli flakes and a runny fried egg."),
  r("smash-burger-wrap", "midday", "Smash Burger Wrap", ["🍔", "🌯", "🥬"], 15, 1, "All the juicy goodness of a diner smash burger, wrapped up tight."),
  r("crunch-grain-bowl", "midday", "Crunch-Factor Grain Bowl", ["🥗", "🥜", "🥕"], 20, 2, "Quinoa, cabbage, edamame and roasted chickpeas in a peanut-lime drizzle."),
  r("sweet-potato-wedges", "evening", "Sweet Potato Wedges & Herbed Aioli", ["🍠", "🧄", "🌶️"], 25, 2, "Crispy wedges baked with garlic and smoked paprika."),
  r("loaded-mac-cheese", "evening", "20-Minute Loaded Mac & Cheese", ["🧀", "🍝", "🎃"], 20, 4, "Creamy cheddar sauce with hidden butternut squash."),
  r("green-goddess-salmon", "super", "Green Goddess Salmon Traybake", ["🐟", "🥦", "🍋"], 25, 2, "Lemony roast salmon with charred greens and a herby yogurt sauce."),
  r("mini-pizza-faces", "kids", "Mini Pizza Faces", ["🍕", "🌽", "🫑"], 15, 2, "Little wholemeal pizzas with veg hidden in the sauce."),
];
handle({ type: "catalog", sections: demoSections, recipes: demoRecipes });

const ingredients = [
  { amount: "2", item: "Large whole-wheat tortillas" }, { amount: "4", item: "Large eggs" },
  { amount: "85 g", item: "Canned black beans, rinsed" }, { amount: "½", item: "Bell pepper, diced" },
  { amount: "½", item: "Onion, diced" }, { amount: "30 g", item: "Sharp cheddar, grated" },
  { item: "Handful of fresh spinach" }, { item: "Salsa, to serve" },
];
const steps = [
  "Sauté the pepper and onion in a skillet until tender.",
  "Add the black beans and spinach; warm through.",
  "Scramble the eggs directly into the veggie mix.",
  "Spoon into warm tortillas, top with cheese and salsa, and wrap tight!",
];
let focus = 0;
const cook = (extra) => handle(Object.assign({ type: "view", screen: "cook", recipeId: "breakfast-burrito", servings: 2, pageCount: 6, stepCount: 4, ingredients, timers: [] }, extra));
const views = {
  1: () => handle({ type: "view", screen: "splash" }),
  2: () => handle({ type: "view", screen: "browse", focusId: demoRecipes[focus].id }),
  3: () => handle({ type: "view", screen: "recipe", recipeId: "breakfast-burrito", servings: 2, ingredients, steps }),
  4: () => cook({ page: 0, kind: "intro", narration: { parts: ["Let's make the Loaded Veggie Breakfast Burrito.", "It takes about twenty minutes and makes two big burritos."], current: 1, speaking: true } }),
  5: () => cook({ page: 1, kind: "gather", narration: { parts: ["Let's gather your ingredients.", "2 large whole-wheat tortillas", "4 large eggs", "85 grams canned black beans"], current: 2, speaking: true } }),
  6: () => cook({
    page: 2, kind: "step", stepIndex: 0, stepText: steps[0],
    narration: { parts: ["Step 1.", "Get a skillet on medium heat with a little oil.", "In go the diced pepper and onion.", "Let them soften for about four minutes."], current: 2, speaking: true },
    timers: [{ label: "Peppers & onion", remaining: 157, total: 240, finished: false, stepIndex: 0 }, { label: "Beans & spinach", remaining: 0, total: 60, finished: true, stepIndex: 1 }],
    offer: { label: "Scramble", seconds: 120 },
  }),
  7: () => cook({ finished: true, outro: "Burritos are wrapped. Breakfast champion status: unlocked." }),
};
addEventListener("keydown", (e) => {
  if (views[e.key]) views[e.key]();
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    focus = (focus + (e.key === "ArrowRight" ? 1 : -1) + demoRecipes.length) % demoRecipes.length;
    views[2]();
  }
});
const start = new URLSearchParams(location.search).get("demo");
if (views[start]) views[start]();
