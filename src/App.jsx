import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioPage from "../src/pages/InicioPage";
import ContactanosPage from "../src/pages/ContactanosPage";
import ServiciosPage from "../src/pages/ServiciosPage";
import ScrollToTop from "./components/ScrollTop";
import SqueezePage from "../src/pages/SqueezePage";
import GraciasPage from "../src/pages/graciasPage";
import AdminPage from "../src/pages/adminPage";
import PoliticaPage from "../src/pages/politicaprivacidad";
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

        <Route
          path="/politica-de-privacidad"
          element={<PoliticaPage />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
