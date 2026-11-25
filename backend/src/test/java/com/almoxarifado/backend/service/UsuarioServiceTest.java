package com.almoxarifado.backend.service;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.repository.UsuarioRepository;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {
    private UsuarioRepository repository;
    private UsuarioService service;
    private Usuario admin;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        repository = mock(UsuarioRepository.class);
        service = new UsuarioService(repository, mock(PasswordEncoder.class), mock(EmailService.class));
        admin = criar(1L, "admin", true);
        usuario = criar(2L, "usuario", true);
        when(repository.bloquearUsuariosParaEdicao()).thenReturn(List.of(admin, usuario));
    }

    private Usuario criar(Long id, String perfil, boolean ativo) {
        Usuario u = new Usuario("Teste", "teste" + id + "@example.com", "hash-teste", perfil, ativo, true);
        u.setId(id);
        return u;
    }

    @Test
    void promovePreservandoSenhaEPrimeiroAcesso() {
        when(repository.save(usuario)).thenReturn(usuario);
        Usuario resultado = service.editarUsuario(2L, 1L, " Novo nome ", " NOVO@example.com ", "admin", true);
        assertEquals(2L, resultado.getId());
        assertEquals("Novo nome", resultado.getNome());
        assertEquals("novo@example.com", resultado.getEmail());
        assertEquals("admin", resultado.getPerfil());
        assertEquals("hash-teste", resultado.getSenhaHash());
        assertTrue(resultado.getPrimeiroAcesso());
    }

    @Test
    void rejeitaEmailDuplicado() {
        assertEquals(HttpStatus.CONFLICT, assertThrows(ResponseStatusException.class,
                () -> service.editarUsuario(2L, 1L, "Teste", "TESTE1@example.com", "usuario", true)).getStatusCode());
        verify(repository, never()).save(any());
    }

    @Test
    void rejeitaEdicaoDaPropriaConta() {
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ResponseStatusException.class,
                () -> service.editarUsuario(1L, 1L, "Teste", admin.getEmail(), "usuario", true)).getStatusCode());
        verify(repository, never()).save(any());
    }

    @Test
    void rejeitaOperadorSemPermissao() {
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ResponseStatusException.class,
                () -> service.editarUsuario(1L, 2L, "Teste", admin.getEmail(), "usuario", true)).getStatusCode());
        verify(repository, never()).save(any());
    }

    @Test
    void impedeExcluirUltimoAdministrador() {
        assertEquals(HttpStatus.CONFLICT, assertThrows(ResponseStatusException.class,
                () -> service.excluirUsuario(1L)).getStatusCode());
        assertTrue(admin.getAtivo());
        verify(repository, never()).save(any());
    }

    @Test
    void inativaEReativaPreservandoSenha() {
        usuario.setTokenRedefinicao("token-teste");
        usuario.setTokenExpiraEm(Instant.now().plusSeconds(180));
        when(repository.save(usuario)).thenReturn(usuario);
        service.editarUsuario(2L, 1L, usuario.getNome(), usuario.getEmail(), "usuario", false);
        assertFalse(usuario.getAtivo());
        assertNull(usuario.getTokenRedefinicao());
        assertNull(usuario.getTokenExpiraEm());
        service.editarUsuario(2L, 1L, usuario.getNome(), usuario.getEmail(), "usuario", true);
        assertTrue(usuario.getAtivo());
        assertEquals("hash-teste", usuario.getSenhaHash());
    }

    @Test
    void rejeitaPerfilInvalido() {
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ResponseStatusException.class,
                () -> service.editarUsuario(2L, 1L, "Teste", usuario.getEmail(), "outro", true)).getStatusCode());
        verify(repository, never()).save(any());
    }
}
