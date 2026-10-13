package com.almoxarifado.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.repository.ProdutoRepository;

// Regras de negócio de Produto
@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // Lista somente produtos ativos
    public List<Produto> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .filter(produto -> produto.getAtivo() == null || produto.getAtivo())
                .toList();
    }

    // Salva um produto
    public Produto salvar(Produto produto) {

        // Produto novo entra ativo
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }

        return produtoRepository.save(produto);
    }

    // Busca produto pelo ID
    public Optional<Produto> buscaPorId(Long id) {
        return produtoRepository.findById(id);
    }

    // Edita um produto
    public Produto editar(Long id, Produto dadosProduto) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        produto.setNome(dadosProduto.getNome());
        produto.setCodigo(dadosProduto.getCodigo());
        produto.setDescricao(dadosProduto.getDescricao());
        produto.setLocalizacao(dadosProduto.getLocalizacao());
        produto.setUnidadeMedida(dadosProduto.getUnidadeMedida());
        produto.setEstoqueMinimo(dadosProduto.getEstoqueMinimo());

        return produtoRepository.save(produto);
    }

    // Inativa um produto
    public Produto inativar(Long id) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        produto.setAtivo(false);

        return produtoRepository.save(produto);
    }
}