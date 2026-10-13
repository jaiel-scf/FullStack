package com.almoxarifado.backend.service;

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

// Regras de negócio das movimentações
@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    // Recebe os repositórios necessários
    public MovimentacaoService(
            MovimentacaoRepository movimentacaoRepository,
            ProdutoRepository produtoRepository) {

        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    // Lista todas as movimentações
    public List<Movimentacao> listarTodos() {
        return movimentacaoRepository.findAll();
    }

    // Registra entrada ou saída normal
    @Transactional
    public Movimentacao registrar(Movimentacao movimentacao) {

        Produto produto = produtoRepository
                .findById(movimentacao.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Valida a quantidade
        if (movimentacao.getQuantidade() == null
                || movimentacao.getQuantidade() <= 0) {

            throw new RuntimeException(
                    "A quantidade deve ser maior que zero");
        }

        // Entrada aumenta o estoque
        if ("ENTRADA".equalsIgnoreCase(movimentacao.getTipo())) {

            produto.setQuantidade(
                    produto.getQuantidade()
                            + movimentacao.getQuantidade());

            // Saída diminui o estoque
        } else if ("SAIDA".equalsIgnoreCase(movimentacao.getTipo())) {

            if (produto.getQuantidade() < movimentacao.getQuantidade()) {

                throw new RuntimeException(
                        "Estoque insuficiente");
            }

            produto.setQuantidade(
                    produto.getQuantidade()
                            - movimentacao.getQuantidade());

        } else {

            throw new RuntimeException(
                    "Tipo de movimentação inválido");
        }

        // Registra a data da movimentação
        movimentacao.setDataMovimentacao(new Date());

        produtoRepository.save(produto);

        return movimentacaoRepository.save(movimentacao);
    }

    // Cria uma requisição sem alterar o estoque
    @Transactional
    public Movimentacao criarRequisicao(Movimentacao movimentacao) {

        // Confirma se o produto existe
        produtoRepository
                .findById(movimentacao.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Valida a quantidade
        if (movimentacao.getQuantidade() == null
                || movimentacao.getQuantidade() <= 0) {

            throw new RuntimeException(
                    "A quantidade deve ser maior que zero");
        }

        Date agora = new Date();

        // Define os dados automáticos
        movimentacao.setTipo("REQUISICAO");
        movimentacao.setCodigo(gerarCodigoRequisicao());
        movimentacao.setStatus("AGUARDANDO");
        movimentacao.setDataMovimentacao(agora);
        movimentacao.setDataAtualizada(agora);

        return movimentacaoRepository.save(movimentacao);
    }

    // Altera o status da requisição
    @Transactional
    public Movimentacao alterarStatus(Long id, String novoStatus) {

        Movimentacao requisicao = movimentacaoRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Requisição não encontrada"));

        // Confirma se é uma requisição
        if (!"REQUISICAO".equalsIgnoreCase(requisicao.getTipo())) {

            throw new RuntimeException(
                    "O registro não é uma requisição");
        }

        String statusAtual = requisicao.getStatus();

        // Aguardando pode ser autorizado ou reprovado
        if ("AGUARDANDO".equalsIgnoreCase(statusAtual)) {

            if ("AUTORIZADO".equalsIgnoreCase(novoStatus)) {

                autorizarRequisicao(requisicao);

            } else if (!"REPROVADO".equalsIgnoreCase(novoStatus)) {

                throw new RuntimeException(
                        "Status inválido");
            }

            // Autorizado pode ser finalizado
        } else if ("AUTORIZADO".equalsIgnoreCase(statusAtual)) {

            if (!"FINALIZADO".equalsIgnoreCase(novoStatus)) {

                throw new RuntimeException(
                        "A requisição só pode ser finalizada");
            }

        } else {

            throw new RuntimeException(
                    "Essa requisição não pode mais ser alterada");
        }

        // Atualiza o status e a data
        requisicao.setStatus(novoStatus.toUpperCase());
        requisicao.setDataAtualizada(new Date());

        return movimentacaoRepository.save(requisicao);
    }

    // Retira o produto do estoque ao autorizar
    private void autorizarRequisicao(Movimentacao requisicao) {

        Produto produto = produtoRepository
                .findById(requisicao.getProdutoId())
                .orElseThrow(() -> new RuntimeException(
                        "Produto não encontrado"));

        if (produto.getQuantidade() < requisicao.getQuantidade()) {

            throw new RuntimeException(
                    "Estoque insuficiente");
        }

        produto.setQuantidade(
                produto.getQuantidade()
                        - requisicao.getQuantidade());

        produtoRepository.save(produto);
    }

    // Gera o código automático da requisição
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