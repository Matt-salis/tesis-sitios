import { Link, useSearchParams } from "react-router-dom";
import { asset } from "../lib/asset";
import { formatDate } from "../lib/format";
import { useCms } from "../state/store";

export function Studio() {
  const cms = useCms();
  const [params, setParams] = useSearchParams();
  const requested = params.get("seccion") || "todas";
  const known = cms.sections.some((section) => section.id === requested);
  const active = requested !== "todas" && known ? requested : "todas";
  const section = cms.sections.find((item) => item.id === active);
  const posts = cms.posts
    .filter((post) => active === "todas" || post.sectionId === active)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.title.localeCompare(a.title));

  return (
    <div className="wrap studio">
      <header className="studio-head">
        <div>
          <p className="kicker">Estudio</p>
          <h1>
            Publicaciones por <em>sección</em>
          </h1>
          <p className="lede">
            {section?.blurb ||
              "Notas de la marca, con foto y texto. Todo lo que ves se puede cargar, editar o borrar desde el panel."}
          </p>
        </div>
        <Link className="btn" to="/panel">
          Cargar publicaciones
        </Link>
      </header>

      <div className="chips" role="tablist" aria-label="Secciones">
        <button
          type="button"
          className={active === "todas" ? "chip on" : "chip"}
          onClick={() => setParams({})}
        >
          Todas
        </button>
        {cms.sections.map((item) => (
          <button
            key={item.id}
            type="button"
            className={active === item.id ? "chip on" : "chip"}
            onClick={() => setParams({ seccion: item.id })}
          >
            {item.name || "Sin nombre"}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="empty-block">
          <p>Esta sección todavía no tiene publicaciones.</p>
          <Link className="btn" to="/panel">
            Cargar la primera
          </Link>
        </div>
      ) : (
        <div className="posts">
          {posts.map((post) => {
            const owner = cms.sections.find((item) => item.id === post.sectionId);
            return (
              <article key={post.id} className="post-card">
                <Link to={`/nota/${post.id}`}>
                  <img src={post.image || asset("isotipo.png")} alt="" />
                  <div>
                    <p className="kicker">{owner?.name || "Sin sección"}</p>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
