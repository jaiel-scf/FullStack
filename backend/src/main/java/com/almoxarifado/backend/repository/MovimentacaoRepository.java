package com.almoxarifado.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.almoxarifado.backend.model.Movimentacao;

// Repositorio responsavel por acessar as movimentações no banco
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    
}    
