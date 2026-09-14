package com.almoxarifado.backend.service;

import org.springframework.stereotype.Service;
import com.almoxarifado.backend.repository.ProdutoRepository;
import java.util.List;
import com.almoxarifado.backend.model.Produto;
import java.util.Optional;

// Essa classe dá as regras de negócio de Produto.
@Service 

// Aqui recebe o repositorio que será usado p/ acessar os produtos no banco.
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    public ProdutoService (ProdutoRepository produtoRepository){
        this.produtoRepository = produtoRepository;
    }

    // Aqui faz a busca de todos os produtos cadastrados no banco.
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // Aqui salva um produto no banco de dados.
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    // Aqui fazemos a busca do produto pelo ID.
    public  Optional<Produto> buscaPorId(Long id) {
        return produtoRepository.findById(id);
    }

    // Aqui vamos excluir um produto pelo ID.
    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }
}
