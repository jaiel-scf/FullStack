package com.almoxarifado.backend.config;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {

    @Test
    void tokenDeContaInativaDeveSerRejeitado() {
        UsuarioRepository repositorio = mock(UsuarioRepository.class);
        SecurityConfig configuracao = new SecurityConfig(repositorio);
        byte[] chave = "uma-chave-de-testes-com-32-bytes!".getBytes(java.nio.charset.StandardCharsets.UTF_8);
        ReflectionTestUtils.setField(configuracao, "jwtSecret", Base64.getEncoder().encodeToString(chave));

        Usuario usuario = new Usuario();
        usuario.setId(42L);
        usuario.setEmail("usuario@example.com");
        usuario.setAtivo(false);
        when(repositorio.findById(42L)).thenReturn(Optional.of(usuario));

        var encoder = NimbusJwtEncoder.withSecretKey(new SecretKeySpec(chave, "HmacSHA256")).build();
        var claims = JwtClaimsSet.builder()
                .subject("usuario@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(600))
                .claim("id", 42L)
                .build();
        String token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        JwtDecoder decoder = configuracao.jwtDecoder();

        assertThrows(org.springframework.security.oauth2.jwt.JwtException.class, () -> decoder.decode(token));
    }

    @Test
    void tokenDeContaAtivaDeveSerAceito() {
        UsuarioRepository repositorio = mock(UsuarioRepository.class);
        SecurityConfig configuracao = new SecurityConfig(repositorio);
        byte[] chave = "uma-chave-de-testes-com-32-bytes!".getBytes(java.nio.charset.StandardCharsets.UTF_8);
        ReflectionTestUtils.setField(configuracao, "jwtSecret", Base64.getEncoder().encodeToString(chave));

        Usuario usuario = new Usuario();
        usuario.setId(42L);
        usuario.setEmail("usuario@example.com");
        usuario.setAtivo(true);
        when(repositorio.findById(42L)).thenReturn(Optional.of(usuario));

        var encoder = NimbusJwtEncoder.withSecretKey(new SecretKeySpec(chave, "HmacSHA256")).build();
        var claims = JwtClaimsSet.builder()
                .subject("usuario@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(600))
                .claim("id", 42L)
                .build();
        String token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        assertEquals(42L, ((Number) configuracao.jwtDecoder().decode(token).getClaim("id")).longValue());
    }
}
