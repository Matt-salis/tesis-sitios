import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Accent } from "../components/Accent";
import { ProjectMedia } from "../components/ProjectMedia";
import { formatDate, paragraphs, plainTitle } from "../lib/format";
import { useCms } from "../state/store";

export function Article() {
  const { postId } = useParams();
  const cms = useCms();
  const post = cms.posts.find((item) => item.id === postId);
  const section = cms.sections.find((item) => item.id === post?.sectionId);

  useEffect(() => {
    document.title = post ? `${plainTitle(post.title)} — ZigZag` : "Publicación — ZigZag";
  }, [post]);

  if (!post) {
    return (
      <div className="wrap article">
        <p className="kicker">Estudio</p>
        <h1>Esa publicación no está</h1>
        <Link className="btn" to="/portfolio">
          Volver al portfolio
        </Link>
      </div>
    );
  }

  return (
    <article className="wrap article">
      <Link className="back" to={section ? `/portfolio?seccion=${section.id}` : "/portfolio"}>
        ← {section?.name || "Portfolio"}
      </Link>
      <p className="kicker">{section?.name}</p>
      <h1>
        <Accent text={post.title} />
      </h1>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.excerpt && <p className="lede">{post.excerpt}</p>}
      {post.image && (
        <figure className="shot">
          <span className="sq-gold" aria-hidden="true" />
          <span className="sq-red" aria-hidden="true" />
          <img src={post.image} alt="" />
        </figure>
      )}
      {(post.files || []).length > 0 && (
        <div className="project-files">
          {post.files.map((file) => (
            <ProjectMedia key={file.id} file={file} />
          ))}
        </div>
      )}
      {paragraphs(post.body).map((part, index) => (
        <p key={`${post.id}-${index}`}>{part}</p>
      ))}
    </article>
  );
}
