const CHAVE_TEMA = "temaPreferido";
let temaEmEdicao = null;

function atualizarBotoesTema(tema) {
  for (const [id, valor] of [["temaClaro", "claro"], ["temaEscuro", "escuro"]]) {
    const botao = document.getElementById(id);
    if (!botao) continue;
    const selecionado = tema === valor;
    botao.setAttribute("aria-pressed", String(selecionado));
    botao.style.borderColor = selecionado ? "#2563eb" : "";
    botao.style.backgroundColor = selecionado ? "rgba(37,99,235,0.12)" : "";
    botao.style.color = selecionado ? "#2563eb" : "";
  }
}

function mostrarTema(tema) {
  document.documentElement.classList.toggle("tema-escuro", tema === "escuro");
  atualizarBotoesTema(tema);
}

function temaSalvo() {
  return localStorage.getItem(CHAVE_TEMA) === "escuro" ? "escuro" : "claro";
}

// Carrega a preferência confirmada, sem modificá-la.
mostrarTema(temaSalvo());

function criarModalPreferencias() {
  if (document.getElementById("modalPreferencias")) return;
  const modal = document.createElement("div");
  modal.id = "modalPreferencias";
  modal.className = "modal-preferencias hidden";
  modal.innerHTML = `
    <div class="conteudo-preferencias" role="dialog" aria-modal="true" aria-labelledby="tituloPreferencias">
      <div class="cabecalho-preferencias">
        <div>
          <h2 id="tituloPreferencias">Preferências</h2>
          <p>Experimente o tema na tela. Só será salvo após confirmar.</p>
        </div>
        <button type="button" class="fechar-preferencias" id="fecharPreferencias" aria-label="Cancelar e fechar">&times;</button>
      </div>
      <div class="campo-preferencias">
        <label>Aparência do sistema</label>
        <div class="flex gap-3" role="group" aria-label="Escolher tema">
          <button type="button" id="temaClaro" aria-pressed="false" class="flex-1 border border-slate-300 rounded-xl p-3 font-semibold transition">☀️ Claro</button>
          <button type="button" id="temaEscuro" aria-pressed="false" class="flex-1 border border-slate-300 rounded-xl p-3 font-semibold transition">🌙 Escuro</button>
        </div>
        <p>Pré-visualização temporária: Cancelar restaura o tema anterior.</p>
      </div>
      <div class="acoes-preferencias flex gap-3 justify-end">
        <button type="button" id="cancelarPreferencias" class="border border-slate-300 rounded-lg px-5 py-3 font-semibold">Cancelar</button>
        <button type="button" id="salvarPreferencias" class="bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-indigo-700">Confirmar tema</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  for (const [id, tema] of [["temaClaro", "claro"], ["temaEscuro", "escuro"]]) {
    document.getElementById(id).addEventListener("click", () => {
      temaEmEdicao = tema;
      mostrarTema(tema); // Pré-visualização na página, sem salvar no localStorage.
    });
  }
  document.getElementById("salvarPreferencias").addEventListener("click", () => {
    const temaConfirmado = temaEmEdicao || temaSalvo();
    localStorage.setItem(CHAVE_TEMA, temaConfirmado);
    mostrarTema(temaConfirmado);
    encerrarPreferencias(false);
  });
  document.getElementById("cancelarPreferencias").addEventListener("click", () => encerrarPreferencias(true));
  document.getElementById("fecharPreferencias").addEventListener("click", () => encerrarPreferencias(true));
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) encerrarPreferencias(true);
  });
}

function abrirPreferencias() {
  criarModalPreferencias();
  temaEmEdicao = temaSalvo();
  mostrarTema(temaEmEdicao);
  document.getElementById("modalPreferencias").classList.remove("hidden");
}

function encerrarPreferencias(cancelar) {
  if (cancelar) mostrarTema(temaSalvo());
  temaEmEdicao = null;
  document.getElementById("modalPreferencias")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  criarModalPreferencias();
  document.getElementById("botaoPreferencias")?.addEventListener("click", abrirPreferencias);
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") encerrarPreferencias(true);
  });
});
