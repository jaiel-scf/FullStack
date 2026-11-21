// Seletor visual compartilhado por Entrada e Requisições.
// Mantém o <select> original como fonte de verdade para os formulários.
(function () {
  const cacheFotos = new Map();

  function foto(id) {
    if (!cacheFotos.has(id)) {
      cacheFotos.set(id, (async () => {
        try {
          const token = sessionStorage.getItem("token");
          const resposta = await fetch(`${API_URL}/produtos/${id}/imagem`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!resposta.ok) return null;
          const blob = await resposta.blob();
          if (!blob.type.startsWith("image/")) return null;
          return URL.createObjectURL(blob);
        } catch (erro) {
          console.warn("Imagem do produto indisponível:", id, erro);
          return null;
        }
      })());
    }
    return cacheFotos.get(id);
  }

  function miniatura(id) {
    const quadro = document.createElement("span");
    quadro.className = "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-500 text-center";
    quadro.textContent = "Sem foto";
    foto(id).then((url) => {
      if (!url || !quadro.isConnected) return;
      const imagem = document.createElement("img");
      imagem.src = url;
      imagem.alt = "";
      imagem.className = "h-full w-full object-cover";
      quadro.replaceChildren(imagem);
    });
    return quadro;
  }

  function iniciar(id) {
    const select = document.getElementById(id);
    if (!select || select.dataset.seletorVisual) return;
    select.dataset.seletorVisual = "true";
    select.classList.add("sr-only");
    select.tabIndex = -1;

    const area = document.createElement("div");
    area.className = "relative";
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-slate-700";
    botao.setAttribute("aria-label", "Selecionar produto com imagem");
    botao.setAttribute("aria-expanded", "false");
    const painel = document.createElement("div");
    painel.className = "hidden absolute left-0 right-0 top-full z-[100] mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl";
    painel.setAttribute("role", "listbox");
    area.append(botao, painel);
    select.insertAdjacentElement("afterend", area);

    function opcoes() {
      return Array.from(select.options).filter((o) => o.value && !o.disabled && !o.hidden);
    }

    function desenharBotao() {
      botao.replaceChildren();
      const escolhida = select.selectedOptions[0];
      if (escolhida && escolhida.value) botao.append(miniatura(escolhida.value));
      const titulo = document.createElement("span");
      titulo.className = "flex-1 min-w-0 text-sm font-medium break-words";
      titulo.textContent = escolhida && escolhida.value ? escolhida.textContent : "Selecione um produto";
      const seta = document.createElement("span");
      seta.textContent = "▾";
      botao.append(titulo, seta);
    }

    function fechar() {
      painel.classList.add("hidden");
      botao.setAttribute("aria-expanded", "false");
    }

    function abrir() {
      painel.replaceChildren();
      const disponiveis = opcoes();
      if (!disponiveis.length) {
        const aviso = document.createElement("p");
        aviso.className = "p-4 text-sm text-slate-500";
        aviso.textContent = "Nenhum produto disponível.";
        painel.append(aviso);
      }
      disponiveis.forEach((opcao) => {
        const linha = document.createElement("button");
        linha.type = "button";
        linha.className = "w-full flex items-center gap-3 border-b border-slate-100 p-3 text-left hover:bg-blue-50 focus:bg-blue-50";
        const nome = document.createElement("span");
        nome.className = "text-sm text-slate-700 break-words";
        nome.textContent = opcao.textContent;
        linha.append(miniatura(opcao.value), nome);
        linha.addEventListener("click", () => {
          select.value = opcao.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          desenharBotao();
          fechar();
        });
        painel.append(linha);
      });
      painel.classList.remove("hidden");
      botao.setAttribute("aria-expanded", "true");
    }

    botao.addEventListener("click", () => painel.classList.contains("hidden") ? abrir() : fechar());
    document.addEventListener("click", (evento) => { if (!area.contains(evento.target)) fechar(); });
    document.addEventListener("keydown", (evento) => { if (evento.key === "Escape") fechar(); });
    select.addEventListener("change", desenharBotao);
    // A lista é repovoada por fetch e muda quando materiais são adicionados.
    new MutationObserver(() => {
      desenharBotao();
      if (!painel.classList.contains("hidden")) abrir();
    }).observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "hidden"] });
    desenharBotao();
  }

  document.addEventListener("DOMContentLoaded", () => {
    iniciar("produtoEntrada");
    iniciar("material");
  });

  window.addEventListener("pagehide", () => {
    for (const promessa of cacheFotos.values()) promessa.then((url) => { if (url) URL.revokeObjectURL(url); });
  });
})();
