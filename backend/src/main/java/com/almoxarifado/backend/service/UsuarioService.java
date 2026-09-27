package com.almoxarifado.backend.service;

import com.almoxarifado.backend.model.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.almoxarifado.backend.repository.UsuarioRepository;
import java.util.List;

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
                        "Email ou senha inválidos"));

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
                    "Email ou senha inválidos");
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

    // Cadastra um novo usuário com a senha protegida por BCrypt
    public Usuario cadastrarUsuario(
            String nome,
            String email,
            String senha,
            String perfil) {

        // Não permite dois usuários com o mesmo e-mail
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um usuário com este e-mail");
        }

        // Aceita somente os perfis usados pelo sistema
        if (!perfil.equals("admin") && !perfil.equals("usuario")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Perfil inválido");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(nome);
        usuario.setEmail(email);

        // Protege a senha antes de salvar no banco
        usuario.setSenhaHash(passwordEncoder.encode(senha));

        // Perfil escolhido pelo administrador
        usuario.setPerfil(perfil);

        // Todo novo usuário começa ativo
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    // Lista todos os usuários cadastrados
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Desativa o usuário sem apagar seu histórico do sistema
    public void excluirUsuario(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"));

        usuario.setAtivo(false);

        usuarioRepository.save(usuario);
    }
}
