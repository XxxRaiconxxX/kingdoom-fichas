import type { ReactNode } from "react";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

// Tarjeta de sección con encabezado (eyebrow + título + descripción).
export function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card__head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="section-card__description">{description}</p>
      </div>
      {children}
    </section>
  );
}
