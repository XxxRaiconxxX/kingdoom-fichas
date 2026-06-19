import { useState, type ReactNode } from "react";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  // Cuando es true, el encabezado actúa como botón que pliega/despliega el
  // contenido (modo móvil, para reducir saturación en pantallas verticales).
  collapsible?: boolean;
  defaultOpen?: boolean;
};

// Tarjeta de sección con encabezado (eyebrow + título + descripción).
// En modo colapsable muestra una flecha y oculta el cuerpo al plegarse.
export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
}: SectionCardProps) {
  const [abierta, setAbierta] = useState(defaultOpen);

  const mostrarCuerpo = !collapsible || abierta;

  const head = (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-card__description">{description}</p>
    </>
  );

  return (
    <section
      className={`section-card${collapsible ? " section-card--collapsible" : ""}${
        collapsible && !abierta ? " is-collapsed" : ""
      }`}
    >
      {collapsible ? (
        <button
          type="button"
          className="section-card__head section-card__toggle"
          aria-expanded={abierta}
          onClick={() => setAbierta((v) => !v)}
        >
          <span className="section-card__head-text">{head}</span>
          <span className="section-card__chevron" aria-hidden="true">
            ▾
          </span>
        </button>
      ) : (
        <div className="section-card__head">{head}</div>
      )}

      {mostrarCuerpo ? <div className="section-card__body">{children}</div> : null}
    </section>
  );
}
