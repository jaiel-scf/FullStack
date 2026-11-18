const CHAVE_TEMA = "temaPreferido";

// Aplica e salva o tema escolhido
function aplicarTema(tema) {
  const temaValido = tema === "escuro" ? "escuro" : "claro";

  document.documentElement.classList.toggle(
    "tema-escuro",
    temaValido === "escuro",
  );

  localStorage.setItem(CHAVE_TEMA, temaValido);

  const seletor = document.getElementById("seletorTema");

  if (seletor) {
    seletor.value = temaValido;
  }
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

        <select
          id="seletorTema"
          class="border border-slate-300 rounded-lg p-3">
          <option value="claro">Claro</option>
          <option value="escuro">Escuro</option>
        </select>

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

  document.getElementById("seletorTema").value =
    localStorage.getItem(CHAVE_TEMA) || "claro";

  document
    .getElementById("fecharPreferencias")
    .addEventListener("click", fecharPreferencias);

  document
    .getElementById("salvarPreferencias")
    .addEventListener("click", function () {
      const tema = document.getElementById("seletorTema").value;

      aplicarTema(tema);
      fecharPreferencias();
    });

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
