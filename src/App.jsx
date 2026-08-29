import { PyodideProvider } from "./hooks/PyodideProvider.jsx";
import PyodideStatusBadge from "./components/PyodideStatusBadge.jsx";

export default function App() {
  return (
    <PyodideProvider>
      <div className="p-8 text-xl">
        Learn Python — scaffold OK
        <div className="mt-2">
          <PyodideStatusBadge />
        </div>
      </div>
    </PyodideProvider>
  );
}
