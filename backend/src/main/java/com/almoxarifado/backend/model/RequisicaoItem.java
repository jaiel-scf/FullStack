package com.almoxarifado.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "requisicao_itens")
public class RequisicaoItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "requisicao_id", nullable = false)
    private Long requisicaoId;
    @Column(name = "produto_id", nullable = false)
    private Long produtoId;
    @Column(name = "quantidade", nullable = false)
    private Long quantidade;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRequisicaoId() { return requisicaoId; }
    public void setRequisicaoId(Long requisicaoId) { this.requisicaoId = requisicaoId; }
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    public Long getQuantidade() { return quantidade; }
    public void setQuantidade(Long quantidade) { this.quantidade = quantidade; }
}
