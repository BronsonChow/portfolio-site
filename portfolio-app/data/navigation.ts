// Navbar menu content. Edit titles, links and icons here.
// Icon paths point into the `public/` folder: "/icons/api.svg" is served from public/icons/api.svg.

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  icon: string;
};

// "Product" dropdown: shown as a 2-column grid of cards
export const site_projects: NavItem[] = [
  {
    title: "Vocaloid Stuff",
    href: "#",
    description: "Under construction",
    icon: "",
  },
];

// "Company" dropdown, left column: cards with descriptions
export const csc_436: NavItem[] = [
  {
    title: "Lab 1",
    href: "#",
    description: "Static Foundations",
    icon: "",
  },
  {
    title: "Lab 2",
    href: "#",
    description: "React Fundamentals",
    icon: "",
  },
];