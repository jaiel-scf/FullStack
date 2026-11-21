const CHAVE_TEMA = "temaPreferido";

function atualizarBotoesTema(tema) {
  for (const [id, valor] of [["temaClaro", "claro"], ["temaEscuro", "escuro"]]) {
    const botao = document.getElementById(id);
    if (!botao) continue;
    const ativo = tema === valor;
    botao.setAttribute("aria-pressed", String(ativo));
    botao.style.borderColor = ativo ? "#2563eb" : "";
    botao.style.backgroundColor = ativo ? "rgba(37,99,235,0.12)" : "";
    botao.style.color = ativo ? "#2563eb" : "";
  }
}

// Aplica e salva o tema escolhido
function aplicarTema(tema) {
  const temaValido = tema === "escuro" ? "escuro" : "claro";

  document.documentElement.classList.toggle(
    "tema-escuro",
    temaValido === "escuro",
  );

  localStorage.setItem(CHAVE_TEMA, temaValido);

  atualizarBotoesTema(temaValido);
}

// Aplica o tema salvo antes da página ser exibida
aplicarTema(localStorage.getItem(CHAVE_TEMA) || "claro");

// Cria a janela de preferências
function criarModalPreferencias() {
  if (document.getElementById("modalPreferencias")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "modalPreferencias";
  modal.className = "modal-preferencias hidden";

  modal.innerHTML = `
    <div class="conteudo-preferencias">

      <div class="cabecalho-preferencias">
        <div>
          <h2>Preferências</h2>
          <p>Personalize a aparência do sistema.</p>
        </div>

        <button
          type="button"
          class="fechar-preferencias"
          id="fecharPreferencias"
          aria-label="Fechar">
          &times;
        </button>
      </div>

      <div class="campo-preferencias">
        <label for="seletorTema">Tema do sistema</label>

        <div class="flex gap-3" role="group" aria-label="Tema do sistema">
          <button type="button" id="temaClaro" aria-pressed="false" class="flex-1 border border-slate-300 rounded-xl p-3 font-semibold transition">☀️ Claro</button>
          <button type="button" id="temaEscuro" aria-pressed="false" class="flex-1 border border-slate-300 rounded-xl p-3 font-semibold transition">🌙 Escuro</button>
        </div>

        <p>A preferência será mantida nas próximas visitas.</p>
      </div>

      <div class="acoes-preferencias">
        <button
          type="button"
          id="salvarPreferencias"
          class="bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-indigo-700">
          Salvar preferência
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  atualizarBotoesTema(localStorage.getItem(CHAVE_TEMA) || "claro");

  document.getElementById("temaClaro").addEventListener("click", () => {
    aplicarTema("claro");
    fecharPreferencias();
  });
  document.getElementById("temaEscuro").addEventListener("click", () => {
    aplicarTema("escuro");
    fecharPreferencias();
  });
  document.getElementById("fecharPreferencias").addEventListener("click", fecharPreferencias);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      fecharPreferencias();
    }
  });
}

// Abre as preferências
function abrirPreferencias() {
  criarModalPreferencias();

  document.getElementById("modalPreferencias").classList.remove("hidden");
}

// Fecha as preferências
function fecharPreferencias() {
  const modal = document.getElementById("modalPreferencias");

  if (modal) {
    modal.classList.add("hidden");
  }
}

// Configura os eventos da página
document.addEventListener("DOMContentLoaded", function () {
  criarModalPreferencias();

  const botao = document.getElementById("botaoPreferencias");

  if (botao) {
    botao.addEventListener("click", abrirPreferencias);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      fecharPreferencias();
    }
  });
});
