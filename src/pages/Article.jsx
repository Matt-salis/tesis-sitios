import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { formatDate, paragraphs } from "../lib/format";
import { useCms } from "../state/store";

export function Article() {
  const { postId } = useParams();
  const cms = useCms();
  const post = cms.posts.find((item) => item.id === postId);
  const section = cms.sections.find((item) => item.id === post?.sectionId);

  useEffect(() => {
    document.title = post ? `${post.title} — ZigZag` : "Publicación — ZigZag";
  }, [post]);

  if (!post) {
    return (
      <div className="wrap article">
        <p className="kicker">Estudio</p>
        <h1>Esa publicación no está</h1>
        <Link className="btn" to="/">
          Volver al estudio
        </Link>
      </div>
    );
  }

  return (
    <article className="wrap article">
      <Link className="back" to={section ? `/?seccion=${section.id}` : "/"}>
        ← {section?.name || "Estudio"}
      </Link>
      <p className="kicker">{section?.name}</p>
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.excerpt && <p className="lede">{post.excerpt}</p>}
      {post.image && <img src={post.image} alt="" />}
      {paragraphs(post.body).map((part, index) => (
        <p key={`${post.id}-${index}`}>{part}</p>
      ))}
    </article>
  );
}
