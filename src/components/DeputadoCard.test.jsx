import { render, screen } from "@testing-library/react";
import DeputadoCard from "../DeputadoCard";

const mockDeputado = {
  nome: "João Silva Santos",
  partido: "PT",
  estado: "PI",
  email: "joao.santos@camara.leg.br",
  telefone: "(61) 3215-5555",
  foto: "/placeholder.svg",
};

describe("DeputadoCard", () => {
  it("deve exibir informações do deputado", () => {
    render(<DeputadoCard deputado={mockDeputado} />);

    expect(screen.getByText("João Silva Santos")).toBeInTheDocument();
    expect(screen.getByText("Partido: PT")).toBeInTheDocument();
    expect(screen.getByText("UF: PI")).toBeInTheDocument();
    expect(screen.getByText("joao.santos@camara.leg.br")).toBeInTheDocument();
    expect(screen.getByText("(61) 3215-5555")).toBeInTheDocument();
  });
});
