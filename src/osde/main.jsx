import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { asset } from "../lib/asset";
import "./osde.css";

const COVERAGE = [
  {
    title: "Cartilla",
    image: asset("osde/cartilla.jpg"),
    alt: "Médico en consulta con una paciente",
    text: "Red de prestadores en todo el país. El alcance cambia según el plan.",
  },
  {
    title: "Urgencias",
    image: asset("osde/urgencias.jpg"),
    alt: "Equipo médico en un pasillo de guardia",
    text: "Atención de guardia y emergencias, con la cobertura que corresponda al plan.",
  },
  {
    title: "Internación",
    image: asset("osde/internacion.jpg"),
    alt: "Enfermera junto a una paciente internada",
    text: "Estudios, prácticas e internación. En los planes altos, la habitación también cambia.",
  },
];

const PLANS = [
  {
    name: "210",
    text: "El plan de entrada. Consultas, estudios e internación, con cartilla propia y cobertura en el país.",
  },
  {
    name: "310",
    text: "Más prestadores y reintegros más altos. Es el plan que suelen elegir empresas y pymes.",
  },
  {
    name: "410",
    text: "Suma beneficios como odontología, óptica y un margen mayor de reintegros sobre el 310.",
  },
  {
    name: "510",
    text: "La cobertura más amplia de la línea: internación en suite y los reintegros más altos.",
  },
];

function Osde() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "");
    if (!name || !email.includes("@")) {
      setError("Completá nombre y un email válido.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <>
      <header className="bar">
        <div className="wrap bar-inner">
          <a className="logo" href="#inicio">
            OSDE
          </a>
          <nav>
            <a href="#cobertura">Cobertura</a>
            <a href="#planes">Planes</a>
            <a href="#consulta">Consulta</a>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section className="hero wrap">
          <div>
            <p className="eyebrow">Medicina prepaga</p>
            <h1>Cobertura médica para vos y tu grupo familiar</h1>
            <p className="lead">
              OSDE es una prepaga argentina. Esta página es una maqueta académica: resume cartilla,
              urgencias y planes, y no reemplaza al sitio oficial.
            </p>
            <div className="actions">
              <a className="btn" href="#planes">
                Ver planes
              </a>
              <a className="btn ghost" href="https://www.osde.com.ar/" target="_blank" rel="noreferrer">
                Sitio oficial
              </a>
            </div>
          </div>
          <img
            className="hero-photo"
            src={asset("osde/hero.jpg")}
            alt="Médica en consulta con una paciente"
          />
        </section>

        <section className="band" id="cobertura">
          <div className="wrap cards">
            {COVERAGE.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt={item.alt} />
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap block" id="planes">
          <p className="eyebrow">Planes</p>
          <h2>210, 310, 410 y 510</h2>
          <p className="lead">
            También existe el 450. La cuota no es un número fijo: depende de la edad, del grupo
            familiar y de si derivás aportes de obra social.
          </p>
          <div className="plans">
            {PLANS.map((plan) => (
              <article key={plan.name}>
                <span>OSDE</span>
                <strong>{plan.name}</strong>
                <p>{plan.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap block consulta" id="consulta">
          <div>
            <p className="eyebrow">Consulta</p>
            <h2>Pedí que te orienten</h2>
            <p className="lead">
              En el sitio real, un asesor responde con el valor según tu caso. Acá el formulario no
              envía nada: solo muestra la confirmación en pantalla.
            </p>
          </div>
          {sent ? (
            <p className="ok">Listo. En esta maqueta el mensaje queda acá y no llega a OSDE.</p>
          ) : (
            <form onSubmit={submit}>
              <label>
                Nombre
                <input name="name" autoComplete="name" />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Plan de interés
                <select name="plan" defaultValue="310">
                  <option>210</option>
                  <option>310</option>
                  <option>410</option>
                  <option>450</option>
                  <option>510</option>
                </select>
              </label>
              {error && <p className="err">{error}</p>}
              <button className="btn" type="submit">
                Enviar consulta
              </button>
            </form>
          )}
        </section>
      </main>

      <footer>
        <div className="wrap">
          <strong>OSDE</strong>
          <p>Maqueta académica. No es el sitio oficial ni comercializa planes.</p>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Osde />
  </StrictMode>,
);
