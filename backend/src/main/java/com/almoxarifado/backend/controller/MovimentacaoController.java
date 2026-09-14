package com.almoxarifado.backend.controller;

import java.util.List;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.almoxarifado.backend.model.Movimentacao;

import com.almoxarifado.backend.service.MovimentacaoService;

// Indica que esta classe recebe requisições HTTP
@RestController

// Define que todas as rotas desta classe começam com /movimentacoes
@RequestMapping("/movimentacoes")

public class MovimentacaoController {
    // Serviço usado para acessar as regras de negócio das movimentações
    private final MovimentacaoService movimentacaoService;

    // Recebe o MovimentacaoService para usar os métodos de movimentação
    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
}

// Retorna todas as movimentações cadastradas
@GetMapping
public List<Movimentacao> listarTodos() {
    return movimentacaoService.listarTodos();
}

// Registra uma nova movimentação de entrada ou saída
@PostMapping
public Movimentacao registrar(@RequestBody Movimentacao movimentacao) {
    return movimentacaoService.registrar(movimentacao);
}
    
}
