import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SEED } from "../data/seed";

const CMS_KEY = "zigzag-cms-v1";
const CmsContext = createContext(null);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function slug(value) {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "seccion";
}

function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

export function AppState({ children }) {
  const [cms, setCms] = useState(() => {
    const saved = readJson(CMS_KEY, null);
    if (saved?.sections?.length && Array.isArray(saved.posts)) return saved;
    return structuredClone(SEED);
  });
  const [storageError, setStorageError] = useState("");

  const commitCms = useCallback((next) => {
    try {
      localStorage.setItem(CMS_KEY, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError(
        "No hay espacio en el navegador. Usá una imagen más chica o borrá una publicación.",
      );
    }
    setCms(next);
  }, []);

  const cmsApi = useMemo(
    () => ({
      sections: cms.sections,
      posts: cms.posts,
      storageError,
      addSection(name, blurb) {
        const clean = name.trim();
        if (!clean) return false;
        let id = slug(clean);
        if (cms.sections.some((section) => section.id === id)) {
          id = `${id}-${Math.random().toString(36).slice(2, 5)}`;
        }
        commitCms({
          ...cms,
          sections: [...cms.sections, { id, name: clean, blurb: blurb.trim() }],
        });
        return true;
      },
      updateSection(id, patch) {
        commitCms({
          ...cms,
          sections: cms.sections.map((section) =>
            section.id === id ? { ...section, ...patch } : section,
          ),
        });
      },
      deleteSection(id) {
        if (cms.posts.some((post) => post.sectionId === id)) return false;
        commitCms({
          ...cms,
          sections: cms.sections.filter((section) => section.id !== id),
        });
        return true;
      },
      savePost(draft) {
        const post = {
          ...draft,
          id: draft.id || uid(),
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          body: draft.body.trim(),
        };
        const exists = cms.posts.some((item) => item.id === post.id);
        const posts = exists
          ? cms.posts.map((item) => (item.id === post.id ? post : item))
          : [post, ...cms.posts];
        commitCms({ ...cms, posts });
        return post.id;
      },
      deletePost(id) {
        commitCms({ ...cms, posts: cms.posts.filter((post) => post.id !== id) });
      },
      reset() {
        commitCms(structuredClone(SEED));
      },
    }),
    [cms, storageError, commitCms],
  );

  return <CmsContext.Provider value={cmsApi}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
