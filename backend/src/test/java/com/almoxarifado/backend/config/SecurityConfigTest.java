package com.almoxarifado.backend.config;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.repository.UsuarioRepository;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {
    private SecurityConfig config;
    private UsuarioRepository repository;
    private Usuario usuario;
    private JwtDecoder decoder;

    private SecurityConfig configuracao(byte valor) {
        byte[] chave = new byte[32];
        Arrays.fill(chave, valor);
        SecurityConfig c = new SecurityConfig();
        ReflectionTestUtils.setField(c, "jwtSecret", Base64.getEncoder().encodeToString(chave));
        return c;
    }

    @BeforeEach
    void preparar() {
        config = configuracao((byte) 1);
        repository = mock(UsuarioRepository.class);
        usuario = new Usuario("Teste", "teste@example.com", "hash", "admin", true, false);
        usuario.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        decoder = config.jwtDecoder(repository);
    }

    private String token(SecurityConfig origem, Instant expiracao) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("sia-backend")
                .subject("teste@example.com")
                .issuedAt(expiracao.minusSeconds(3600))
                .expiresAt(expiracao)
                .claim("id", 1L)
                .claim("perfil", "admin")
                .build();
        return origem.jwtEncoder().encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }

    private String tokenValido() {
        return token(config, Instant.now().plusSeconds(600));
    }

    @Test
    void aceitaUsuarioAtivo() {
        assertEquals("admin", decoder.decode(tokenValido()).getClaimAsString("perfil"));
    }

    @Test
    void rejeitaUsuarioInativo() {
        String jwt = tokenValido();
        usuario.setAtivo(false);
        assertThrows(JwtException.class, () -> decoder.decode(jwt));
    }

    @Test
    void rejeitaPerfilAlterado() {
        String jwt = tokenValido();
        usuario.setPerfil("usuario");
        assertThrows(JwtException.class, () -> decoder.decode(jwt));
    }

    @Test
    void rejeitaEmailAlterado() {
        String jwt = tokenValido();
        usuario.setEmail("novo@example.com");
        assertThrows(JwtException.class, () -> decoder.decode(jwt));
    }

    @Test
    void rejeitaUsuarioInexistente() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(JwtException.class, () -> decoder.decode(tokenValido()));
    }

    @Test
    void rejeitaTokenExpirado() {
        String jwt = token(config, Instant.now().minusSeconds(300));
        assertThrows(JwtException.class, () -> decoder.decode(jwt));
    }

    @Test
    void rejeitaAssinaturaInvalida() {
        String jwt = token(configuracao((byte) 2), Instant.now().plusSeconds(600));
        assertThrows(JwtException.class, () -> decoder.decode(jwt));
    }
}
