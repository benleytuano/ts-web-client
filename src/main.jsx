import { RouterProvider } from "react-router";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./routes/router.js";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
