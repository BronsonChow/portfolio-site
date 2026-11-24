export type NavItem = {
  title: string;
  href: string;
  description?: string;
  icon: string;
  disabled?: boolean;
};

export const site_projects: NavItem[] = [
  {
    title: "Vocaloid Stuff",
    href: "/projects/vocaloid",
    description: "Under construction",
    icon: "",
    disabled: true,
  },
];

export const csc_436: NavItem[] = [
  {
    title: "Lab 1",
    href: "/csc-436/lab-1",
    description: "Static Foundations",
    icon: "",
    disabled: true,
  },
  {
    title: "Lab 2",
    href: "/csc-436/lab-2",
    description: "React Fundamentals",
    icon: "",
    disabled: true,
  },
  {
    title: "Lab 3",
    href: "/csc-436/lab-3",
    description: "Async React",
    icon: "",
    disabled: true,
  },
  {
    title: "Lab 4",
    href: "/csc-436/lab-4",
    description: "Express + Supabase API",
    icon: "",
    disabled: false,
  },
];