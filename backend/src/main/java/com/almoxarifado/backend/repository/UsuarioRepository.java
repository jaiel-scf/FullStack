package com.almoxarifado.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.almoxarifado.backend.model.Usuario;

// Repositório responsável por acessar os usuários no banco
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    // Busca um usuário pelo email
    Optional<Usuario> findByEmail(String email);
    
}
