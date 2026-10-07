import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioPage from "../src/pages/InicioPage";
import ContactanosPage from "../src/pages/ContactanosPage";
import ServiciosPage from "../src/pages/ServiciosPage";
import ScrollToTop from "./components/ScrollTop";
import SqueezePage from "../src/pages/SqueezePage";
import GraciasPage from "../src/pages/graciasPage";
import AdminPage from "../src/pages/adminPage";
import PoliticaPage from "../src/pages/politicaprivacidad";
import Condiciones from "./pages/Condiciones";
import TemaCondicion from "./pages/TemaCondicion";
import Formulario from "./pages/Formulario";
import Pqrs from "./pages/Pqrs";
import CentroCondicionesLayout from "./components/condiciones/CentroCondicionesLayout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<InicioPage />}></Route>
        <Route path="/servicios" element={<ServiciosPage />}></Route>
        <Route path="/contactanos" element={<ContactanosPage />}></Route>
        <Route element={<CentroCondicionesLayout />}>
          <Route path="/condiciones" element={<Condiciones />} />
          <Route path="/condiciones/:tema" element={<TemaCondicion />} />
          <Route path="/pqrs" element={<Pqrs />} />
        </Route>
        <Route path="/formulario" element={<Formulario />} />
        <Route
          path="/politica-de-privacidad"
          element={<PoliticaPage />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
