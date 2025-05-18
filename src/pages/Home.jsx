import React from "react";
import Header from "../components/Header";
// import SearchBar from "../components/SearchBar";

const Home = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Header />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold text-[#6B3F26]">
          Bem-vindo ao Meu Plebiscito
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Acompanhe os projetos de lei em tempo real
        </p>
        {/* <SearchBar /> */}
      </div>
    </div>
  );
};

export default Home;
