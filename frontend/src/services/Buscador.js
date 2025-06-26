export async function buscarDeputados(filtros) {
  const query = new URLSearchParams(filtros).toString();
  const response = await fetch(`http://localhost:8000/deputados?${query}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar deputados");
  }
  const data = await response.json();
  return data.dados || [];
}
