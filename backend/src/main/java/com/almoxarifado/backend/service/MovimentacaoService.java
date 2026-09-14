package com.almoxarifado.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.almoxarifado.backend.model.Movimentacao;
import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.repository.MovimentacaoRepository;
import com.almoxarifado.backend.repository.ProdutoRepository;
import java.time.OffsetDateTime;
import java.util.List;

// Aqui são as regras de negocio das movimentações.
@Service
public class MovimentacaoService {
    // Repositorio usado para salvar e buscas as movimentações.
    private final MovimentacaoRepository movimentacaoRepository;

    // Repositorio usado para consultar e atualizar os produtos.
    private final ProdutoRepository produtoRepository;

    // Recebe os repositorios nessesarios para trabalhar com as movimentações e
    // produtos.
    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ProdutoRepository produtoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    // Busca e retorna todas as movimentações cadastradas
    public List<Movimentacao> listarTodos() {
        return movimentacaoRepository.findAll();
    }

    // Registra uma movimentação e atualiza a quantidade de produto no estoque.
    @Transactional
    public Movimentacao registrar(Movimentacao movimentacao) {
        // Busca o produto relacionado à movimentação.
        Produto produto = produtoRepository.findById(movimentacao.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Impede movimentações com quantidade zero ou negativa.
        if (movimentacao.getQuantidade() == null || movimentacao.getQuantidade() <= 0) {
            throw new RuntimeException("A quantidade deve ser maior que zero");
        }
        // Impede movimentações sem um tipo definido.
        if (movimentacao.getTipo() == null || movimentacao.getTipo().isBlank()) {
            throw new RuntimeException("O tipo da movimentação é obrigatório");
        }

        // Verifica se a movimentação é uma entrada.
        if ("ENTRADA".equalsIgnoreCase(movimentacao.getTipo())) {

    produto.setQuantidade(produto.getQuantidade() + movimentacao.getQuantidade());

} else if ("SAIDA".equalsIgnoreCase(movimentacao.getTipo())) {

    if (produto.getQuantidade() < movimentacao.getQuantidade()) {
        throw new RuntimeException("Estoque insuficiente para a saída");
    }

    produto.setQuantidade(produto.getQuantidade() - movimentacao.getQuantidade());

} else {

    throw new RuntimeException("Tipo de movimentação inválido");
}

// Registra a data e hora atual da movimentação.
movimentacao.setDataMovimentacao(OffsetDateTime.now());

produtoRepository.save(produto);

return movimentacaoRepository.save(movimentacao);
    }
}
