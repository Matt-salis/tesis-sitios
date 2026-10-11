import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Shell } from "../components/Shell";
import { Article } from "../pages/Article";
import { Home } from "../pages/Home";
import { Missing } from "../pages/Missing";
import { Panel } from "../pages/Panel";
import { Studio } from "../pages/Studio";
import { AppState } from "../state/store";
import "../index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AppState>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Studio />} />
            <Route path="/proyecto/:postId" element={<Article />} />
            <Route path="/nota/:postId" element={<Article />} />
            <Route path="/panel" element={<Panel />} />
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </AppState>
    </HashRouter>
  </StrictMode>,
);
