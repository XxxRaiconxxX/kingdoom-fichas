import { useEffect, useState } from "react";

// Devuelve true cuando el viewport es de móvil (<= maxWidth px).
// Se usa para activar el modo colapsable de las secciones en pantallas verticales.
export function useIsMobile(maxWidth = 780): boolean {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}
