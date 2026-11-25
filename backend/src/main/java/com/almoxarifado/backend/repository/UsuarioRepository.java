package com.almoxarifado.backend.repository;

import java.util.Optional;
import java.util.List;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almoxarifado.backend.model.Usuario;

// Repositório responsável por acessar os usuários no banco
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca um usuário pelo e-mail
    Optional<Usuario> findByEmail(String email);

    // Busca um usuário pelo token de redefinição
    Optional<Usuario> findByTokenRedefinicao(String tokenRedefinicao);
    // Bloqueia os registros de usuários durante alterações administrativas.
    // Deve ser chamada dentro de uma transação, antes de consultar ou alterar usuários.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from Usuario u order by u.id")
    List<Usuario> bloquearUsuariosParaEdicao();
}
