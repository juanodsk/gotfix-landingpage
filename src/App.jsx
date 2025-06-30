import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioPage from "../src/pages/InicioPage";
import ContactanosPage from "../src/pages/ContactanosPage";
import ServiciosPage from "../src/pages/ServiciosPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />}></Route>
        <Route path="/servicios" element={<ServiciosPage />}></Route>
        <Route path="/contactanos" element={<ContactanosPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
