package com.almoxarifado.backend.controller;

import java.time.Instant;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.service.UsuarioService;

// Controller responsável pelo login dos usuários
@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UsuarioService usuarioService;
    private final JwtEncoder jwtEncoder;

    // Recebe os serviços necessários para autenticar e gerar o token
    public LoginController(UsuarioService usuarioService, JwtEncoder jwtEncoder) {
        this.usuarioService = usuarioService;
        this.jwtEncoder = jwtEncoder;
    }

    // Recebe email e senha, autentica o usuário e gera o token JWT
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {

        Usuario usuario = usuarioService.autenticar(
                loginRequest.getEmail(),
                loginRequest.getSenha()
        );

        Instant agora = Instant.now();

        // Define as informações que serão armazenadas dentro do token
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("sia-backend")
                .issuedAt(agora)
                .expiresAt(agora.plusSeconds(3600))
                .subject(usuario.getEmail())
                .claim("id", usuario.getId())
                .claim("nome", usuario.getNome())
                .claim("perfil", usuario.getPerfil())
                .build();

        // Gera o token JWT
        String token = jwtEncoder
                .encode(JwtEncoderParameters.from(claims))
                .getTokenValue();

        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                token
        );
    }

    // Dados recebidos na tentativa de login
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

    // Dados devolvidos depois de um login realizado com sucesso
    public static class LoginResponse {

        private final Long id;
        private final String nome;
        private final String email;
        private final String perfil;
        private final String token;

        public LoginResponse(Long id, String nome, String email, String perfil, String token) {
            this.id = id;
            this.nome = nome;
            this.email = email;
            this.perfil = perfil;
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

        public String getToken() {
            return token;
        }
    }
}