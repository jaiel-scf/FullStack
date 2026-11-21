
package com.almoxarifado.backend.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import jakarta.persistence.Transient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Entidade que representa as movimentações do sistema
@Entity
@Table(name = "movimentacoes")
public class Movimentacao {

    // Identificador único da movimentação
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Produto relacionado à movimentação
    @Column(name = "produto_id")
    private Long produtoId;

    // Usuário relacionado à movimentação
    @Column(name = "usuario_id")
    private Long usuarioId;

    // Tipo da movimentação
    @Column(name = "tipo")
    private String tipo;

    // Quantidade movimentada
    @Column(name = "quantidade")
    private Long quantidade;

    // Data em que a movimentação foi criada
    @Column(name = "data_movimentacao")
    private Date dataMovimentacao;

    // Observação da movimentação
    @Column(name = "observacao")
    private String observacao;

    // Código da requisição
    @Column(name = "codigo")
    private String codigo;

    // Status atual da requisição
    @Column(name = "status")
    private String status;

    // Data da última atualização
    @Column(name = "data_atualizada")
    private Date dataAtualizada;

    // Valor unitário de aquisição
    @Column(name = "valor_unitario", precision = 14, scale = 4)
    private BigDecimal valorUnitario;

    @Transient
    private List<RequisicaoItem> itens;

    public List<RequisicaoItem> getItens() { return itens; }
    public void setItens(List<RequisicaoItem> itens) { this.itens = itens; }

    // Construtor vazio usado pelo JPA
    public Movimentacao() {
    }

    // Construtor para criar uma movimentação
    public Movimentacao(
            Long produtoId,
            Long usuarioId,
            String tipo,
            Long quantidade,
            Date dataMovimentacao,
            String observacao) {

        this.produtoId = produtoId;
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.dataMovimentacao = dataMovimentacao;
        this.observacao = observacao;
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

    public Date getDataMovimentacao() {
        return dataMovimentacao;
    }

    public void setDataMovimentacao(Date dataMovimentacao) {
        this.dataMovimentacao = dataMovimentacao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDataAtualizada() {
        return dataAtualizada;
    }

    public void setDataAtualizada(Date dataAtualizada) {
        this.dataAtualizada = dataAtualizada;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }
}
