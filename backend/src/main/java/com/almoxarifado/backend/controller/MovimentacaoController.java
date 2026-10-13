package com.almoxarifado.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.almoxarifado.backend.model.Movimentacao;
import com.almoxarifado.backend.service.MovimentacaoService;

// Controla as rotas das movimentações
@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    // Recebe o service das movimentações
    public MovimentacaoController(
            MovimentacaoService movimentacaoService) {

        this.movimentacaoService = movimentacaoService;
    }

    // Lista todas as movimentações
    @GetMapping("/listar")
    public List<Movimentacao> listarTodos() {

        return movimentacaoService.listarTodos();
    }

    // Registra entrada ou saída normal
    @PostMapping("/registrar")
    public Movimentacao registrar(
            @RequestBody Movimentacao movimentacao) {

        return movimentacaoService.registrar(movimentacao);
    }

    // Lista as requisições permitidas para o usuário logado
    @GetMapping("/requisicoes")
    public List<Movimentacao> listarRequisicoes(
            @AuthenticationPrincipal Jwt jwt) {

        Number usuarioLogadoId = jwt.getClaim("id");
        String perfil = jwt.getClaimAsString("perfil");

        return movimentacaoService.listarTodos()
                .stream()
                .filter(movimentacao -> "REQUISICAO".equalsIgnoreCase(
                        movimentacao.getTipo()))
                .filter(movimentacao -> {

                    // Administrador pode visualizar todas
                    if ("admin".equals(perfil)) {
                        return true;
                    }

                    // Usuário comum visualiza somente as próprias
                    return usuarioLogadoId != null
                            && movimentacao.getUsuarioId() != null
                            && movimentacao.getUsuarioId().longValue() == usuarioLogadoId.longValue();
                })
                .toList();
    }

    // Cria uma nova requisição
    @PostMapping("/requisicoes")
    public Movimentacao criarRequisicao(
            @RequestBody Movimentacao movimentacao,
            @AuthenticationPrincipal Jwt jwt) {

        Number usuarioLogadoId = jwt.getClaim("id");

        if (usuarioLogadoId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não identificado");
        }

        // Usa o ID do próprio token
        movimentacao.setUsuarioId(
                usuarioLogadoId.longValue());

        return movimentacaoService
                .criarRequisicao(movimentacao);
    }

    // Altera o status de uma requisição
    @PutMapping("/requisicoes/{id}/status")
    public Movimentacao alterarStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        // Somente administrador pode alterar o status
        validarAdmin(jwt);

        return movimentacaoService.alterarStatus(
                id,
                request.getStatus());
    }

    // Verifica se o usuário é administrador
    private void validarAdmin(Jwt jwt) {

        String perfil = jwt.getClaimAsString("perfil");

        if (!"admin".equals(perfil)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Acesso permitido somente para administradores");
        }
    }

    // Recebe o novo status enviado pelo frontend
    public static class StatusRequest {

        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}