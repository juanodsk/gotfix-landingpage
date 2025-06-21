import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
const InicioPage = () => {
  useEffect(() => {
    document.title = "GotFix | Inicio";
  }, []);
  return (
    <>
      <Navbar />
      <div className="bg-white h-screen flex items-center justify-center">
        <h1 className=" text-5xl text-[#00162b] font-bold">GOTFIX</h1>
      </div>
    </>
  );
};

export default InicioPage;
