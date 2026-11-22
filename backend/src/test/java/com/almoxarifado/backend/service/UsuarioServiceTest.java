package com.almoxarifado.backend.service;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Test
    void excluirDadosPessoaisAnonimizaContaSemAlterarIdentificador() {
        UsuarioRepository repositorio = mock(UsuarioRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        EmailService email = mock(EmailService.class);
        UsuarioService servico = new UsuarioService(repositorio, encoder, email);

        Usuario usuario = new Usuario();
        usuario.setId(42L);
        usuario.setNome("Nome original");
        usuario.setEmail("pessoa@example.com");
        usuario.setSenhaHash("hash-antigo");
        usuario.setAtivo(true);
        usuario.setPrimeiroAcesso(true);
        usuario.setTokenRedefinicao("token-antigo");

        when(repositorio.findById(42L)).thenReturn(Optional.of(usuario));
        when(encoder.encode(anyString())).thenReturn("hash-inutilizado");

        servico.excluirDadosPessoais(42L);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repositorio).save(captor.capture());
        Usuario salvo = captor.getValue();

        assertEquals(42L, salvo.getId());
        assertEquals("Usuário excluído", salvo.getNome());
        assertEquals("excluido-42@conta-inativa.invalid", salvo.getEmail());
        assertEquals("hash-inutilizado", salvo.getSenhaHash());
        assertFalse(salvo.getAtivo());
        assertFalse(salvo.getPrimeiroAcesso());
        assertNull(salvo.getTokenRedefinicao());
        assertNull(salvo.getTokenExpiraEm());
    }
}
