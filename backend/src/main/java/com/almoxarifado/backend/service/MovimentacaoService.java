package com.almoxarifado.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.almoxarifado.backend.model.Movimentacao;
import com.almoxarifado.backend.model.RequisicaoItem;
import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.repository.MovimentacaoRepository;
import com.almoxarifado.backend.repository.RequisicaoItemRepository;
import com.almoxarifado.backend.repository.ProdutoRepository;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;
    private final RequisicaoItemRepository requisicaoItemRepository;

    public MovimentacaoService(
            MovimentacaoRepository movimentacaoRepository,
            ProdutoRepository produtoRepository,
            RequisicaoItemRepository requisicaoItemRepository) {

        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
        this.requisicaoItemRepository = requisicaoItemRepository;
    }

    public List<Movimentacao> listarTodos() {
        List<Movimentacao> movimentacoes = movimentacaoRepository.findAll();
        List<Long> ids = movimentacoes.stream()
                .filter(m -> "REQUISICAO".equalsIgnoreCase(m.getTipo()))
                .map(Movimentacao::getId).toList();
        Map<Long, List<RequisicaoItem>> porRequisicao = ids.isEmpty()
                ? Map.of()
                : requisicaoItemRepository.findByRequisicaoIdIn(ids).stream()
                    .collect(Collectors.groupingBy(RequisicaoItem::getRequisicaoId));
        for (Movimentacao m : movimentacoes) {
            if ("REQUISICAO".equalsIgnoreCase(m.getTipo())) {
                m.setItens(itensDaRequisicao(m, porRequisicao.getOrDefault(m.getId(), List.of())));
            }
        }
        return movimentacoes;
    }

    // Registra entrada ou saída
    @Transactional
    public Movimentacao registrar(Movimentacao movimentacao) {

        if (movimentacao.getProdutoId() == null) {
            throw new RuntimeException("Produto não informado");
        }

        Produto produto = produtoRepository
                .buscarPorIdComBloqueio(movimentacao.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (movimentacao.getQuantidade() == null
                || movimentacao.getQuantidade() <= 0) {

            throw new RuntimeException(
                    "A quantidade deve ser maior que zero");
        }

        Long quantidadeAtual = produto.getQuantidade();

        if (quantidadeAtual == null || quantidadeAtual < 0) {
            throw new RuntimeException("Quantidade atual do estoque inválida");
        }

        // Entrada
        if ("ENTRADA".equalsIgnoreCase(movimentacao.getTipo())) {

            BigDecimal custoEntrada = movimentacao.getValorUnitario();

            if (custoEntrada == null || custoEntrada.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException(
                        "O custo unitário deve ser maior que zero");
            }

            custoEntrada = custoEntrada.setScale(4, RoundingMode.HALF_UP);

            if (custoEntrada.precision() > 14) {
                throw new RuntimeException(
                        "O custo unitário informado é muito alto");
            }

            BigDecimal custoMedioAtual = produto.getCustoMedio();

            // Produto com saldo antigo precisa ter custo inicial
            if (quantidadeAtual > 0 && custoMedioAtual == null) {
                throw new RuntimeException(
                        "O administrador precisa informar o custo inicial deste produto");
            }

            Long novaQuantidade;

            try {
                novaQuantidade = Math.addExact(
                        quantidadeAtual,
                        movimentacao.getQuantidade());
            } catch (ArithmeticException e) {
                throw new RuntimeException("Quantidade do estoque excede o limite");
            }

            BigDecimal novoCustoMedio;

            if (quantidadeAtual == 0) {

                // Primeira entrada do produto
                novoCustoMedio = custoEntrada;

            } else {

                // Cálculo do custo médio ponderado
                BigDecimal valorEstoqueAtual = custoMedioAtual.multiply(
                        BigDecimal.valueOf(quantidadeAtual));

                BigDecimal valorNovaEntrada = custoEntrada.multiply(
                        BigDecimal.valueOf(movimentacao.getQuantidade()));

                BigDecimal valorTotal = valorEstoqueAtual.add(valorNovaEntrada);

                novoCustoMedio = valorTotal.divide(
                        BigDecimal.valueOf(novaQuantidade),
                        4,
                        RoundingMode.HALF_UP);
            }

            if (novoCustoMedio.precision() > 14) {
                throw new RuntimeException(
                        "O custo médio calculado excede o limite permitido");
            }

            produto.setQuantidade(novaQuantidade);
            produto.setCustoMedio(novoCustoMedio);

            movimentacao.setValorUnitario(custoEntrada);

            // Saída
        } else if ("SAIDA".equalsIgnoreCase(movimentacao.getTipo())) {

            if (quantidadeAtual < movimentacao.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente");
            }

            produto.setQuantidade(
                    quantidadeAtual - movimentacao.getQuantidade());

            // Saídas não possuem custo unitário de aquisição
            movimentacao.setValorUnitario(null);

        } else {

            throw new RuntimeException("Tipo de movimentação inválido");
        }

        movimentacao.setDataMovimentacao(new Date());

        produtoRepository.save(produto);

        return movimentacaoRepository.save(movimentacao);
    }

    // Requisicoes antigas usam produtoId/quantidade; novas usam itens persistidos.
    private List<RequisicaoItem> itensDaRequisicao(Movimentacao requisicao, List<RequisicaoItem> persistidos) {
        if (!persistidos.isEmpty()) return persistidos;
        if (requisicao.getProdutoId() == null || requisicao.getQuantidade() == null) return List.of();
        RequisicaoItem legado = new RequisicaoItem();
        legado.setRequisicaoId(requisicao.getId());
        legado.setProdutoId(requisicao.getProdutoId());
        legado.setQuantidade(requisicao.getQuantidade());
        return List.of(legado);
    }

    @Transactional
    public Movimentacao criarRequisicao(Movimentacao requisicao) {
        List<RequisicaoItem> itens = requisicao.getItens();
        if (itens == null || itens.isEmpty()) {
            if (requisicao.getProdutoId() == null || requisicao.getQuantidade() == null) {
                throw new RuntimeException("Informe pelo menos um material");
            }
            RequisicaoItem unico = new RequisicaoItem();
            unico.setProdutoId(requisicao.getProdutoId());
            unico.setQuantidade(requisicao.getQuantidade());
            itens = List.of(unico);
        }
        Set<Long> ids = new HashSet<>();
        for (RequisicaoItem item : itens) {
            if (item == null || item.getProdutoId() == null || item.getQuantidade() == null
                    || item.getQuantidade() <= 0 || !ids.add(item.getProdutoId())) {
                throw new RuntimeException("Itens invalidos ou materiais repetidos");
            }
            if (!produtoRepository.existsById(item.getProdutoId())) {
                throw new RuntimeException("Produto nao encontrado: " + item.getProdutoId());
            }
        }

        Date agora = new Date();
        requisicao.setId(null);
        // Mantem o primeiro item nas colunas legadas para compatibilidade
        // com integracoes existentes e possiveis restricoes NOT NULL.
        requisicao.setProdutoId(itens.get(0).getProdutoId());
        requisicao.setQuantidade(itens.get(0).getQuantidade());
        requisicao.setTipo("REQUISICAO");
        requisicao.setCodigo(gerarCodigoRequisicao());
        requisicao.setStatus("AGUARDANDO");
        requisicao.setDataMovimentacao(agora);
        requisicao.setDataAtualizada(agora);
        requisicao.setValorUnitario(null);
        Movimentacao salva = movimentacaoRepository.save(requisicao);
        List<RequisicaoItem> gravados = new ArrayList<>();
        for (RequisicaoItem item : itens) {
            RequisicaoItem novo = new RequisicaoItem();
            novo.setRequisicaoId(salva.getId());
            novo.setProdutoId(item.getProdutoId());
            novo.setQuantidade(item.getQuantidade());
            gravados.add(novo);
        }
        salva.setItens(requisicaoItemRepository.saveAll(gravados));
        return salva;
    }

    // Altera o status da requisição
    @Transactional
    public Movimentacao alterarStatus(Long id, String novoStatus) {

        if (id == null || novoStatus == null || novoStatus.isBlank()) {
            throw new RuntimeException("Dados da requisição inválidos");
        }

        Movimentacao requisicao = movimentacaoRepository
                .buscarPorIdComBloqueio(id)
                .orElseThrow(() -> new RuntimeException(
                        "Requisição não encontrada"));

        if (!"REQUISICAO".equalsIgnoreCase(requisicao.getTipo())) {
            throw new RuntimeException(
                    "O registro não é uma requisição");
        }

        String statusAtual = requisicao.getStatus();
        String statusNovo = novoStatus.trim().toUpperCase();

        if ("AGUARDANDO".equalsIgnoreCase(statusAtual)) {

            if ("AUTORIZADO".equals(statusNovo)) {

                autorizarRequisicao(requisicao);

            } else if (!"REPROVADO".equals(statusNovo)) {

                throw new RuntimeException("Status inválido");
            }

        } else if ("AUTORIZADO".equalsIgnoreCase(statusAtual)) {

            if (!"FINALIZADO".equals(statusNovo)) {
                throw new RuntimeException(
                        "A requisição só pode ser finalizada");
            }

        } else {

            throw new RuntimeException(
                    "Essa requisição não pode mais ser alterada");
        }

        requisicao.setStatus(statusNovo);
        requisicao.setDataAtualizada(new Date());

        return movimentacaoRepository.save(requisicao);
    }

    // Validacao e baixa atomicas; bloqueio por ID para evitar deadlocks.
    private void autorizarRequisicao(Movimentacao requisicao) {
        List<RequisicaoItem> itens = itensDaRequisicao(requisicao,
                requisicaoItemRepository.findByRequisicaoId(requisicao.getId()));
        if (itens.isEmpty()) throw new RuntimeException("Requisicao sem materiais");
        List<RequisicaoItem> ordenados = new ArrayList<>(itens);
        ordenados.sort((a, b) -> a.getProdutoId().compareTo(b.getProdutoId()));
        List<Produto> bloqueados = new ArrayList<>();
        for (RequisicaoItem item : ordenados) {
            Produto produto = produtoRepository.buscarPorIdComBloqueio(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado: " + item.getProdutoId()));
            if (produto.getQuantidade() == null || produto.getQuantidade() < item.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para " + produto.getNome());
            }
            bloqueados.add(produto);
        }
        for (int i = 0; i < ordenados.size(); i++) {
            Produto produto = bloqueados.get(i);
            produto.setQuantidade(produto.getQuantidade() - ordenados.get(i).getQuantidade());
        }
        produtoRepository.saveAll(bloqueados);
    }

    // Gera código automático da requisição
    private String gerarCodigoRequisicao() {

        String data = new SimpleDateFormat("yyMMdd")
                .format(new Date());

        String identificador = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 4)
                .toUpperCase();

        return "R" + data + "." + identificador;
    }
}
