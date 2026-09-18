package com.almoxarifado.backend.service;

import com.almoxarifado.backend.model.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.almoxarifado.backend.repository.UsuarioRepository;

// Contém as regras de negócio relacionadas aos usuários
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Recebe o repositório de usuários e o responsável pela proteção das senhas
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Verifica se o email e a senha informados pertencem a um usuário válido
public Usuario autenticar(String email, String senha) {

    // Busca o usuário pelo email informado
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Email ou senha inválidos"
        ));

    // Impede o acesso de usuários desativados
    if (Boolean.FALSE.equals(usuario.getAtivo())) {
        throw new RuntimeException("Usuário inativo");
    }

    // Verifica se o usuário já possui uma senha cadastrada
    if (usuario.getSenhaHash() == null || usuario.getSenhaHash().isBlank()) {
        throw new RuntimeException("Usuário ainda não possui senha cadastrada");
    }

    // Compara a senha digitada com o hash armazenado no banco
    if (!passwordEncoder.matches(senha, usuario.getSenhaHash())) {
    throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Email ou senha inválidos"
    );
}

    return usuario;
}

// Define uma nova senha para um usuário e salva somente o hash no banco
public Usuario definirSenha(Long id, String senha) {

    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    String senhaHash = passwordEncoder.encode(senha);

    usuario.setSenhaHash(senhaHash);

    return usuarioRepository.save(usuario);
}
}
