package com.almoxarifado.backend.controller;

import java.time.Instant;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.service.UsuarioService;

// Controller responsável pela autenticação
@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UsuarioService usuarioService;
    private final JwtEncoder jwtEncoder;

    public LoginController(
            UsuarioService usuarioService,
            JwtEncoder jwtEncoder) {

        this.usuarioService = usuarioService;
        this.jwtEncoder = jwtEncoder;
    }

    // Faz login e gera o token JWT
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest) {

        Usuario usuario = usuarioService.autenticar(
                loginRequest.getEmail(),
                loginRequest.getSenha());

        Instant agora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("sia-backend")
                .issuedAt(agora)
                .expiresAt(
                        agora.plusSeconds(3600))
                .subject(
                        usuario.getEmail())
                .claim(
                        "id",
                        usuario.getId())
                .claim(
                        "nome",
                        usuario.getNome())
                .claim(
                        "perfil",
                        usuario.getPerfil())
                .claim(
                        "primeiroAcesso",
                        usuario.getPrimeiroAcesso())
                .build();

        String token = jwtEncoder
                .encode(
                        JwtEncoderParameters
                                .from(claims))
                .getTokenValue();

        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getPrimeiroAcesso(),
                token);
    }

    // Solicita o link de recuperação
    @PostMapping("/esqueci-senha")
    public MensagemResponse esqueciSenha(
            @RequestBody EsqueciSenhaRequest request) {

        usuarioService.solicitarRedefinicaoSenha(
                request.getEmail());

        // Resposta genérica por segurança
        return new MensagemResponse(
                "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.");
    }

    // Salva uma nova senha usando o token do e-mail
    @PutMapping("/redefinir-senha")
    public MensagemResponse redefinirSenha(
            @RequestBody RedefinirSenhaRequest request) {

        usuarioService.redefinirSenhaPorToken(
                request.getToken(),
                request.getNovaSenha());

        return new MensagemResponse(
                "Senha redefinida com sucesso.");
    }

    // Dados do login
    public static class LoginRequest {

        private String email;
        private String senha;

        public LoginRequest() {
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
    }

    // Pedido de recuperação
    public static class EsqueciSenhaRequest {

        private String email;

        public EsqueciSenhaRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // Pedido de nova senha
    public static class RedefinirSenhaRequest {

        private String token;
        private String novaSenha;

        public RedefinirSenhaRequest() {
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getNovaSenha() {
            return novaSenha;
        }

        public void setNovaSenha(String novaSenha) {
            this.novaSenha = novaSenha;
        }
    }

    // Resposta simples
    public static class MensagemResponse {

        private final String mensagem;

        public MensagemResponse(
                String mensagem) {

            this.mensagem = mensagem;
        }

        public String getMensagem() {
            return mensagem;
        }
    }

    // Resposta do login
    public static class LoginResponse {

        private final Long id;
        private final String nome;
        private final String email;
        private final String perfil;
        private final Boolean primeiroAcesso;
        private final String token;

        public LoginResponse(
                Long id,
                String nome,
                String email,
                String perfil,
                Boolean primeiroAcesso,
                String token) {

            this.id = id;
            this.nome = nome;
            this.email = email;
            this.perfil = perfil;
            this.primeiroAcesso = primeiroAcesso;
            this.token = token;
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

        public Boolean getPrimeiroAcesso() {
            return primeiroAcesso;
        }

        public String getToken() {
            return token;
        }
    }
}