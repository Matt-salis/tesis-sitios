import { Link } from "react-router-dom";
import { asset } from "../lib/asset";
import { Accent } from "./Accent";

export function WorkPreview({ post, section, onClose }) {
  if (!post) return null;
  return (
    <div className="drawer-back" onClick={onClose}>
      <article
        className="work-pop"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={post.image || asset("isotipo.png")} alt="" />
        <div>
          <button type="button" className="textish" onClick={onClose}>
            Cerrar
          </button>
          <p className="kicker">{section?.name || "Portfolio"}</p>
          <h2>
            <Accent text={post.title} />
          </h2>
          <p>{post.excerpt}</p>
          <Link className="btn" to={`/proyecto/${post.id}`} onClick={onClose}>
            Ver proyecto
          </Link>
        </div>
      </article>
    </div>
  );
}
