import { useEffect, useMemo, useState } from "react";
import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";
import "./App.css";
import heroImage from "./assets/hero.png";
import { CLASES_SOCIALES, exigeTitulo } from "./data/clasesSociales";
import { sincronizarGrimorio } from "./data/grimorio";
import { RAZAS_POR_CATEGORIA } from "./data/razas";
import { REINOS } from "./data/reinos";
import {
  type Estadisticas,
  type Ficha,
  PUNTOS_ESTADISTICAS,
  PUNTOS_PODERES,
  PV_BASE,
  STAT_LABELS,
  fichaVacia,
  sumaEstadisticas,
  sumaNivelesPoderes,
} from "./schema/fichaSchema";
import {
  analizarFichaConIA,
  type AnalisisIA,
} from "./utils/analizarConIA";
import { generarFichaAleatoria } from "./utils/generarFichaAleatoria";
import { generarTextoWhatsApp } from "./utils/generarTextoWhatsApp";
import { validarFicha } from "./validation/validarFicha";

const ICONO: Record<string, string> = {
  ok: "OK",
  warn: "!",
  error: "X",
};

type CampoProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
};

function Campo({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: CampoProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function SectionCard(props: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-card">
      <div className="section-card__head">
        <p className="eyebrow">{props.eyebrow}</p>
        <h2>{props.title}</h2>
        <p className="section-card__description">{props.description}</p>
      </div>
      {props.children}
    </section>
  );
}

function MetricCard(props: { label: string; value: string; detail: string }) {
  return (
    <div className="metric-card">
      <span className="metric-card__label">{props.label}</span>
      <strong className="metric-card__value">{props.value}</strong>
      <span className="metric-card__detail">{props.detail}</span>
    </div>
  );
}

export default function App() {
  const [ficha, setFicha] = useState<Ficha>(fichaVacia());
  const [aviso, setAviso] = useState("");
  const [sincronizando, setSincronizando] = useState(false);
  const [analizando, setAnalizando] = useState(false);
  const [analisis, setAnalisis] = useState<AnalisisIA | null>(null);
  const [errorIA, setErrorIA] = useState("");

  useEffect(() => {
    sincronizarGrimorio().catch(() => {});
  }, []);

  const setCampo = (campo: keyof Ficha, valor: string) =>
    setFicha((anterior) => ({ ...anterior, [campo]: valor }));

  const setStat = (clave: keyof Estadisticas, valor: string) =>
    setFicha((anterior) => ({
      ...anterior,
      estadisticas: {
        ...anterior.estadisticas,
        [clave]: Math.max(0, parseInt(valor || "0", 10) || 0),
      },
    }));

  const validacion = useMemo(() => validarFicha(ficha), [ficha]);
  const texto = useMemo(() => generarTextoWhatsApp(ficha), [ficha]);
  const sumaStats = sumaEstadisticas(ficha.estadisticas);
  const restantesStats = PUNTOS_ESTADISTICAS - sumaStats;
  const sumaPoderes = sumaNivelesPoderes(ficha.poderesOficiales);
  const restantesPoderes = PUNTOS_PODERES - sumaPoderes;
  const reinoSeleccionado = REINOS.find((reino) => reino.nombre === ficha.reino);

  async function sincronizar() {
    setSincronizando(true);
    try {
      const total = await sincronizarGrimorio();
      setAviso(`Grimorio actualizado: ${total} estilos de magia disponibles.`);
      setFicha((anterior) => ({ ...anterior }));
    } catch {
      setAviso(
        "No se pudo actualizar el grimorio. La app seguira usando la copia local."
      );
    } finally {
      setSincronizando(false);
      setTimeout(() => setAviso(""), 3000);
    }
  }

  async function copiar() {
    try {
      await Clipboard.write({ string: texto });
    } catch {
      await navigator.clipboard?.writeText(texto);
    }

    setAviso("Ficha copiada al portapapeles.");
    setTimeout(() => setAviso(""), 2500);
  }

  async function compartir() {
    try {
      await Share.share({ title: "Ficha de Kingdoom", text: texto });
    } catch {
      await copiar();
    }
  }

  async function analizarIA() {
    setAnalizando(true);
    setErrorIA("");
    setAnalisis(null);

    try {
      const avisos = validacion.resultados
        .filter((resultado) => resultado.estado !== "ok")
        .map((resultado) => `${resultado.apartado}: ${resultado.mensaje}`);
      const respuesta = await analizarFichaConIA(ficha, avisos);
      setAnalisis(respuesta);
    } catch (error) {
      setErrorIA(
        error instanceof Error
          ? error.message
          : "No se pudo analizar la ficha con IA."
      );
    } finally {
      setAnalizando(false);
    }
  }

  function aleatoria() {
    setFicha(generarFichaAleatoria());
    setAviso("Se genero una base aleatoria para que la edites a tu gusto.");
    setTimeout(() => setAviso(""), 2500);
  }

  function limpiar() {
    setFicha(fichaVacia());
    setAnalisis(null);
    setErrorIA("");
  }

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow--left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--right" aria-hidden="true" />

      <header className="hero-card">
        <div className="hero-card__copy">
          <p className="eyebrow">Forja de fichas del reino</p>
          <div className="royal-mark">
            <span className="royal-mark__sigil">III</span>
            <div>
              <strong>Archivo del Trono</strong>
              <span>Companion oficial para crear fichas dignas del reino.</span>
            </div>
          </div>
          <h1>Asistente premium para crear fichas listas para WhatsApp</h1>
          <p className="hero-card__lead">
            Construye tu personaje con la estetica de Kingdoom, valida reglas
            en tiempo real y remata la revision con IA antes de compartirlo.
          </p>

          <div className="hero-card__chips">
            <span>Validacion local</span>
            <span>Analisis IA</span>
            <span>Salida exacta para bot</span>
          </div>
        </div>

        <div className="hero-card__visual">
          <img src={heroImage} alt="Heroe del reino" />
          <div className="hero-card__seal">
            <span className="hero-card__seal-title">Estado del reino</span>
            <strong>{validacion.aprobada ? "Ficha apta" : "Revision en curso"}</strong>
            <span>
              {validacion.aprobada
                ? "Lista para enviarse al grupo."
                : `${validacion.errores} errores y ${validacion.avisos} avisos pendientes.`}
            </span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <button onClick={aleatoria}>Ficha aleatoria</button>
        <button className="button-secondary" onClick={sincronizar} disabled={sincronizando}>
          {sincronizando ? "Sincronizando grimorio..." : "Sincronizar grimorio"}
        </button>
        <button className="button-secondary" onClick={limpiar}>
          Limpiar tablero
        </button>
      </div>

      {aviso ? <div className="toast">{aviso}</div> : null}

      <main className="workspace">
        <div className="workspace__main">
          <SectionCard
            eyebrow="Identidad"
            title="Nucleo del personaje"
            description="Define la presencia base del personaje antes de entrar en combate, politica o magia."
          >
            <div className="field-grid field-grid--two">
              <Campo
                label="Nombre completo / apodo"
                value={ficha.nombre}
                onChange={(valor) => setCampo("nombre", valor)}
              />
              <Campo
                label="Edad"
                value={ficha.edad}
                onChange={(valor) => setCampo("edad", valor)}
                placeholder="Ej: 27 / 124 anos"
              />
              <Campo
                label="Genero"
                value={ficha.genero}
                onChange={(valor) => setCampo("genero", valor)}
              />
              <Campo
                label="Estatura"
                value={ficha.estatura}
                onChange={(valor) => setCampo("estatura", valor)}
                placeholder="Ej: 1.80 m"
              />
            </div>

            <div className="field-grid field-grid--two">
              <label className="field">
                <span className="field__label">Raza</span>
                <select
                  value={ficha.raza}
                  onChange={(event) => setCampo("raza", event.target.value)}
                >
                  <option value="">Selecciona una raza</option>
                  {RAZAS_POR_CATEGORIA.map((categoria) => (
                    <optgroup key={categoria.categoria} label={categoria.categoria}>
                      {categoria.razas.map((raza) => (
                        <option key={raza} value={raza}>
                          {raza}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field__label">Reino de origen</span>
                <select
                  value={ficha.reino}
                  onChange={(event) => setCampo("reino", event.target.value)}
                >
                  <option value="">Selecciona un reino</option>
                  {REINOS.map((reino) => (
                    <option key={reino.id} value={reino.nombre}>
                      {reino.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="kingdom-ribbon">
              <div>
                <span className="kingdom-ribbon__label">Lectura del reino</span>
                <strong>{reinoSeleccionado?.nombre ?? "Sin reino definido"}</strong>
              </div>
              <p>
                {reinoSeleccionado
                  ? "La seleccion ya puede cruzarse con raza, historia y tono general del personaje."
                  : "Elegir un reino ayuda a validar coherencia cultural, politica y narrativa."}
              </p>
            </div>

            <div className="ritual-note">
              <span className="ritual-note__title">Rito de validacion</span>
              <p>
                Cada bloque que completes acerca la ficha a un formato estable,
                legible y compatible con el flujo real de Kingdoom.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Combate y grimorio"
            title="Balance del poder"
            description="Este bloque controla estadisticas, magia oficial y capacidades de combate del personaje."
          >
            <div className="metrics-grid">
              <MetricCard
                label="Estadisticas"
                value={`${sumaStats}/${PUNTOS_ESTADISTICAS}`}
                detail={
                  restantesStats >= 0
                    ? `${restantesStats} puntos restantes`
                    : `${Math.abs(restantesStats)} puntos excedidos`
                }
              />
              <MetricCard
                label="Poderes"
                value={`${sumaPoderes}/${PUNTOS_PODERES}`}
                detail={
                  restantesPoderes >= 0
                    ? `${restantesPoderes} niveles restantes`
                    : `${Math.abs(restantesPoderes)} niveles excedidos`
                }
              />
              <MetricCard
                label="PV base"
                value={`${PV_BASE}`}
                detail="Base de referencia del reino"
              />
            </div>

            <Campo
              label={`Poderes oficiales - uno por linea con formato "Nombre Lvl X"`}
              value={ficha.poderesOficiales}
              onChange={(valor) => setCampo("poderesOficiales", valor)}
              textarea
              placeholder={"Magia de gravedad Lvl 3\nMagia de fuego Lvl 2"}
            />

            <fieldset className="stats-panel">
              <legend>Distribucion de estadisticas</legend>
              <div className="stats-grid">
                {(Object.keys(STAT_LABELS) as (keyof Estadisticas)[]).map((clave) => (
                  <label key={clave} className="stat-card">
                    <span>{STAT_LABELS[clave]}</span>
                    <input
                      type="number"
                      min={0}
                      value={ficha.estadisticas[clave]}
                      onChange={(event) => setStat(clave, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field-grid field-grid--two">
              <Campo
                label="Arma principal"
                value={ficha.armaPrincipal}
                onChange={(valor) => setCampo("armaPrincipal", valor)}
              />
              <Campo
                label="Estilo de combate"
                value={ficha.estiloCombate}
                onChange={(valor) => setCampo("estiloCombate", valor)}
              />
            </div>

            <Campo
              label="Habilidades no magicas"
              value={ficha.habilidadesNoMagicas}
              onChange={(valor) => setCampo("habilidadesNoMagicas", valor)}
              textarea
            />
          </SectionCard>

          <SectionCard
            eyebrow="Rango, clase y presencia"
            title="Posicion social del personaje"
            description="Ajusta el estatus del personaje para que su trasfondo, acceso y trato en el mundo se sientan creibles."
          >
            <div className="field-grid field-grid--two">
              <label className="field">
                <span className="field__label">Clase social</span>
                <select
                  value={ficha.claseSocial}
                  onChange={(event) => setCampo("claseSocial", event.target.value)}
                >
                  <option value="">Selecciona una clase social</option>
                  {CLASES_SOCIALES.map((clase) => (
                    <option key={clase} value={clase}>
                      {clase}
                    </option>
                  ))}
                </select>
              </label>

              <Campo
                label="Profesion"
                value={ficha.profesion}
                onChange={(valor) => setCampo("profesion", valor)}
              />
            </div>

            {exigeTitulo(ficha.claseSocial) ? (
              <Campo
                label="Titulo de nobleza"
                value={ficha.tituloNobleza}
                onChange={(valor) => setCampo("tituloNobleza", valor)}
              />
            ) : null}

            <div className="field-grid field-grid--two">
              <Campo
                label="Personalidad"
                value={ficha.personalidad}
                onChange={(valor) => setCampo("personalidad", valor)}
                textarea
              />
              <Campo
                label="Debilidades"
                value={ficha.debilidades}
                onChange={(valor) => setCampo("debilidades", valor)}
                textarea
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Narrativa final"
            title="Historia, presencia e inventario"
            description="La IA y la validacion del reino dependen mucho de este bloque para medir coherencia real."
          >
            <Campo
              label="Historia"
              value={ficha.historia}
              onChange={(valor) => setCampo("historia", valor)}
              textarea
            />

            <div className="field-grid field-grid--two">
              <Campo
                label="Inventario"
                value={ficha.inventario}
                onChange={(valor) => setCampo("inventario", valor)}
                textarea
              />
              <Campo
                label="Extras"
                value={ficha.extras}
                onChange={(valor) => setCampo("extras", valor)}
                textarea
              />
            </div>

            <Campo
              label="Imagen o descripcion visual"
              value={ficha.imagenDescripcion}
              onChange={(valor) => setCampo("imagenDescripcion", valor)}
              textarea
            />
          </SectionCard>
        </div>

        <aside className="workspace__sidebar">
          <section className="sidebar-card sidebar-card--status">
            <p className="eyebrow">Panel de veredicto</p>
            <div className={`summary-pill ${validacion.aprobada ? "is-ok" : "is-error"}`}>
              {validacion.aprobada
                ? "Ficha lista para el reino"
                : `${validacion.errores} errores y ${validacion.avisos} avisos activos`}
            </div>

            <div className="sidebar-metrics">
              <MetricCard
                label="Errores"
                value={`${validacion.errores}`}
                detail="Bloquean la entrega"
              />
              <MetricCard
                label="Avisos"
                value={`${validacion.avisos}`}
                detail="Requieren revision"
              />
            </div>
          </section>

          <section className="sidebar-card">
            <div className="sidebar-card__head">
              <p className="eyebrow">Checklist del reino</p>
              <h3>Revision automatica</h3>
            </div>
            <ul className="checklist">
              {validacion.resultados.map((resultado, index) => (
                <li key={`${resultado.apartado}-${index}`} className={`checklist__item is-${resultado.estado}`}>
                  <span className="checklist__badge">{ICONO[resultado.estado]}</span>
                  <div>
                    <strong>{resultado.apartado}</strong>
                    <p>{resultado.mensaje}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-card sidebar-card--ia">
            <div className="sidebar-card__head">
              <p className="eyebrow">Consejo del archivista</p>
              <h3>Analisis con IA</h3>
            </div>

            <button className="button-ia" onClick={analizarIA} disabled={analizando}>
              {analizando ? "Analizando ficha..." : "Analizar con IA"}
            </button>

            {errorIA ? <div className="ia-error-box">{errorIA}</div> : null}

            {analisis ? (
              <div className={`ia-result ia-result--${analisis.veredicto}`}>
                <div className="ia-result__banner">
                  <strong>
                    {analisis.veredicto === "aprobada"
                      ? "La IA ve una ficha solida"
                      : "La IA recomienda pulir la ficha"}
                  </strong>
                  <span>{analisis.veredicto}</span>
                </div>

                {analisis.resumen ? <p className="ia-result__summary">{analisis.resumen}</p> : null}

                <ul className="ia-suggestion-list">
                  {analisis.sugerencias.map((sugerencia, index) => (
                    <li
                      key={`${sugerencia.apartado}-${index}`}
                      className={`ia-suggestion ia-suggestion--${sugerencia.severidad}`}
                    >
                      <div className="ia-suggestion__top">
                        <strong>{sugerencia.apartado}</strong>
                        <span>{sugerencia.severidad}</span>
                      </div>
                      <p>{sugerencia.problema}</p>
                      <div className="ia-suggestion__hint">{sugerencia.sugerencia}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="sidebar-empty">
                El analisis IA te ayudara a reforzar coherencia, tono y balance
                antes de enviar la ficha.
              </p>
            )}
          </section>

          <section className="sidebar-card">
            <div className="sidebar-card__head">
              <p className="eyebrow">Salida final</p>
              <h3>Entrega para WhatsApp</h3>
            </div>

            <div className="action-stack">
              <button disabled={!validacion.aprobada} onClick={copiar}>
                Copiar texto final
              </button>
              <button
                className="button-secondary"
                disabled={!validacion.aprobada}
                onClick={compartir}
              >
                Enviar a WhatsApp
              </button>
            </div>

            <details className="preview-panel">
              <summary>Ver texto final</summary>
              <pre>{texto}</pre>
            </details>
          </section>
        </aside>
      </main>
    </div>
  );
}
