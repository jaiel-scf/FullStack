package com.almoxarifado.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Entidade que representa os produtos
@Entity
@Table(name = "produtos")
public class Produto {

    // Identificador do produto
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do produto
    @Column(name = "nome")
    private String nome;

    // Descrição do produto
    @Column(name = "descricao")
    private String descricao;

    // Código/SKU do produto
    @Column(name = "codigo")
    private String codigo;

    // Localização do produto
    @Column(name = "localizacao")
    private String localizacao;

    // Quantidade atual
    @Column(name = "quantidade")
    private Long quantidade;

    // Unidade de medida
    @Column(name = "unidade_medida")
    private String unidadeMedida;

    // Estoque mínimo
    @Column(name = "estoque_minimo")
    private Long estoqueMinimo;

    // Indica se o produto está ativo
    @Column(name = "ativo")
    private Boolean ativo = true;

    // Construtor vazio
    public Produto() {
    }

    // Construtor para criar produto
    public Produto(
            String nome,
            String descricao,
            String codigo,
            String localizacao,
            Long quantidade,
            String unidadeMedida,
            Long estoqueMinimo) {

        this.nome = nome;
        this.descricao = descricao;
        this.codigo = codigo;
        this.localizacao = localizacao;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.estoqueMinimo = estoqueMinimo;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public Long getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Long quantidade) {
        this.quantidade = quantidade;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public Long getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Long estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}