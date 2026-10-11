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

const COMPARE = [
  {
    feature: "Cartilla",
    values: ["Cerrada y acotada", "Más prestadores", "Amplia", "Amplia", "La más amplia"],
  },
  {
    feature: "Consultas y estudios",
    values: ["En cartilla", "En cartilla", "En cartilla", "En cartilla", "En cartilla"],
  },
  {
    feature: "Internación",
    values: ["Incluida", "Incluida", "Incluida", "Incluida", "Incluida"],
  },
  {
    feature: "Habitación",
    values: ["Compartida", "Individual", "Individual", "Individual", "Suite"],
  },
  {
    feature: "Reintegros",
    values: ["Bajos", "Medios", "Altos", "Más altos", "Los más altos"],
  },
  {
    feature: "Odontología",
    values: ["Básica", "Básica", "Más cobertura", "Más cobertura", "Más cobertura"],
  },
  {
    feature: "Óptica",
    values: ["No incluye", "Limitada", "Incluida", "Incluida", "Incluida"],
  },
  {
    feature: "Maternidad",
    values: ["Incluida", "Incluida", "Incluida", "Incluida", "Incluida"],
  },
];

const PLAN_NAMES = ["210", "310", "410", "450", "510"];

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
              Cartilla, urgencias e internación para vos y tu grupo familiar.
            </p>
            <div className="actions">
              <a className="btn" href="#planes">
                Ver planes
              </a>
            </div>
          </div>
          <div className="hero-frame">
            <img
              className="hero-photo"
              src={asset("osde/hero.jpg")}
              alt="Médica en consulta con una paciente"
            />
          </div>
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
          <h2>Compará 210, 310, 410, 450 y 510</h2>
          <p className="lead">
            La cuota depende de la edad, del grupo familiar y de si derivás aportes. El cuadro
            muestra cómo cambia la cobertura de un plan al siguiente.
          </p>
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>Cobertura</th>
                  {PLAN_NAMES.map((name) => (
                    <th key={name}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {row.values.map((value, index) => (
                      <td key={PLAN_NAMES[index]}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="wrap block consulta" id="consulta">
          <div>
            <p className="eyebrow">Consulta</p>
            <h2>Pedí que te orienten</h2>
            <p className="lead">Contanos qué plan te interesa y te orientamos.</p>
          </div>
          {sent ? (
            <p className="ok">Listo. Recibimos tu consulta.</p>
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
          <p>Desarrollado por ZigZag</p>
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
