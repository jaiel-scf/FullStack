package com.almoxarifado.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.OffsetDateTime;

// Indica que esta classe representa uma entidade do banco de dados.
@Entity

// Define que esta classe está ligada à tabela movimentacoes.
@Table(name = "movimentacoes")

public class Movimentacao {

    // Identificador único automatico da movimentação.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID do produto relacionado à movimentação.
    @Column(name = "produto_id", nullable = false)
    private Long produtoId;

    // ID do usuário que realizou a movimentação.
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    // Define se a movimentação é uma entrada ou uma saída de estoque.
    @Column(nullable = false)
    private String tipo;

    // Quantidade de itens movimentados.
    @Column(nullable = false)
    private Long quantidade;

    // Observação opcional sobre a movimentação.
    private String observacao;

    // Data e hora em que a movimentação foi realizada.
    @Column(name = "data_movimentacao")
    private OffsetDateTime dataMovimentacao;

    // Construtor vazio exigido pelo JPA
    public Movimentacao() {
        
    }

// Construtor usado para criar uma nova movimentação
public Movimentacao(Long produtoId, Long usuarioId, String tipo, Long quantidade, String observacao,
        OffsetDateTime dataMovimentacao) {

    this.produtoId = produtoId;
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.quantidade = quantidade;
    this.observacao = observacao;
    this.dataMovimentacao = dataMovimentacao;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Long quantidade) {
        this.quantidade = quantidade;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public OffsetDateTime getDataMovimentacao() {
        return dataMovimentacao;
    }

    public void setDataMovimentacao(OffsetDateTime dataMovimentacao) {
        this.dataMovimentacao = dataMovimentacao;
    }

    
}
