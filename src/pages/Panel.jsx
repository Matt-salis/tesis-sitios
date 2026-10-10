import { useState } from "react";
import { fileToCover } from "../lib/image";
import { formatDate, plainTitle } from "../lib/format";
import { useCms } from "../state/store";

const AUTH_KEY = "zigzag-admin";

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function blank(sectionId) {
  return {
    id: "",
    sectionId: sectionId || "",
    title: "",
    excerpt: "",
    body: "",
    image: "",
    date: today(),
  };
}

export function Panel() {
  const cms = useCms();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "ok");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [draft, setDraft] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [sectionBlurb, setSectionBlurb] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  function login(event) {
    event.preventDefault();
    if (password.trim().toLowerCase() === "zigzag") {
      sessionStorage.setItem(AUTH_KEY, "ok");
      setAuthed(true);
      setAuthError("");
      return;
    }
    setAuthError("Clave incorrecta.");
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setDraft(null);
  }

  function createSection(event) {
    event.preventDefault();
    const created = cms.addSection(sectionName, sectionBlurb);
    if (!created) {
      setMessage("Poné un nombre para la sección.");
      return;
    }
    setSectionName("");
    setSectionBlurb("");
    setMessage("Sección creada. Ya podés cargarle publicaciones.");
  }

  function removeSection(section) {
    const removed = cms.deleteSection(section.id);
    setMessage(
      removed
        ? "Sección borrada."
        : "Esa sección tiene publicaciones. Borralas o pasalas a otra antes.",
    );
  }

  function startNew(sectionId) {
    setFormError("");
    setDraft(blank(sectionId || cms.sections[0]?.id));
  }

  function startEdit(post) {
    setFormError("");
    setDraft({ ...post });
  }

  function removePost(post) {
    const sure = window.confirm(`¿Borrar “${plainTitle(post.title)}”?`);
    if (!sure) return;
    cms.deletePost(post.id);
    setMessage("Publicación borrada.");
  }

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !draft) return;
    setBusy(true);
    setFormError("");
    try {
      const image = await fileToCover(file);
      setDraft((current) => ({ ...current, image }));
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  }

  function savePost(event) {
    event.preventDefault();
    if (!draft.title.trim()) {
      setFormError("Poné un título.");
      return;
    }
    if (!draft.body.trim()) {
      setFormError("Escribí el texto de la publicación.");
      return;
    }
    if (!draft.sectionId) {
      setFormError("Elegí una sección.");
      return;
    }
    cms.savePost(draft);
    setDraft(null);
    setFormError("");
    setMessage("Publicación guardada. Ya se ve en el estudio.");
  }

  function resetDemo() {
    const sure = window.confirm("Esto borra lo que cargaste y vuelve a las publicaciones de ejemplo.");
    if (!sure) return;
    cms.reset();
    setDraft(null);
    setMessage("Volviste al contenido de ejemplo.");
  }

  if (!authed) {
    return (
      <div className="wrap login">
        <form onSubmit={login}>
          <p className="kicker">Panel</p>
          <h1>Cargar el estudio</h1>
          <p>Desde acá se administran las secciones y todas sus publicaciones.</p>
          <label>
            Clave
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {authError && <p className="form-error">{authError}</p>}
          <button type="submit" className="btn">
            Entrar
          </button>
          <p className="quiet">Clave de demostración: zigzag</p>
        </form>
      </div>
    );
  }

  return (
    <div className="wrap panel">
      <header className="panel-head">
        <div>
          <p className="kicker">Panel del estudio</p>
          <h1>Secciones y publicaciones</h1>
          <p className="lede">
            Cada nota queda en una sección, con imagen, y se publica en el estudio. Se guarda en
            este navegador.
          </p>
        </div>
        <div className="row-actions">
          <button type="button" className="btn ghost" onClick={resetDemo}>
            Restaurar ejemplo
          </button>
          <button type="button" className="btn ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      {message && <p className="notice">{message}</p>}
      {cms.storageError && <p className="form-error">{cms.storageError}</p>}

      {draft ? (
        <form className="editor" onSubmit={savePost}>
          <div className="editor-head">
            <h2>{draft.id ? "Editar publicación" : "Nueva publicación"}</h2>
            <button type="button" className="btn ghost" onClick={() => setDraft(null)}>
              Volver al listado
            </button>
          </div>
          <div className="editor-grid">
            <div className="stack">
              <label>
                Título
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </label>
              <p className="quiet">Para destacar una palabra en Avallon, encerrala entre asteriscos: *desorden*.</p>
              <label>
                Sección
                <select
                  value={draft.sectionId}
                  onChange={(event) => setDraft({ ...draft, sectionId: event.target.value })}
                >
                  {cms.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name || "Sin nombre"}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fecha
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                />
              </label>
              <label>
                Bajada
                <textarea
                  rows={3}
                  value={draft.excerpt}
                  onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })}
                />
              </label>
              <label>
                Texto
                <textarea
                  rows={10}
                  value={draft.body}
                  onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                  placeholder="Dejá una línea en blanco para separar párrafos."
                />
              </label>
            </div>
            <div className="stack">
              <label className="drop">
                {draft.image ? <img src={draft.image} alt="Vista previa" /> : <span>Subir imagen</span>}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
              </label>
              {draft.image && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setDraft({ ...draft, image: "" })}
                >
                  Quitar imagen
                </button>
              )}
              {busy && <p className="quiet">Procesando imagen…</p>}
              {formError && <p className="form-error">{formError}</p>}
              <button type="submit" className="btn" disabled={busy || cms.sections.length === 0}>
                Guardar publicación
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="panel-grid">
          <aside className="section-box">
            <h2>Secciones</h2>
            <form className="stack" onSubmit={createSection}>
              <label>
                Nueva sección
                <input
                  value={sectionName}
                  onChange={(event) => setSectionName(event.target.value)}
                  placeholder="Por ejemplo, Campaña"
                />
              </label>
              <label>
                Descripción
                <input
                  value={sectionBlurb}
                  onChange={(event) => setSectionBlurb(event.target.value)}
                  placeholder="Una línea para el estudio"
                />
              </label>
              <button type="submit" className="btn">
                Crear sección
              </button>
            </form>
            <ul className="section-list">
              {cms.sections.map((section) => {
                const count = cms.posts.filter((post) => post.sectionId === section.id).length;
                return (
                  <li key={section.id}>
                    <label>
                      Nombre
                      <input
                        value={section.name}
                        onChange={(event) =>
                          cms.updateSection(section.id, { name: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Descripción
                      <input
                        value={section.blurb}
                        onChange={(event) =>
                          cms.updateSection(section.id, { blurb: event.target.value })
                        }
                      />
                    </label>
                    <div className="row-actions">
                      <span className="quiet">
                        {count} {count === 1 ? "publicación" : "publicaciones"}
                      </span>
                      <button type="button" className="textish" onClick={() => removeSection(section)}>
                        Borrar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="post-admin">
            <div className="editor-head">
              <h2>Publicaciones</h2>
              <button
                type="button"
                className="btn"
                onClick={() => startNew(cms.sections[0]?.id)}
                disabled={cms.sections.length === 0}
              >
                Nueva publicación
              </button>
            </div>
            {cms.sections.map((section) => {
              const posts = cms.posts.filter((post) => post.sectionId === section.id);
              return (
                <section key={section.id} className="group">
                  <header>
                    <h3>{section.name || "Sin nombre"}</h3>
                    <button type="button" className="textish" onClick={() => startNew(section.id)}>
                      Cargar en esta sección
                    </button>
                  </header>
                  {posts.length === 0 ? (
                    <p className="quiet">Sin publicaciones.</p>
                  ) : (
                    <ul>
                      {posts.map((post) => (
                        <li key={post.id}>
                          {post.image ? <img src={post.image} alt="" /> : <span className="ph" />}
                          <div>
                            <strong>{plainTitle(post.title)}</strong>
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <button type="button" className="textish" onClick={() => startEdit(post)}>
                            Editar
                          </button>
                          <button type="button" className="textish" onClick={() => removePost(post)}>
                            Borrar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
