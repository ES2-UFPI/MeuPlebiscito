import Header from "./components/Header";
import MainNav from "./components/MainNav";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Searched from "./pages/Searched";

function App() {
  return (
    <>
      <Header />
      <MainNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Searched />} />
        {/* <Route path="/projetos" element={<Projetos />} /> */}
        {/* <Route path="/projeto/:id" element={<Projeto />} /> */}
        {/* <Route path="/sobre" element={<Sobre />} /> */}
        {/* <Route path="/contato" element={<Contato />} /> */}
      </Routes>
    </>
  );
}

export default App;
