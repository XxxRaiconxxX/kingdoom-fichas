import { useEffect, useMemo, useRef, useState } from "react";

type TutorialOverlayProps = {
  open: boolean;
  onFinish: () => void;
};

type TutorialStep = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  sceneClassName: string;
  sceneLabel: string;
};

const SWIPE_THRESHOLD_PX = 48;

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    eyebrow: "Archivo del Trono",
    title: "Bienvenido al taller de fichas del reino",
    body:
      "Esta app te ayuda a forjar personajes compatibles con Kingdoom sin perder la estética ni las reglas del grupo.",
    bullets: [
      "Crea fichas listas para WhatsApp desde el celular.",
      "Recibe validación inmediata antes de compartir.",
      "Mantén coherencia con el tono y el formato del reino.",
    ],
    sceneClassName: "is-welcome",
    sceneLabel: "Pergamino ceremonial y sello del reino",
  },
  {
    eyebrow: "Forja guiada",
    title: "Completa la ficha o invoca una base aleatoria",
    body:
      "Puedes escribir cada apartado a mano o usar una ficha aleatoria como punto de partida para luego pulirla a tu gusto.",
    bullets: [
      "Llena identidad, combate, rango social e historia.",
      "Usa 'Ficha aleatoria' si quieres acelerar el arranque.",
      "La app te muestra progreso de stats, poderes y apartados clave.",
    ],
    sceneClassName: "is-forge",
    sceneLabel: "Mesa de escritura con dados, pluma y ficha en progreso",
  },
  {
    eyebrow: "Consejo del Archivista",
    title: "Valida la ficha y consulta la IA del reino",
    body:
      "La revisión local detecta errores duros; el Archivista de IA revisa coherencia narrativa, lore y consistencia general.",
    bullets: [
      "Detecta problemas de formato, puntos, magia y estructura.",
      "Recibe observaciones temáticas antes de enviar al grupo.",
      "Usa la IA para pulir historia, tono y lógica del personaje.",
    ],
    sceneClassName: "is-archive",
    sceneLabel: "Atril arcano con halo violeta y ojo del archivista",
  },
  {
    eyebrow: "Entrega final",
    title: "Copia o envía tu ficha cuando quede digna del reino",
    body:
      "Cuando el panel marque la ficha como apta, podrás copiar el texto final o compartirlo directo por WhatsApp.",
    bullets: [
      "Revisa la vista previa final antes de compartir.",
      "Usa 'Copiar texto final' para pegarla donde quieras.",
      "Si todo está listo, envíala al grupo y entra al reino.",
    ],
    sceneClassName: "is-delivery",
    sceneLabel: "Sello final con ruta luminosa hacia WhatsApp",
  },
];

export function TutorialOverlay({ open, onFinish }: TutorialOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onFinish();
        return;
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((previous) =>
          Math.min(previous + 1, TUTORIAL_STEPS.length - 1),
        );
      }

      if (event.key === "ArrowLeft") {
        setCurrentIndex((previous) => Math.max(previous - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onFinish]);

  const isLastStep = currentIndex === TUTORIAL_STEPS.length - 1;
  const step = TUTORIAL_STEPS[currentIndex];

  const progressLabel = useMemo(
    () => `${currentIndex + 1} / ${TUTORIAL_STEPS.length}`,
    [currentIndex],
  );

  if (!open) {
    return null;
  }

  function goNext() {
    if (isLastStep) {
      onFinish();
      return;
    }

    setCurrentIndex((previous) => Math.min(previous + 1, TUTORIAL_STEPS.length - 1));
  }

  function goPrev() {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX.current === null) {
      return;
    }

    const delta = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (delta < 0) {
      goNext();
      return;
    }

    goPrev();
  }

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="tutorial-overlay__backdrop" aria-hidden="true" />

      <section
        className="tutorial-card"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="tutorial-card__topbar">
          <span className="tutorial-card__progress">{progressLabel}</span>
          <button type="button" className="tutorial-card__skip" onClick={onFinish}>
            Saltar
          </button>
        </div>

        <div className="tutorial-progress" aria-label={`Paso ${progressLabel}`}>
          {TUTORIAL_STEPS.map((tutorialStep, index) => (
            <span
              key={tutorialStep.title}
              className={`tutorial-progress__dot ${index === currentIndex ? "is-active" : ""}`}
            />
          ))}
        </div>

        <div className="tutorial-card__content">
          <div className="tutorial-copy">
            <p className="eyebrow">{step.eyebrow}</p>
            <h2 id="tutorial-title">{step.title}</h2>
            <p className="tutorial-copy__body">{step.body}</p>
            <ul className="tutorial-copy__list">
              {step.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <div className="tutorial-scene" aria-label={step.sceneLabel}>
            <div className={`tutorial-scene__frame ${step.sceneClassName}`}>
              <div className="tutorial-scene__halo" />
              <div className="tutorial-scene__card tutorial-scene__card--main" />
              <div className="tutorial-scene__card tutorial-scene__card--side" />
              <div className="tutorial-scene__sigil" />
              <div className="tutorial-scene__runes" />
              <div className="tutorial-scene__beam" />
              <div className="tutorial-scene__caption">{step.sceneLabel}</div>
            </div>
          </div>
        </div>

        <div className="tutorial-card__actions">
          <button
            type="button"
            className="button-secondary tutorial-card__back"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            Atrás
          </button>
          <button type="button" className="tutorial-card__next" onClick={goNext}>
            {isLastStep ? "Forjar mi ficha" : "Siguiente"}
          </button>
        </div>
      </section>
    </div>
  );
}
