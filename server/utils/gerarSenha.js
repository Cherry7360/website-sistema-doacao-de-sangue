
import bcrypt from "bcrypt";

// Função para gerar senha numérica aleatória de 7 dígitos
export function gerar7Digitos() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Função para gerar hash da palavra passe
export async function gerarHash(senha) {
  const hash = await bcrypt.hash(senha, 10);
  console.log("Senha gerada:", senha);
  console.log("Hash correspondente:", hash);
  return hash;
}

(async () => {
  const senha = gerar7Digitos();
  await gerarHash(senha);
})();