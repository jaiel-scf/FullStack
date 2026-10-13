
package com.almoxarifado.backend.service;

import com.almoxarifado.backend.model.Usuario;
import com.almoxarifado.backend.repository.UsuarioRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Regras relacionadas aos usuários
@Service
public class UsuarioService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final EmailService emailService;

        public UsuarioService(
                        UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder,
                        EmailService emailService) {

                this.usuarioRepository = usuarioRepository;
                this.passwordEncoder = passwordEncoder;
                this.emailService = emailService;
        }

        // Faz a autenticação do usuário
        public Usuario autenticar(String email, String senha) {

                String emailTratado = email.trim().toLowerCase();

                Usuario usuario = usuarioRepository.findByEmail(emailTratado)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "Email ou senha inválidos"));

                if (Boolean.FALSE.equals(usuario.getAtivo())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Usuário inativo");
                }

                if (usuario.getSenhaHash() == null
                                || usuario.getSenhaHash().isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Usuário ainda não possui senha cadastrada");
                }

                if (!passwordEncoder.matches(senha, usuario.getSenhaHash())) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Email ou senha inválidos");
                }

                return usuario;
        }

        // Define uma nova senha
        public Usuario definirSenha(Long id, String senha) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado"));

                usuario.setSenhaHash(passwordEncoder.encode(senha));

                return usuarioRepository.save(usuario);
        }

        // Altera a senha no primeiro acesso
        // A senha padrão já foi conferida no login inicial
        public void alterarSenhaPrimeiroAcesso(
                        Long id,
                        String novaSenha) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado"));

                if (!Boolean.TRUE.equals(usuario.getAtivo())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Usuário inativo");
                }

                // Somente usuários no primeiro acesso podem usar essa rota
                if (!Boolean.TRUE.equals(usuario.getPrimeiroAcesso())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Primeiro acesso já concluído");
                }

                validarNovaSenha(novaSenha);

                // Impede reutilizar a senha padrão
                if (usuario.getSenhaHash() != null
                                && passwordEncoder.matches(
                                                novaSenha, usuario.getSenhaHash())) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "A nova senha deve ser diferente da senha inicial");
                }

                // Salva a senha criptografada
                usuario.setSenhaHash(passwordEncoder.encode(novaSenha));

                // Marca o primeiro acesso como concluído
                usuario.setPrimeiroAcesso(false);

                usuarioRepository.save(usuario);
        }

        // Solicita recuperação de senha por e-mail
        public void solicitarRedefinicaoSenha(String email) {

                if (email == null || email.isBlank()) {
                        return;
                }

                String emailTratado = email.trim().toLowerCase();

                Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(emailTratado);

                // Não revela se o e-mail está cadastrado
                if (usuarioEncontrado.isEmpty()) {
                        return;
                }

                Usuario usuario = usuarioEncontrado.get();

                if (Boolean.FALSE.equals(usuario.getAtivo())) {
                        return;
                }

                // Gera um token temporário
                String token = UUID.randomUUID().toString();

                // O link expira em 3 minutos
                Instant expiracao = Instant.now().plus(
                                3, ChronoUnit.MINUTES);

                usuario.setTokenRedefinicao(token);
                usuario.setTokenExpiraEm(expiracao);

                usuarioRepository.save(usuario);

                // Envia o e-mail
                emailService.enviarEmailRedefinicao(
                                usuario.getEmail(),
                                usuario.getNome(),
                                token);
        }

        // Redefine a senha pelo link recebido no e-mail
        public void redefinirSenhaPorToken(
                        String token,
                        String novaSenha) {

                if (token == null || token.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Token inválido");
                }

                Usuario usuario = usuarioRepository
                                .findByTokenRedefinicao(token)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Link de redefinição inválido"));

                if (Boolean.FALSE.equals(usuario.getAtivo())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Usuário inativo");
                }

                if (usuario.getTokenExpiraEm() == null
                                || usuario.getTokenExpiraEm().isBefore(Instant.now())) {

                        limparTokenRedefinicao(usuario);

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "O link de redefinição expirou");
                }

                validarNovaSenha(novaSenha);

                // Impede utilizar a mesma senha
                if (usuario.getSenhaHash() != null
                                && passwordEncoder.matches(
                                                novaSenha, usuario.getSenhaHash())) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "A nova senha deve ser diferente da senha atual");
                }

                usuario.setSenhaHash(passwordEncoder.encode(novaSenha));

                // Recuperação por e-mail também conclui primeiro acesso
                usuario.setPrimeiroAcesso(false);

                // Impede reutilização do link
                usuario.setTokenRedefinicao(null);
                usuario.setTokenExpiraEm(null);

                usuarioRepository.save(usuario);
        }

        // Valida a nova senha
        private void validarNovaSenha(String novaSenha) {

                if (novaSenha == null || novaSenha.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Informe a nova senha");
                }

                if (novaSenha.length() < 6) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "A senha deve possuir pelo menos 6 caracteres");
                }
        }

        // Limpa token de recuperação
        private void limparTokenRedefinicao(Usuario usuario) {

                usuario.setTokenRedefinicao(null);
                usuario.setTokenExpiraEm(null);

                usuarioRepository.save(usuario);
        }

        // Cadastra ou reativa um usuário
        public Usuario cadastrarUsuario(
                        String nome,
                        String email,
                        String senha,
                        String perfil) {

                if (!"admin".equals(perfil)
                                && !"usuario".equals(perfil)) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Perfil inválido");
                }

                String emailTratado = email.trim().toLowerCase();

                Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(emailTratado);

                if (usuarioExistente.isPresent()) {

                        Usuario usuario = usuarioExistente.get();

                        if (!Boolean.FALSE.equals(usuario.getAtivo())) {
                                throw new ResponseStatusException(
                                                HttpStatus.CONFLICT,
                                                "Já existe um usuário ativo com este e-mail");
                        }

                        // Reativa o usuário
                        usuario.setNome(nome.trim());
                        usuario.setEmail(emailTratado);
                        usuario.setSenhaHash(passwordEncoder.encode(senha));
                        usuario.setPerfil(perfil);
                        usuario.setAtivo(true);
                        usuario.setPrimeiroAcesso(true);
                        usuario.setTokenRedefinicao(null);
                        usuario.setTokenExpiraEm(null);

                        return usuarioRepository.save(usuario);
                }

                // Cria novo usuário
                Usuario usuario = new Usuario();

                usuario.setNome(nome.trim());
                usuario.setEmail(emailTratado);
                usuario.setSenhaHash(passwordEncoder.encode(senha));
                usuario.setPerfil(perfil);
                usuario.setAtivo(true);
                usuario.setPrimeiroAcesso(true);

                return usuarioRepository.save(usuario);
        }

        // Lista os usuários
        public List<Usuario> listarTodos() {
                return usuarioRepository.findAll();
        }

        // Inativa o usuário sem apagar seu histórico
        public void excluirUsuario(Long id) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuário não encontrado"));

                usuario.setAtivo(false);

                // Invalida recuperação pendente
                usuario.setTokenRedefinicao(null);
                usuario.setTokenExpiraEm(null);

                usuarioRepository.save(usuario);
        }
}
