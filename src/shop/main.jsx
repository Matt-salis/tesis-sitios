import { StrictMode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { asset } from "../lib/asset";
import "./shop.css";

const CATEGORIES = [
  { id: "hogar", name: "Hogar", text: "Lo que se queda en la casa." },
  { id: "cocina", name: "Cocina", text: "Mesa, timer y lo de todos los días." },
  { id: "trabajo", name: "Trabajo", text: "Escritorio y concentración." },
  { id: "viaje", name: "Viaje", text: "Lo que sale con vos." },
];

const PRODUCTS = [
  {
    id: "auriculares",
    category: "trabajo",
    name: "Auriculares inalámbricos",
    detail: "Bluetooth, estuche de carga y 20 horas de uso.",
    description:
      "Pensados para el día entero: música, llamadas y el viaje de vuelta. Las almohadillas cierran bien sin apretar, y el estuche recarga mientras los guardás.",
    specs: ["Bluetooth 5.3", "20 horas con el estuche", "Micrófono para llamadas", "Plegado plano"],
    price: 45900,
    images: [asset("bazar/auriculares.jpg"), asset("bazar/escritorio.jpg")],
  },
  {
    id: "lampara",
    category: "trabajo",
    name: "Lámpara de escritorio",
    detail: "Brazo flexible y luz cálida para leer o estudiar.",
    description:
      "Una luz pareja para el escritorio. El brazo se acomoda sin herramientas y la base se queda quieta aunque el cable tire un poco.",
    specs: ["Luz cálida", "Brazo articulado", "Base estable", "Cable de 1,5 m"],
    price: 27500,
    images: [asset("bazar/lampara.jpg"), asset("bazar/escritorio.jpg")],
  },
  {
    id: "mochila",
    category: "viaje",
    name: "Mochila urbana",
    detail: "Compartimento para notebook de hasta 15 pulgadas.",
    description:
      "Entra la notebook, el cargador y lo del día. El bolsillo de adelante queda a mano y las correas van acolchadas.",
    specs: ["Notebook hasta 15 pulgadas", "Bolsillo frontal", "Correas acolchadas", "Tela resistente"],
    price: 38200,
    images: [asset("bazar/mochila.jpg"), asset("bazar/entrada.jpg")],
  },
  {
    id: "botella",
    category: "hogar",
    name: "Botella térmica",
    detail: "Acero, 500 ml, mantiene la temperatura varias horas.",
    description:
      "Acero de una pieza, tapa a rosca y boca ancha para lavarla fácil. Mantiene el frío a la mañana y el calor si la cargás con té.",
    specs: ["500 ml", "Acero inoxidable", "Tapa a rosca", "Aislación de doble pared"],
    price: 16400,
    images: [asset("bazar/botella.jpg"), asset("bazar/living.jpg")],
  },
  {
    id: "reloj",
    category: "cocina",
    name: "Reloj de cocina",
    detail: "Timer magnético, pantalla grande y alarma clara.",
    description:
      "Se pega en la heladera y se lee de lejos. La alarma suena fuerte aunque haya ruido en la cocina.",
    specs: ["Imán trasero", "Cuenta hasta 99 minutos", "Alarma audible", "Dial de alto contraste"],
    badge: "2x1",
    price: 12800,
    images: [asset("bazar/reloj.jpg"), asset("bazar/cocina.jpg")],
  },
];

const SLIDES = [
  {
    image: asset("bazar/living.jpg"),
    kicker: "Hogar",
    title: "Cosas simples para la casa",
    to: "/categoria/hogar",
  },
  {
    image: asset("bazar/cocina.jpg"),
    kicker: "Cocina",
    title: "La mesa, lista",
    to: "/categoria/cocina",
  },
  {
    image: asset("bazar/escritorio.jpg"),
    kicker: "Trabajo",
    title: "Luz para quedarse",
    to: "/categoria/trabajo",
  },
];

const CART_KEY = "bazar-cart-v1";
const ShopContext = createContext(null);

function money(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function linePrice(product, qty) {
  if (product.id === "reloj") return Math.ceil(qty / 2) * product.price;
  return product.price * qty;
}

function cardDigits(value) {
  return value.replace(/\D/g, "");
}

function luhn(value) {
  const digits = cardDigits(value);
  if (digits.length < 15 || digits.length > 16) return false;
  let sum = 0;
  let alt = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (alt) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function formatCard(value) {
  return cardDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function expiryOk(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return new Date(year, month, 1) > new Date();
}

function categoryOf(id) {
  return CATEGORIES.find((item) => item.id === id);
}

function useShop() {
  return useContext(ShopContext);
}

function ProductCard({ product }) {
  const shop = useShop();
  return (
    <article className="card">
      <button type="button" className="card-open" onClick={() => shop.setPreview(product)}>
        {product.badge && <em className="badge">{product.badge}</em>}
        <img src={product.images[0]} alt="" />
        <h2>{product.name}</h2>
        <p>{product.detail}</p>
      </button>
      <div className="buy">
        <span>{money(product.price)}</span>
        <button type="button" onClick={() => shop.add(product.id)}>
          Agregar
        </button>
      </div>
    </article>
  );
}

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((item, itemIndex) => (
        <article key={item.title} className={itemIndex === index ? "slide on" : "slide"}>
          <img src={item.image} alt="" />
        </article>
      ))}
      <div className="hero-copy">
        <p className="eyebrow">{slide.kicker}</p>
        <h1>{slide.title}</h1>
        <Link className="solid" to={slide.to}>
          Ver {slide.kicker.toLowerCase()}
        </Link>
      </div>
      <div className="carousel-ui">
        <button type="button" onClick={() => setIndex((current) => (current + SLIDES.length - 1) % SLIDES.length)}>
          Anterior
        </button>
        <div className="dots">
          {SLIDES.map((item, itemIndex) => (
            <button
              key={item.title}
              type="button"
              className={itemIndex === index ? "on" : ""}
              aria-label={item.title}
              onClick={() => setIndex(itemIndex)}
            />
          ))}
        </div>
        <button type="button" onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}>
          Siguiente
        </button>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Carousel />
      <section className="wrap categories">
        {CATEGORIES.map((category) => (
          <Link key={category.id} to={`/categoria/${category.id}`} className="category">
            <strong>{category.name}</strong>
            <span>{category.text}</span>
          </Link>
        ))}
      </section>
      <section className="wrap catalog">
        <h2>Para todos los días</h2>
        <div className="grid rest">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryPage() {
  const { id } = useParams();
  const category = categoryOf(id);
  const products = PRODUCTS.filter((product) => product.category === id);
  if (!category) {
    return (
      <section className="wrap catalog">
        <h2>Esa categoría no está</h2>
        <Link className="solid" to="/">
          Volver al inicio
        </Link>
      </section>
    );
  }
  return (
    <section className="wrap catalog page-in">
      <p className="eyebrow">Categoría</p>
      <h2>{category.name}</h2>
      <p className="lead">{category.text}</p>
      <div className="grid rest">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductPage() {
  const { id } = useParams();
  const shop = useShop();
  const product = PRODUCTS.find((item) => item.id === id);
  const [photo, setPhoto] = useState(0);
  if (!product) {
    return (
      <section className="wrap catalog">
        <h2>Ese producto no está</h2>
        <Link className="solid" to="/">
          Volver al inicio
        </Link>
      </section>
    );
  }
  const category = categoryOf(product.category);
  return (
    <article className="wrap product-page page-in">
      <Link className="crumb" to={category ? `/categoria/${category.id}` : "/"}>
        ← {category?.name || "Inicio"}
      </Link>
      <div className="product-layout">
        <div>
          <img src={product.images[photo]} alt={product.name} />
          {product.images.length > 1 && (
            <div className="thumbs">
              {product.images.map((image, index) => (
                <button key={image} type="button" className={index === photo ? "on" : ""} onClick={() => setPhoto(index)}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-copy">
          <p className="eyebrow">{category?.name}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{money(product.price)}{product.badge ? ` · ${product.badge}` : ""}</p>
          <p>{product.description}</p>
          <ul className="specs">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <button type="button" className="solid" onClick={() => shop.add(product.id)}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}

function Preview() {
  const shop = useShop();
  const product = shop.preview;
  if (!product) return null;
  return (
    <div className="back" onClick={() => shop.setPreview(null)}>
      <article className="detail" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <img src={product.images[0]} alt={product.name} />
        <div className="detail-copy">
          <button type="button" className="text" onClick={() => shop.setPreview(null)}>
            Cerrar
          </button>
          <h2>{product.name}</h2>
          <p className="detail-price">{money(product.price)}</p>
          <p>{product.detail}</p>
          <div className="actions-row">
            <Link className="ghost" to={`/producto/${product.id}`} onClick={() => shop.setPreview(null)}>
              Ver ficha
            </Link>
            <button
              type="button"
              className="solid"
              onClick={() => {
                shop.add(product.id);
                shop.setPreview(null);
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

function MercadoPago() {
  const shop = useShop();
  const [method, setMethod] = useState("credit");
  const [installments, setInstallments] = useState(1);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const quota = method === "credit" ? installments : 1;
  const each = Math.ceil(shop.total / quota);

  function pay(event) {
    event.preventDefault();
    if (paying) return;
    const digits = cardDigits(card.number);
    if (method !== "wallet") {
      if (!luhn(digits)) {
        setPayError("Revisá el número de la tarjeta.");
        return;
      }
      if (!card.name.trim()) {
        setPayError("Completá el nombre como figura en la tarjeta.");
        return;
      }
      if (!expiryOk(card.expiry)) {
        setPayError("Revisá el vencimiento.");
        return;
      }
      if (!/^\d{3,4}$/.test(card.cvv)) {
        setPayError("Revisá el código de seguridad.");
        return;
      }
    }
    setPayError("");
    setPaying(true);
    window.setTimeout(() => {
      const rejected = method !== "wallet" && (digits.endsWith("0000") || card.cvv === "000");
      if (rejected) {
        setPaying(false);
        setPayError("Mercado Pago rechazó el pago. Probá con otro medio.");
        return;
      }
      shop.finishPayment({
        method: method === "wallet" ? "Dinero en Mercado Pago" : method === "debit" ? "Débito" : "Crédito",
        last4: method === "wallet" ? "" : digits.slice(-4),
        installments: quota,
        paymentId: String(Math.floor(1000000000 + Math.random() * 9000000000)),
      });
    }, 1400);
  }

  return (
    <form className="body mp" onSubmit={pay}>
      <p className="mp-brand">Mercado Pago</p>
      <p className="mp-amount">
        {money(shop.total)}
        {quota > 1 && <span> en {quota} cuotas de {money(each)}</span>}
      </p>
      <div className="mp-methods" role="radiogroup" aria-label="Medio de pago">
        {[
          ["credit", "Tarjeta de crédito"],
          ["debit", "Tarjeta de débito"],
          ["wallet", "Dinero en Mercado Pago"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={method === id ? "on" : ""}
            onClick={() => setMethod(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {method === "wallet" ? (
        <p className="ship">Se descuenta del saldo de la cuenta.</p>
      ) : (
        <>
          <label>
            Número de tarjeta
            <input
              inputMode="numeric"
              autoComplete="off"
              placeholder="4509 9535 6623 3704"
              value={card.number}
              onChange={(event) => setCard({ ...card, number: formatCard(event.target.value) })}
            />
          </label>
          <label>
            Nombre en la tarjeta
            <input
              autoComplete="off"
              value={card.name}
              onChange={(event) => setCard({ ...card, name: event.target.value })}
            />
          </label>
          <div className="mp-row">
            <label>
              Vencimiento
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="MM/AA"
                value={card.expiry}
                onChange={(event) => setCard({ ...card, expiry: formatExpiry(event.target.value) })}
              />
            </label>
            <label>
              Código
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="123"
                value={card.cvv}
                onChange={(event) => setCard({ ...card, cvv: event.target.value.replace(/\D/g, "").slice(0, 4) })}
              />
            </label>
          </div>
          {method === "credit" && (
            <label>
              Cuotas
              <select value={installments} onChange={(event) => setInstallments(Number(event.target.value))}>
                <option value={1}>1 pago de {money(shop.total)}</option>
                <option value={3}>3 cuotas de {money(Math.ceil(shop.total / 3))}</option>
                <option value={6}>6 cuotas de {money(Math.ceil(shop.total / 6))}</option>
              </select>
            </label>
          )}
          <p className="quiet">El código 000 simula un rechazo de Mercado Pago.</p>
        </>
      )}
      {payError && <p className="err">{payError}</p>}
      <div className="actions-row">
        <button type="button" className="ghost" onClick={() => shop.setStep("form")} disabled={paying}>
          Volver a los datos
        </button>
        <button className="mp-pay" type="submit" disabled={paying}>
          {paying ? "Procesando…" : `Pagar ${money(quota > 1 ? each : shop.total)}`}
        </button>
      </div>
    </form>
  );
}

function Cart() {
  const shop = useShop();
  if (!shop.open) return null;
  return (
    <div className="back" onClick={shop.close}>
      <aside className={shop.step === "pay" ? "drawer pay" : "drawer"} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header>
          <h2>{shop.step === "done" ? "Pago aprobado" : shop.step === "pay" ? "Pago" : "Carrito"}</h2>
          <button type="button" onClick={shop.close}>
            Cerrar
          </button>
        </header>
        {shop.step === "list" && (
          <div className="body">
            {shop.items.length === 0 ? (
              <p>Todavía no sumaste nada.</p>
            ) : (
              <>
                <ul>
                  {shop.items.map((line) => (
                    <li key={line.id}>
                      <div>
                        <strong>
                          {line.product.name}
                          {line.product.badge ? ` · ${line.product.badge}` : ""}
                        </strong>
                        <span>{money(linePrice(line.product, line.qty))}</span>
                      </div>
                      <div className="qty">
                        <button type="button" onClick={() => shop.setQty(line.id, line.qty - 1)} aria-label="Restar">
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button type="button" onClick={() => shop.setQty(line.id, line.qty + 1)} aria-label="Sumar">
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="total">
                  Total <strong>{money(shop.total)}</strong>
                </p>
                <p className="ship">
                  {shop.shippingLeft === 0
                    ? "Envío sin cargo"
                    : `Te faltan ${money(shop.shippingLeft)} para el envío sin cargo`}
                </p>
                <button type="button" className="solid" onClick={() => shop.setStep("form")}>
                  Cerrar pedido
                </button>
              </>
            )}
          </div>
        )}
        {shop.step === "form" && (
          <form className="body" onSubmit={shop.submit}>
            <label>
              Nombre
              <input value={shop.form.name} onChange={(event) => shop.setForm({ ...shop.form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input
                type="email"
                value={shop.form.email}
                onChange={(event) => shop.setForm({ ...shop.form, email: event.target.value })}
              />
            </label>
            <label>
              Ciudad
              <input value={shop.form.city} onChange={(event) => shop.setForm({ ...shop.form, city: event.target.value })} />
            </label>
            <label>
              Dirección
              <input
                value={shop.form.address}
                onChange={(event) => shop.setForm({ ...shop.form, address: event.target.value })}
              />
            </label>
            {shop.error && <p className="err">{shop.error}</p>}
            <div className="actions-row">
              <button type="button" className="ghost" onClick={() => shop.setStep("list")}>
                Volver al carrito
              </button>
              <button className="solid" type="submit">
                Continuar al pago
              </button>
            </div>
          </form>
        )}
        {shop.step === "pay" && <MercadoPago />}
        {shop.step === "done" && shop.order && (
          <div className="body">
            <p className="mp-brand">Mercado Pago</p>
            <p className="code">{shop.order.code}</p>
            <p>
              {shop.order.name}, el cobro quedó acreditado. El envío va a {shop.order.address}, {shop.order.city}.
            </p>
            <p>
              {shop.order.payment.method}
              {shop.order.payment.last4 ? ` · **** ${shop.order.payment.last4}` : ""}
              {shop.order.payment.installments > 1 ? ` · ${shop.order.payment.installments} cuotas` : ""}
            </p>
            <p>
              Total <strong>{money(shop.order.total)}</strong>
            </p>
            <p className="quiet">Operación {shop.order.payment.paymentId}</p>
            <button type="button" className="solid" onClick={shop.close}>
              Seguir mirando
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Frame() {
  const shop = useShop();
  return (
    <>
      <header className="bar">
        <div className="wrap bar-inner">
          <Link to="/" className="logo-link">
            <img className="logo" src={asset("bazar/logo.png")} alt="Bazar Uno" />
          </Link>
          <nav className="cats" aria-label="Categorías">
            {CATEGORIES.map((category) => (
              <NavLink key={category.id} to={`/categoria/${category.id}`}>
                {category.name}
              </NavLink>
            ))}
          </nav>
          <button type="button" className="bag" onClick={() => shop.setOpen(true)}>
            Carrito <b>{shop.count}</b>
          </button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:id" element={<CategoryPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route
            path="*"
            element={
              <section className="wrap catalog">
                <h2>Esa página no está</h2>
                <Link className="solid" to="/">
                  Volver al inicio
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <div className="wrap">Desarrollado por ZigZag</div>
      </footer>
      <Preview />
      <Cart />
    </>
  );
}

function ShopState({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("list");
  const [form, setForm] = useState({ name: "", email: "", city: "", address: "" });
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    if (!open && !preview) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (preview) {
        setPreview(null);
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
  }, [open, preview]);

  const items = useMemo(
    () =>
      lines
        .map((line) => ({ ...line, product: PRODUCTS.find((item) => item.id === line.id) }))
        .filter((line) => line.product),
    [lines],
  );
  const count = items.reduce((sum, line) => sum + line.qty, 0);
  const total = items.reduce((sum, line) => sum + linePrice(line.product, line.qty), 0);

  function add(id) {
    setLines((prev) => {
      const found = prev.find((line) => line.id === id);
      if (!found) return [...prev, { id, qty: 1 }];
      return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line));
    });
    setOpen(true);
    setStep("list");
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.city.trim() || !form.address.trim()) {
      setError("Completá nombre, email, ciudad y dirección.");
      return;
    }
    setError("");
    setStep("pay");
  }

  function finishPayment(payment) {
    setOrder({
      code: `BU-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      total,
      ...form,
      payment,
    });
    setLines([]);
    setForm({ name: "", email: "", city: "", address: "" });
    setError("");
    setStep("done");
  }

  const value = {
    items,
    count,
    total,
    shippingLeft: Math.max(0, 50000 - total),
    open,
    setOpen,
    step,
    setStep,
    form,
    setForm,
    error,
    order,
    preview,
    setPreview,
    add,
    setQty(id, qty) {
      setLines((prev) => {
        if (qty <= 0) return prev.filter((line) => line.id !== id);
        return prev.map((line) => (line.id === id ? { ...line, qty } : line));
      });
    },
    close() {
      setOpen(false);
      if (step === "done") setStep("list");
    },
    submit,
    finishPayment,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <ShopState>
        <Frame />
      </ShopState>
    </HashRouter>
  </StrictMode>,
);
