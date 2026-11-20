
package com.almoxarifado.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final ImagemService imagemService;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            ImagemService imagemService) {
        this.produtoRepository = produtoRepository;
        this.imagemService = imagemService;
    }

    // Lista somente produtos ativos
    public List<Produto> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .filter(produto -> produto.getAtivo() == null || produto.getAtivo())
                .toList();
    }

    // Salva um produto
    public Produto salvar(Produto produto) {

        if (produto.getNome() != null) {
            produto.setNome(produto.getNome().trim().toUpperCase(java.util.Locale.forLanguageTag("pt-BR")));
        }

        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }

        return produtoRepository.save(produto);
    }

    // Busca produto pelo ID
    public Optional<Produto> buscaPorId(Long id) {
        return produtoRepository.findById(id);
    }

    // Edita os dados do produto
    public Produto editar(Long id, Produto dadosProduto) {

        Produto produto = buscarProduto(id);

        produto.setNome(dadosProduto.getNome() == null ? null : dadosProduto.getNome().trim().toUpperCase(java.util.Locale.forLanguageTag("pt-BR")));
        produto.setCodigo(dadosProduto.getCodigo());
        produto.setDescricao(dadosProduto.getDescricao());
        produto.setLocalizacao(dadosProduto.getLocalizacao());
        produto.setUnidadeMedida(dadosProduto.getUnidadeMedida());
        produto.setEstoqueMinimo(dadosProduto.getEstoqueMinimo());

        return produtoRepository.save(produto);
    }

    // Envia ou substitui a imagem do produto
    public Produto salvarImagem(Long id, MultipartFile arquivo) throws IOException {

        Produto produto = buscarProduto(id);

        String imagemAnterior = produto.getImagemCaminho();
        String novaImagem = imagemService.salvar(arquivo);

        produto.setImagemCaminho(novaImagem);

        Produto produtoSalvo = produtoRepository.save(produto);

        if (imagemAnterior != null && !imagemAnterior.isBlank()) {
            imagemService.excluir(imagemAnterior);
        }

        return produtoSalvo;
    }

    // Remove a imagem do produto
    public Produto removerImagem(Long id) throws IOException {

        Produto produto = buscarProduto(id);

        String imagemAnterior = produto.getImagemCaminho();

        produto.setImagemCaminho(null);

        Produto produtoSalvo = produtoRepository.save(produto);

        if (imagemAnterior != null && !imagemAnterior.isBlank()) {
            imagemService.excluir(imagemAnterior);
        }

        return produtoSalvo;
    }

    // Busca produto ou retorna erro
    private Produto buscarProduto(Long id) {

        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
    }

    // Inativa um produto
    public Produto inativar(Long id) {

        Produto produto = buscarProduto(id);

        produto.setAtivo(false);

        return produtoRepository.save(produto);
    }
}
