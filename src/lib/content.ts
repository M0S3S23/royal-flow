/**
 * Public website copy for the progress, growth and investment sections.
 * Edit here to change wording site-wide.
 */

export const CURRENT_STAGE = {
  label: "Integration, testing & field validation",
  summary:
    "The Riverbox prototype has been developed. We are now completing system integration, testing and field validation of the first fully integrated pilot systems.",
  note: "The current pilot-development phase is supported through an existing programme.",
};

/** Growth pathway, in order. `status`: done | current | next */
export const PATHWAY = [
  { title: "Prototype developed", status: "done" },
  { title: "Pilot validation", status: "current" },
  { title: "Manufacturing capacity", status: "next" },
  { title: "Local fabrication network", status: "next" },
  { title: "Commercial installations", status: "next" },
  { title: "Multi-site projects", status: "next" },
  { title: "Regional expansion", status: "next" },
] as const;

export const SCALE_UP_INTRO =
  "Our investment objective is not simply to finance another prototype. We are raising scale-up capital to build the manufacturing, technical and deployment capacity needed to take Riverbox from validated pilots into early commercial production.";

export const CAPITAL_USES = [
  { title: "Fabrication & machining", text: "Local fabrication and machining capacity for Riverbox production." },
  { title: "Machinery & tooling", text: "Workshop machinery, tooling, production jigs, fixtures and assembly equipment." },
  { title: "Testing & quality control", text: "Testing and quality-control infrastructure for consistent, reliable units." },
  { title: "Skilled technical team", text: "Machinists, fabricators, welders, electrical technicians and installation personnel." },
  { title: "Working capital", text: "Materials and system components for production runs." },
  { title: "Additional deployments", text: "More Riverbox installations beyond the first pilots." },
  { title: "Supplier network", text: "Developing our network of local suppliers and fabrication partners." },
  { title: "Commercial readiness", text: "Regulatory and commercial readiness for early commercial sales." },
];

export const GOALS = [
  {
    key: "short",
    title: "Short-term goals",
    points: [
      "Complete and field-test the first fully integrated Riverbox pilot systems at varying capacities and operating conditions.",
      "Validate mechanical, electrical and overall system performance under real field conditions.",
      "Identify and prepare suitable sites for additional pilots and early commercial deployments.",
      "Finalise the core engineering, fabrication and testing procedures required for repeatable production.",
    ],
  },
  {
    key: "manufacturing",
    title: "Manufacturing & capacity",
    points: [
      "Build local fabrication and machining capacity for Riverbox production.",
      "Acquire workshop machinery, tooling, assembly and testing equipment as production grows.",
      "Develop a skilled technical workforce of machinists, fabricators, welders, electrical technicians and installers.",
      "Establish a trained, quality-controlled network of local fabrication partners.",
      "Develop repeatable manufacturing procedures so Riverbox can be produced consistently and efficiently in Zambia.",
    ],
  },
  {
    key: "deployment",
    title: "Deployment & market",
    points: [
      "Expand Riverbox deployment into rural communities with suitable low-head water resources.",
      "Work toward deployment in 20+ rural communities with rural-electrification institutions, development organisations, NGOs and local partners.",
      "Partner with organisations in productive-use energy, agriculture, rural enterprise and off-grid electrification.",
      "Build a commercial pipeline of customers, project developers and institutional partners beyond the initial pilots.",
    ],
  },
  {
    key: "long",
    title: "Long-term vision",
    points: [
      "Become a Zambian engineering and renewable-energy deployment company delivering small hydropower from resource assessment to commissioning.",
      "Build manufacturing and deployment capacity for multiple installations each year.",
      "Explore industrial applications, including energy recovery from mine-water and wastewater flows.",
      "Expand into selected Southern African markets.",
      "Work toward 100+ Riverbox installations across Zambia and Southern Africa over time.",
    ],
  },
] as const;

export const REVENUE_STREAMS = [
  "Site screening & water-resource assessment",
  "Feasibility & preliminary engineering studies",
  "Riverbox equipment supply",
  "Complete micro-hydro installations",
  "Installation & commissioning services",
  "Multi-site rural-electrification projects",
  "Industrial water-energy recovery projects",
  "Maintenance, upgrades & technical support",
];

export const PARTNER_TYPES = [
  "Investors",
  "NGOs",
  "Energy companies",
  "Development organisations",
  "Rural-electrification institutions",
  "Technical partners",
  "Deployment partners",
  "Local fabrication partners",
];

/** Contact-form topic used by every "Invest / Partner with us" button. */
export const INVEST_TOPIC = "Investment / partnership";
export const INVEST_HREF = `/contact?topic=${encodeURIComponent(INVEST_TOPIC)}`;
