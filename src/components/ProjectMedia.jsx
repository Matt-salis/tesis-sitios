import { useEffect, useState } from "react";
import { loadBlob } from "../lib/media";
import { FbxView } from "./FbxView";

export function ProjectMedia({ file }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let alive = true;
    let current = "";
    loadBlob(file.id)
      .then((blob) => {
        if (!blob) return;
        current = URL.createObjectURL(blob);
        if (alive) setUrl(current);
        else URL.revokeObjectURL(current);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (current) URL.revokeObjectURL(current);
    };
  }, [file.id]);

  if (!url) return <p className="quiet">Cargando {file.name}…</p>;
  if (file.kind === "video") return <video className="project-video" src={url} controls playsInline />;
  if (file.kind === "gif") return <img className="project-gif" src={url} alt={file.name} />;
  if (file.kind === "fbx") return <FbxView url={url} />;
  return null;
}
