import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioPage from "../src/pages/InicioPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
