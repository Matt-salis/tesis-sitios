import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { asset } from "../lib/asset";
import "./shop.css";

const PRODUCTS = [
  {
    id: "auriculares",
    name: "Auriculares inalámbricos",
    detail: "Bluetooth, estuche de carga y 20 horas de uso.",
    description:
      "Pensados para el día entero: música, llamadas y el viaje de vuelta. Las almohadillas cierran bien sin apretar, y el estuche recarga mientras los guardás.",
    specs: ["Bluetooth 5.3", "20 horas con el estuche", "Micrófono para llamadas", "Plegado plano"],
    price: 45900,
    image: asset("bazar/auriculares.jpg"),
  },
  {
    id: "lampara",
    name: "Lámpara de escritorio",
    detail: "Brazo flexible y luz cálida para leer o estudiar.",
    description:
      "Una luz pareja para el escritorio. El brazo se acomoda sin herramientas y la base se queda quieta aunque el cable tire un poco.",
    specs: ["Luz cálida", "Brazo articulado", "Base estable", "Cable de 1,5 m"],
    price: 27500,
    image: asset("bazar/lampara.jpg"),
  },
  {
    id: "mochila",
    name: "Mochila urbana",
    detail: "Compartimento para notebook de hasta 15 pulgadas.",
    description:
      "Entra la notebook, el cargador y lo del día. El bolsillo de adelante queda a mano y las correas van acolchadas.",
    specs: ["Notebook hasta 15 pulgadas", "Bolsillo frontal", "Correas acolchadas", "Tela resistente"],
    price: 38200,
    image: asset("bazar/mochila.jpg"),
  },
  {
    id: "botella",
    name: "Botella térmica",
    detail: "Acero, 500 ml, mantiene la temperatura varias horas.",
    description:
      "Acero de una pieza, tapa a rosca y boca ancha para lavarla fácil. Mantiene el frío a la mañana y el calor si la cargás con té.",
    specs: ["500 ml", "Acero inoxidable", "Tapa a rosca", "Aislación de doble pared"],
    price: 16400,
    image: asset("bazar/botella.jpg"),
  },
  {
    id: "reloj",
    name: "Reloj de cocina",
    detail: "Timer magnético, pantalla grande y alarma clara.",
    description:
      "Se pega en la heladera y se lee de lejos. La alarma suena fuerte aunque haya ruido en la cocina.",
    specs: ["Imán trasero", "Cuenta hasta 99 minutos", "Alarma audible", "Dial de alto contraste"],
    badge: "2x1",
    price: 12800,
    image: asset("bazar/reloj.jpg"),
  },
];

const CART_KEY = "bazar-cart-v1";

function linePrice(product, qty) {
  if (product.id === "reloj") return Math.ceil(qty / 2) * product.price;
  return product.price * qty;
}

function money(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className="card">
      <button type="button" className="card-open" onClick={() => onOpen(product)}>
        {product.badge && <em className="badge">{product.badge}</em>}
        <img src={product.image} alt="" />
        <h2>{product.name}</h2>
        <p>{product.detail}</p>
      </button>
      <div className="buy">
        <span>{money(product.price)}</span>
        <button type="button" onClick={() => onAdd(product.id)}>
          Agregar
        </button>
      </div>
    </article>
  );
}

function Shop() {
  const [lines, setLines] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("list");
  const [form, setForm] = useState({ name: "", email: "", city: "" });
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    if (!open && !selected) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (selected) {
        setSelected(null);
        return;
      }
      setOpen(false);
      setStep((current) => (current === "done" ? "list" : current));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, selected]);

  const items = useMemo(
    () =>
      lines
        .map((line) => ({ ...line, product: PRODUCTS.find((item) => item.id === line.id) }))
        .filter((line) => line.product),
    [lines],
  );
  const count = items.reduce((sum, line) => sum + line.qty, 0);
  const total = items.reduce((sum, line) => sum + linePrice(line.product, line.qty), 0);
  const shippingLeft = Math.max(0, 50000 - total);

  function add(id) {
    setLines((prev) => {
      const found = prev.find((line) => line.id === id);
      if (!found) return [...prev, { id, qty: 1 }];
      return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line));
    });
    setOpen(true);
    setStep("list");
  }

  function setQty(id, qty) {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((line) => line.id !== id);
      return prev.map((line) => (line.id === id ? { ...line, qty } : line));
    });
  }

  function close() {
    setOpen(false);
    if (step === "done") setStep("list");
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.city.trim()) {
      setError("Completá nombre, un email válido y la ciudad.");
      return;
    }
    setOrder({
      code: `BU-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      total,
      ...form,
    });
    setLines([]);
    setForm({ name: "", email: "", city: "" });
    setError("");
    setStep("done");
  }

  return (
    <>
      <header className="bar">
        <div className="wrap bar-inner">
          <img className="logo" src={asset("bazar/logo.jpg")} alt="Bazar Uno" />
          <button type="button" className="bag" onClick={() => setOpen(true)}>
            Carrito <b>{count}</b>
          </button>
        </div>
      </header>
      <main>
        <section className="hero-banner">
          <img src={asset("bazar/living.jpg")} alt="Living con objetos de uso diario" />
          <div className="hero-copy">
            <p className="eyebrow">Hogar</p>
            <h1>Cosas simples para la casa</h1>
            <a className="solid" href="#productos">
              Ver productos
            </a>
          </div>
        </section>

        <section className="promos wrap">
          <button type="button" className="promo wide" onClick={() => setSelected(PRODUCTS[4])}>
            <img src={asset("bazar/cocina.jpg")} alt="" />
            <span>Promoción</span>
            <strong>2x1 en el reloj de cocina</strong>
          </button>
          <article className="promo">
            <img src={asset("bazar/entrada.jpg")} alt="" />
            <span>Envío</span>
            <strong>Sin cargo desde $50.000</strong>
          </article>
          <button type="button" className="promo" onClick={() => setSelected(PRODUCTS[1])}>
            <img src={asset("bazar/escritorio.jpg")} alt="" />
            <span>Escritorio</span>
            <strong>Lámpara y auriculares</strong>
          </button>
        </section>

        <section className="wrap catalog" id="productos">
          <h2>Para todos los días</h2>
          <div className="grid pair">
            {PRODUCTS.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelected} onAdd={add} />
            ))}
          </div>
        </section>

        <section className="band-banner">
          <img src={asset("bazar/entrada.jpg")} alt="Mochila en la entrada de un departamento" />
          <div>
            <p className="eyebrow">Para salir</p>
            <h2>La mochila que entra en el día</h2>
            <button type="button" className="solid" onClick={() => setSelected(PRODUCTS[2])}>
              Ver la mochila
            </button>
          </div>
        </section>

        <section className="wrap catalog">
          <div className="grid rest">
            {PRODUCTS.slice(2).map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelected} onAdd={add} />
            ))}
          </div>
        </section>

        <section className="band-banner flip">
          <img src={asset("bazar/escritorio.jpg")} alt="Escritorio con lámpara y auriculares" />
          <div>
            <p className="eyebrow">En casa</p>
            <h2>Un escritorio para quedarse</h2>
            <button type="button" className="solid" onClick={() => setSelected(PRODUCTS[0])}>
              Ver auriculares
            </button>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap">Desarrollado por ZigZag</div>
      </footer>

      {selected && (
        <div className="back" onClick={() => setSelected(null)}>
          <article
            className="detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={selected.image} alt={selected.name} />
            <div className="detail-copy">
              <button type="button" className="text" onClick={() => setSelected(null)}>
                Cerrar
              </button>
              <h2 id="product-title">{selected.name}</h2>
              <p className="detail-price">{money(selected.price)}</p>
              <p>{selected.description}</p>
              <ul className="specs">
                {selected.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <button
                type="button"
                className="solid"
                onClick={() => {
                  add(selected.id);
                  setSelected(null);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        </div>
      )}

      {open && (
        <div className="back" onClick={() => close()}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h2 id="cart-title">{step === "done" ? "Pedido anotado" : "Carrito"}</h2>
              <button type="button" onClick={() => close()}>
                Cerrar
              </button>
            </header>
            {step === "list" && (
              <div className="body">
                {items.length === 0 ? (
                  <p>Todavía no sumaste nada.</p>
                ) : (
                  <>
                    <ul>
                      {items.map((line) => (
                        <li key={line.id}>
                          <div>
                            <strong>
                              {line.product.name}
                              {line.product.badge ? ` · ${line.product.badge}` : ""}
                            </strong>
                            <span>{money(linePrice(line.product, line.qty))}</span>
                          </div>
                          <div className="qty">
                            <button type="button" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Restar">
                              −
                            </button>
                            <span>{line.qty}</span>
                            <button type="button" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Sumar">
                              +
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="total">
                      Total <strong>{money(total)}</strong>
                    </p>
                    <p className="ship">
                      {shippingLeft === 0
                        ? "Envío sin cargo"
                        : `Te faltan ${money(shippingLeft)} para el envío sin cargo`}
                    </p>
                    <button type="button" className="solid" onClick={() => setStep("form")}>
                      Cerrar pedido
                    </button>
                  </>
                )}
              </div>
            )}
            {step === "form" && (
              <form className="body" onSubmit={submit}>
                <label>
                  Nombre
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>
                <label>
                  Ciudad
                  <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
                </label>
                {error && <p className="err">{error}</p>}
                <button type="button" onClick={() => setStep("list")}>
                  Volver
                </button>
                <button className="solid" type="submit">
                  Confirmar · {money(total)}
                </button>
              </form>
            )}
            {step === "done" && order && (
              <div className="body">
                <p className="code">{order.code}</p>
                <p>{order.name}, tu pedido quedó anotado para {order.city}.</p>
                <p>
                  Total <strong>{money(order.total)}</strong>
                </p>
                <button type="button" className="solid" onClick={() => close()}>
                  Seguir mirando
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Shop />
  </StrictMode>,
);
