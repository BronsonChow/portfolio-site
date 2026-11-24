"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useTheme } from "next-themes";
import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  site_projects,
  csc_436,
  type NavItem,
} from "@/data/navigation";

// Font Awesome's CSS is loaded in globals.css instead of being injected at runtime
config.autoAddCss = false;

const styles = {
  // header bar
  header: "sticky top-0 z-50 w-full border-navbar bg-navbar transition-colors",
  header_scrolled:
    "bg-navbar/95 backdrop-blur-lg supports-[backdrop-filter]:bg-navbar/80",
  nav: "flex h-navbar-height w-full items-center justify-between px-navbar-padding",
  brand:
    "rounded-nav-button px-brand-padding-x py-brand-padding-y text-brand font-semibold tracking-tight whitespace-nowrap transition-colors hover:bg-accent",

  // desktop dropdown menus
  menu_root: "relative z-10 hidden max-w-max flex-1 items-center justify-center md:flex",
  menu_list: "group flex flex-1 list-none items-center justify-center gap-nav-button-gap",
  trigger:
    "group inline-flex min-h-nav-button w-max items-center justify-center rounded-nav-button bg-transparent px-nav-button-padding-x py-nav-button-padding-y text-nav font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50",
  caret:
    "relative top-px ml-1 size-caret transition duration-300 group-data-[state=open]:rotate-180",
  content:
    "left-0 top-0 w-full bg-popover p-1 pr-1.5 pb-1.5 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
  dropdown_grid: "grid w-dropdown-width grid-cols-2 gap-dropdown-gap rounded-dropdown border-dropdown-grid bg-popover p-dropdown-padding shadow",
  dropdown_note: "text-menu-note text-muted-foreground",
  dropdown_note_link: "font-medium text-foreground hover:underline",
  viewport_wrapper: "absolute top-full left-0 flex justify-center",
  viewport:
    "relative mt-dropdown-offset h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-dropdown border-dropdown bg-popover text-popover-foreground shadow data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",

  // menu items (global)
  menu_item:
    "flex w-full flex-row gap-x-menu-item-gap rounded-menu-item p-menu-item-padding hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
  menu_item_disabled:
    "flex w-full flex-row gap-x-menu-item-gap rounded-menu-item p-menu-item-padding cursor-not-allowed opacity-50",
  menu_item_icon:
    "flex aspect-square size-menu-item-icon shrink-0 items-center justify-center rounded-icon-box border-icon-box bg-background/40 shadow-sm",
  menu_item_title: "text-menu-title font-medium",
  menu_item_description: "text-menu-description text-muted-foreground",

  // dark-mode & mobile dropdown button
  icon_button:
    "inline-flex size-nav-button shrink-0 items-center justify-center rounded-icon-button border-icon-button bg-icon-button text-icon-button-foreground transition-colors hover:bg-icon-button-hover hover:text-icon-button-hover-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  hamburger_line:
    "absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300",

  // mobile menu
  mobile_menu:
    "fixed top-navbar-height right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-mobile-menu bg-navbar/95 backdrop-blur-lg supports-[backdrop-filter]:bg-navbar/80 md:hidden",
  mobile_menu_inner: "size-full overflow-y-auto p-navbar-padding ease-out animate-in zoom-in-[0.97]",
  mobile_menu_label: "text-menu-label",
};

const cancel_hover = (e: React.PointerEvent) => e.preventDefault();
const click_only_trigger = { onPointerMove: cancel_hover, onPointerLeave: cancel_hover };
const click_only_panel = { onPointerEnter: cancel_hover, onPointerLeave: cancel_hover };

export default function Navbar() {
  const [open, set_open] = useState(false);
  const scrolled = useScroll(10);

  // prevents scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // mobile adaptive window
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const on_change = () => desktop.matches && set_open(false);
    desktop.addEventListener("change", on_change);
    return () => desktop.removeEventListener("change", on_change);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.header_scrolled : ""}`}
    >
      <nav className={styles.nav}>
        <div className="flex items-center gap-nav-gap">
          <Link href="/" className={styles.brand}>
            bChow
          </Link>

          <NavigationMenu.Root className={styles.menu_root}>
            <NavigationMenu.List className={styles.menu_list}>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className={styles.trigger} {...click_only_trigger}>
                  Site Projects <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.content} {...click_only_panel}>
                  <ul className={styles.dropdown_grid}>
                    {site_projects.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-dropdown-padding">
                    <p className={styles.dropdown_note}>
                      Under construction{" "}:{" "}
                      <Link href="https://bchow.netlify.app/index.html" className={styles.dropdown_note_link}>
                        Visit the old site
                      </Link>
                    </p>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <NavigationMenu.Trigger className={styles.trigger} {...click_only_trigger}>
                  CSC 436 <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.content} {...click_only_panel}>
                  <ul className={styles.dropdown_grid}>
                    {csc_436.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-dropdown-padding">
                    <p className={styles.dropdown_note}>
                      CSC 436 - Modern Web Development Projects
                    </p>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <div className={styles.viewport_wrapper}>
              <NavigationMenu.Viewport className={styles.viewport} {...click_only_panel} />
            </div>
          </NavigationMenu.Root>
        </div>

        <div className="flex items-center gap-icon-button-gap">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => set_open(!open)}
            className={`${styles.icon_button} md:hidden`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} />
          </button>
        </div>
      </nav>

      <MobileMenu open={open} on_navigate={() => set_open(false)}>
        <NavigationMenu.Root className="max-w-full">
          <div className="flex w-full flex-col gap-y-mobile-menu-gap">
            <span className={styles.mobile_menu_label}>Site Projects</span>
            {site_projects.map((item) => (
              <ListItem key={item.title} {...item} />
            ))}
            <span className={styles.mobile_menu_label}>CSC 436</span>
            {csc_436.map((item) => (
              <ListItem key={item.title} {...item} />
            ))}
          </div>
        </NavigationMenu.Root>
      </MobileMenu>
    </header>
  );
}

function MobileMenu({
  open,
  on_navigate,
  children,
}: {
  open: boolean;
  on_navigate: () => void;
  children: React.ReactNode;
}) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={styles.mobile_menu}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) on_navigate();
      }}
    >
      <div className={styles.mobile_menu_inner}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ListItem({ title, description, icon, href, disabled }: NavItem) {
  const content = (
    <>
      {/* TODO : icon images */}
      {/* <div className={styles.menu_item_icon}>
        <NavIcon src={icon} size={20} />
      </div> */}
      <div className="flex flex-col items-start justify-center">
        <span className={styles.menu_item_title}>{title}</span>
        {description && (
          <span className={styles.menu_item_description}>{description}</span>
        )}
      </div>
    </>
  );

  // disabled items aren't links: they can't be clicked or reached with Tab
  if (disabled) {
    return (
      <div className={styles.menu_item_disabled} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className={styles.menu_item}>
        {content}
      </Link>
    </NavigationMenu.Link>
  );
}

// TODO : icon images
// function NavIcon({ src, size }: { src: string; size: number }) {
//   return (
//     <Image
//       src={src}
//       alt=""
//       width={size}
//       height={size}
//       className="dark:invert"
//       style={{ width: size, height: size }}
//     />
//   );
// }

function ThemeToggle() {
  const { resolvedTheme: resolved_theme, setTheme: set_theme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => set_theme(resolved_theme === "dark" ? "light" : "dark")}
      className={styles.icon_button}
      aria-label="Toggle dark mode"
    >
      {/* Both icons render; CSS shows the right one, so there's no flash on page load */}
      <FontAwesomeIcon icon={faSun} className="size-icon dark:hidden" />
      <FontAwesomeIcon icon={faMoon} className="hidden size-icon dark:block" />
    </button>
  );
}

// hamburger animation
function MenuToggleIcon({ open }: { open: boolean }) {
  const line = styles.hamburger_line;
  return (
    <span className="relative block h-3.5 w-4" aria-hidden="true">
      <span className={`${line} ${open ? "top-1.5 rotate-45" : "top-0"}`} />
      <span className={`${line} top-1.5 ${open ? "opacity-0" : "opacity-100"}`} />
      <span className={`${line} ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
    </span>
  );
}

// prevents UI tearing (hook)
function useScroll(threshold: number) {
  return useSyncExternalStore(
    subscribe_to_scroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function subscribe_to_scroll(on_change: () => void) {
  window.addEventListener("scroll", on_change, { passive: true });
  return () => window.removeEventListener("scroll", on_change);
}
