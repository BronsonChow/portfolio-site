import Image from "next/image";

const styles = {
  // fixed behind everything, so it stays put while the page scrolls
  wrapper: "pointer-events-none fixed inset-0 -z-10",
  image: "object-cover object-[50%_45%]",
  // tints the image toward the theme so text on top stays readable
  overlay: "absolute inset-0 bg-accent/50 mix-blend-hard-light dark:mix-blend-multiply",
};

export default function PageBackground({ src }: { src: string }) {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" fetchPriority="high" className={styles.image} />
      <div className={styles.overlay} />
    </div>
  );
}
