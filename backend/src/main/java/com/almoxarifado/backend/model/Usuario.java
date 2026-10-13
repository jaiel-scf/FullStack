package com.almoxarifado.backend.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Representa um usuário do sistema
@Entity
@Table(name = "usuario")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;

	private String email;

	@Column(name = "senha_hash")
	private String senhaHash;

	private String perfil;

	private Boolean ativo;

	@Column(name = "primeiro_acesso")
	private Boolean primeiroAcesso;

	@Column(name = "token_redefinicao")
	private String tokenRedefinicao;

	@Column(name = "token_expira_em")
	private Instant tokenExpiraEm;

	public Usuario() {
	}

	public Usuario(
			String nome,
			String email,
			String senhaHash,
			String perfil,
			Boolean ativo,
			Boolean primeiroAcesso) {

		this.nome = nome;
		this.email = email;
		this.senhaHash = senhaHash;
		this.perfil = perfil;
		this.ativo = ativo;
		this.primeiroAcesso = primeiroAcesso;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenhaHash() {
		return senhaHash;
	}

	public void setSenhaHash(String senhaHash) {
		this.senhaHash = senhaHash;
	}

	public String getPerfil() {
		return perfil;
	}

	public void setPerfil(String perfil) {
		this.perfil = perfil;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	public Boolean getPrimeiroAcesso() {
		return primeiroAcesso;
	}

	public void setPrimeiroAcesso(Boolean primeiroAcesso) {
		this.primeiroAcesso = primeiroAcesso;
	}

	public String getTokenRedefinicao() {
		return tokenRedefinicao;
	}

	public void setTokenRedefinicao(String tokenRedefinicao) {
		this.tokenRedefinicao = tokenRedefinicao;
	}

	public Instant getTokenExpiraEm() {
		return tokenExpiraEm;
	}

	public void setTokenExpiraEm(Instant tokenExpiraEm) {
		this.tokenExpiraEm = tokenExpiraEm;
	}
}