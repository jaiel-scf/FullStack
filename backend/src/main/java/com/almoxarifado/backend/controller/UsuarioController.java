package com.almoxarifado.backend.controller;

import java.util.List;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.service.UsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Recebe as requisições relacionadas aos usuários
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Cadastra um novo usuário
    @PostMapping("/registrar")
    public UsuarioResponse cadastrar(
            @RequestBody UsuarioRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        validarAdmin(jwt);

        Usuario usuario = usuarioService.cadastrarUsuario(
                request.getNome(),
                request.getEmail(),
                request.getSenha(),
                request.getPerfil());

        return criarResponse(usuario);
    }

    // Lista todos os usuários cadastrados
    @GetMapping("/listar")
    public List<UsuarioResponse> listar(
            @AuthenticationPrincipal Jwt jwt) {

        validarAdmin(jwt);

        return usuarioService.listarTodos()
                .stream()
                .map(this::criarResponse)
                .toList();
    }

    // Exclui um usuário
    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        validarAdmin(jwt);

        Number usuarioLogadoId = jwt.getClaim("id");

        // Impede que o usuário apague a própria conta
        if (usuarioLogadoId != null &&
                usuarioLogadoId.longValue() == id.longValue()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Você não pode excluir o usuário que está logado");
        }

        usuarioService.excluirUsuario(id);
    }

    // Verifica se o usuário logado é administrador
    private void validarAdmin(Jwt jwt) {

        String perfil = jwt.getClaimAsString("perfil");

        if (!"admin".equals(perfil)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Acesso permitido somente para administradores");
        }
    }

    // Evita enviar senha ou senha_hash para o frontend
    private UsuarioResponse criarResponse(Usuario usuario) {

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getAtivo());
    }

    // Dados recebidos ao cadastrar um usuário
    public static class UsuarioRequest {

        private String nome;
        private String email;
        private String senha;
        private String perfil;

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getSenha() {
            return senha;
        }

        public void setSenha(String senha) {
            this.senha = senha;
        }

        public String getPerfil() {
            return perfil;
        }

        public void setPerfil(String perfil) {
            this.perfil = perfil;
        }
    }

    // Dados enviados para o frontend
    public static class UsuarioResponse {

        private Long id;
        private String nome;
        private String email;
        private String perfil;
        private Boolean ativo;

        public UsuarioResponse(
                Long id,
                String nome,
                String email,
                String perfil,
                Boolean ativo) {

            this.id = id;
            this.nome = nome;
            this.email = email;
            this.perfil = perfil;
            this.ativo = ativo;
        }

        public Long getId() {
            return id;
        }

        public String getNome() {
            return nome;
        }

        public String getEmail() {
            return email;
        }

        public String getPerfil() {
            return perfil;
        }

        public Boolean getAtivo() {
            return ativo;
        }
    }
}
