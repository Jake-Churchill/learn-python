import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PyodideProvider } from "./hooks/PyodideProvider.jsx";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";

export default function App() {
  return (
    <PyodideProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons/:slug" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </PyodideProvider>
  );
}
