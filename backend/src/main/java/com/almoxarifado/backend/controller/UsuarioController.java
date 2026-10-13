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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Requisições relacionadas aos usuários
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Cadastra ou reativa usuário
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

    // Lista os usuários
    @GetMapping("/listar")
    public List<UsuarioResponse> listar(
            @AuthenticationPrincipal Jwt jwt) {

        validarAdmin(jwt);

        return usuarioService.listarTodos()
                .stream()
                .map(this::criarResponse)
                .toList();
    }

    // Troca a senha no primeiro acesso
    @PutMapping("/primeiro-acesso/senha")
    public void alterarSenhaPrimeiroAcesso(
            @RequestBody AlterarSenhaRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado");
        }

        Number usuarioId = jwt.getClaim("id");

        if (usuarioId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário inválido");
        }

        // Não exige novamente a senha padrão
        usuarioService.alterarSenhaPrimeiroAcesso(
                usuarioId.longValue(),
                request.getNovaSenha());
    }

    // Inativa usuário
    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        validarAdmin(jwt);

        Number usuarioLogadoId = jwt.getClaim("id");

        // Impede inativar a própria conta
        if (usuarioLogadoId != null
                && usuarioLogadoId.longValue() == id.longValue()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Você não pode excluir o usuário que está logado");
        }

        usuarioService.excluirUsuario(id);
    }

    // Confere perfil de administrador
    private void validarAdmin(Jwt jwt) {

        if (jwt == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado");
        }

        String perfil = jwt.getClaimAsString("perfil");

        if (!"admin".equals(perfil)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Acesso permitido somente para administradores");
        }
    }

    // Monta a resposta para o frontend
    private UsuarioResponse criarResponse(Usuario usuario) {

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getAtivo(),
                usuario.getPrimeiroAcesso());
    }

    // Dados recebidos no cadastro
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

    // Dados recebidos na alteração de senha
    public static class AlterarSenhaRequest {

        private String novaSenha;

        public String getNovaSenha() {
            return novaSenha;
        }

        public void setNovaSenha(String novaSenha) {
            this.novaSenha = novaSenha;
        }
    }

    // Dados enviados ao frontend
    public static class UsuarioResponse {

        private Long id;
        private String nome;
        private String email;
        private String perfil;
        private Boolean ativo;
        private Boolean primeiroAcesso;

        public UsuarioResponse(
                Long id,
                String nome,
                String email,
                String perfil,
                Boolean ativo,
                Boolean primeiroAcesso) {

            this.id = id;
            this.nome = nome;
            this.email = email;
            this.perfil = perfil;
            this.ativo = ativo;
            this.primeiroAcesso = primeiroAcesso;
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

        public Boolean getPrimeiroAcesso() {
            return primeiroAcesso;
        }
    }
}
