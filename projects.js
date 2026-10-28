// FzZ Dev project list.
// To add a project, copy a { ... } block and change the fields.
//
//   title       – project name
//   description – short description (1–2 sentences)
//   category    – used by the filters (e.g. "Discord Bot", "Website", "FACEIT", "Tool")
//   icon        – optional icon override: "bot", "chart", "globe", "code", "layers", "zap"
//   tags        – technologies used
//   status      – "Completed", "In development" or "Planned"
//   image       – path to an image (e.g. "assets/project.png") or "" to use the icon
//   featured    – optional, true shows the project as a wide highlighted card
//   links       – { demo: "https://...", code: "https://..." } (optional)

const PROJECTS = [
  {
    title: "YSCL Pharma",
    description: "Corporate website for YSCL Pharma, a group supplying natural raw materials, aromas and biotech ingredients to the pharmaceutical, cosmetic, food and veterinary industries.",
    category: "Website",
    tags: ["HTML", "CSS", "JavaScript", "Responsive"],
    status: "Completed",
    image: "assets/yscl-pharma.jpg",
    featured: true,
    links: { demo: "https://www.ysclpharma.com/" }
  },
  {
    title: "Discord Bot",
    description: "Bot for the FzZ Dev Discord server, with commands and tools for the community.",
    category: "Discord Bot",
    tags: ["Discord"],
    status: "Completed",
    image: "assets/discord-bot.svg",
    links: {}
  },
  {
    title: "Stats Bot",
    description: "Bot that shows player statistics right inside Discord.",
    category: "Discord Bot",
    icon: "chart",
    tags: ["Discord", "Stats"],
    status: "In development",
    image: "assets/stats-bot.svg",
    links: {}
  },
  {
    title: "FzZ Dev Website",
    description: "The team's official website, showcasing every project built by FzZ Dev.",
    category: "Website",
    icon: "code",
    tags: ["HTML", "CSS", "JavaScript"],
    status: "Completed",
    image: "assets/fzz-website.svg",
    links: {}
  }
];
