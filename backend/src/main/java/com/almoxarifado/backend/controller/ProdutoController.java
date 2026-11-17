
package com.almoxarifado.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.service.ImagemService;
import com.almoxarifado.backend.service.ProdutoService;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ImagemService imagemService;

    public ProdutoController(
            ProdutoService produtoService,
            ImagemService imagemService) {
        this.produtoService = produtoService;
        this.imagemService = imagemService;
    }

    @GetMapping("/listar")
    public List<Produto> listaProdutos() {
        return produtoService.listarTodos();
    }

    @PostMapping("/registrar")
    public Produto cadastrar(
            @RequestBody Produto produto,
            @AuthenticationPrincipal Jwt jwt) {
        verificarAdmin(jwt);
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    public Produto editar(
            @PathVariable Long id,
            @RequestBody Produto produto,
            @AuthenticationPrincipal Jwt jwt) {
        verificarAdmin(jwt);
        return produtoService.editar(id, produto);
    }

    @PutMapping("/{id}/inativar")
    public Produto inativar(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        verificarAdmin(jwt);
        return produtoService.inativar(id);
    }

    @PostMapping(value = "/{id}/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Produto salvarImagem(
            @PathVariable Long id,
            @RequestParam("arquivo") MultipartFile arquivo,
            @AuthenticationPrincipal Jwt jwt) throws IOException {
        verificarAdmin(jwt);
        return produtoService.salvarImagem(id, arquivo);
    }

    @DeleteMapping("/{id}/imagem")
    public Produto removerImagem(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) throws IOException {
        verificarAdmin(jwt);
        return produtoService.removerImagem(id);
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable Long id) {

        Produto produto = produtoService.buscaPorId(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado."));

        String caminho = produto.getImagemCaminho();

        if (caminho == null || caminho.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Este produto não possui imagem.");
        }

        try {
            byte[] imagem = imagemService.carregar(caminho);

            MediaType tipo = MediaType.parseMediaType(
                    imagemService.obterTipoConteudo(caminho));

            return ResponseEntity.ok()
                    .contentType(tipo)
                    .body(imagem);

        } catch (IOException | IllegalArgumentException erro) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Imagem não encontrada ou inválida.");
        }
    }

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
