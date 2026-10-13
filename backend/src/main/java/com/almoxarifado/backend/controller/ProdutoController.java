package com.almoxarifado.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.service.ProdutoService;

// Recebe as requisições de Produto
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Lista os produtos ativos
    @GetMapping("/listar")
    public List<Produto> listaProdutos() {
        return produtoService.listarTodos();
    }

    // Cadastra um produto
    @PostMapping("/registrar")
    public Produto cadastrar(
            @RequestBody Produto produto,
            @AuthenticationPrincipal Jwt jwt) {

        verificarAdmin(jwt);

        return produtoService.salvar(produto);
    }

    // Edita um produto
    @PutMapping("/{id}")
    public Produto editar(
            @PathVariable Long id,
            @RequestBody Produto produto,
            @AuthenticationPrincipal Jwt jwt) {

        verificarAdmin(jwt);

        return produtoService.editar(id, produto);
    }

    // Inativa um produto
    @PutMapping("/{id}/inativar")
    public Produto inativar(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        verificarAdmin(jwt);

        return produtoService.inativar(id);
    }

    // Verifica se o usuário é administrador
    private void verificarAdmin(Jwt jwt) {

        if (jwt == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado.");
        }

        String perfil = jwt.getClaimAsString("perfil");

        if (!"admin".equalsIgnoreCase(perfil)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Apenas administradores podem realizar esta ação.");
        }
    }
}