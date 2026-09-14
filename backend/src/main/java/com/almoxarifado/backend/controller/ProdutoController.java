package com.almoxarifado.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.almoxarifado.backend.service.ProdutoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import com.almoxarifado.backend.model.Produto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Indica que esta classe recebe requisições HTTP.
@RestController 

// Define que todas as rotas desta classe começam com /produtos.
@RequestMapping("/produtos") 

public class ProdutoController {
    
    // Serviço usado para acessar as regras de negocio de Produto.
    private final ProdutoService produtoService;

    // Recebe o ProdutoService para usar os metodos de produto
    public  ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Retorna todos os produtos cadastrados.
    @GetMapping 
    public List<Produto> listaProdutos() {
        return produtoService.listarTodos();
    }

    // Cadastrar um novo produto.
    @PostMapping 
    public Produto cadastrar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }
}
