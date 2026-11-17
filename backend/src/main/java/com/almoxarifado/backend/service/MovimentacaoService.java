package com.almoxarifado.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.almoxarifado.backend.model.Movimentacao;
import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.repository.MovimentacaoRepository;
import com.almoxarifado.backend.repository.ProdutoRepository;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    public MovimentacaoService(
            MovimentacaoRepository movimentacaoRepository,
            ProdutoRepository produtoRepository) {

        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Movimentacao> listarTodos() {
        return movimentacaoRepository.findAll();
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

    // Cria requisição sem alterar o estoque
    @Transactional
    public Movimentacao criarRequisicao(Movimentacao movimentacao) {

        if (movimentacao.getProdutoId() == null) {
            throw new RuntimeException("Produto não informado");
        }

        produtoRepository
                .findById(movimentacao.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (movimentacao.getQuantidade() == null
                || movimentacao.getQuantidade() <= 0) {

            throw new RuntimeException(
                    "A quantidade deve ser maior que zero");
        }

        Date agora = new Date();

        movimentacao.setTipo("REQUISICAO");
        movimentacao.setCodigo(gerarCodigoRequisicao());
        movimentacao.setStatus("AGUARDANDO");
        movimentacao.setDataMovimentacao(agora);
        movimentacao.setDataAtualizada(agora);
        movimentacao.setValorUnitario(null);

        return movimentacaoRepository.save(movimentacao);
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

    // Retira o produto do estoque ao autorizar
    private void autorizarRequisicao(Movimentacao requisicao) {

        Produto produto = produtoRepository
                .buscarPorIdComBloqueio(requisicao.getProdutoId())
                .orElseThrow(() -> new RuntimeException(
                        "Produto não encontrado"));

        if (produto.getQuantidade() < requisicao.getQuantidade()) {
            throw new RuntimeException("Estoque insuficiente");
        }

        produto.setQuantidade(
                produto.getQuantidade() - requisicao.getQuantidade());

        // O custo médio permanece inalterado
        produtoRepository.save(produto);
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
