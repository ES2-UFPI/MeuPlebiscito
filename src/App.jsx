import Header from "./components/Header";
import MainNav from "./components/MainNav";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Searched from "./pages/Searched";
import Deputado from "./pages/Deputados";
import Lei from "./pages/Leis";
import Congresso from "./pages/Congresso";

function App() {
  return (
    <>
      <Header />
      <MainNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Searched />} />
        <Route path="/deputado/:id" element={<Deputado />} />
        <Route path="/lei/:id" element={<Lei />} />
        <Route path="/congresso" element={<Congresso />} />
        {/* <Route path="/projetos" element={<Projetos />} /> */}
        {/* <Route path="/projeto/:id" element={<Projeto />} /> */}
        {/* <Route path="/sobre" element={<Sobre />} /> */}
        {/* <Route path="/contato" element={<Contato />} /> */}
      </Routes>
    </>
  );
}

export default App;
