
package com.almoxarifado.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.almoxarifado.backend.model.Movimentacao;
import com.almoxarifado.backend.model.Produto;
import com.almoxarifado.backend.model.RequisicaoItem;
import com.almoxarifado.backend.repository.MovimentacaoRepository;
import com.almoxarifado.backend.repository.ProdutoRepository;
import com.almoxarifado.backend.repository.RequisicaoItemRepository;

@ExtendWith(MockitoExtension.class)
class MovimentacaoServiceTest {

    @Mock
    private MovimentacaoRepository movimentacaoRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private RequisicaoItemRepository requisicaoItemRepository;

    @InjectMocks
    private MovimentacaoService movimentacaoService;

    private Movimentacao requisicao;
    private Produto produtoA;
    private Produto produtoB;

    @BeforeEach
    void prepararDados() {
        requisicao = new Movimentacao();
        requisicao.setId(1L);
        requisicao.setTipo("REQUISICAO");
        requisicao.setStatus("AGUARDANDO");

        produtoA = new Produto();
        produtoA.setId(10L);
        produtoA.setNome("Material A");
        produtoA.setQuantidade(20L);

        produtoB = new Produto();
        produtoB.setId(20L);
        produtoB.setNome("Material B");
        produtoB.setQuantidade(15L);
    }

    private RequisicaoItem criarItem(
            Long produtoId, Long quantidade) {

        RequisicaoItem item = new RequisicaoItem();
        item.setProdutoId(produtoId);
        item.setQuantidade(quantidade);
        return item;
    }

    private void prepararRepositorios() {
        when(movimentacaoRepository.buscarPorIdComBloqueio(1L))
                .thenReturn(Optional.of(requisicao));

        when(requisicaoItemRepository.findByRequisicaoId(1L))
                .thenReturn(List.of(
                        criarItem(10L, 5L),
                        criarItem(20L, 3L)));
    }

    @Test
    void deveAutorizarTodosOsProdutosQuandoHaEstoque() {
        prepararRepositorios();

        when(produtoRepository.buscarPorIdComBloqueio(10L))
                .thenReturn(Optional.of(produtoA));

        when(produtoRepository.buscarPorIdComBloqueio(20L))
                .thenReturn(Optional.of(produtoB));

        when(movimentacaoRepository.save(any(Movimentacao.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Movimentacao resultado = movimentacaoService.alterarStatus(1L, "AUTORIZADO");

        assertEquals("AUTORIZADO", resultado.getStatus());
        assertEquals(15L, produtoA.getQuantidade());
        assertEquals(12L, produtoB.getQuantidade());

        verify(produtoRepository).saveAll(any());
    }

    @Test
    void naoDeveDescontarNenhumProdutoSeFaltarEstoque() {
        prepararRepositorios();

        produtoB.setQuantidade(1L);

        when(produtoRepository.buscarPorIdComBloqueio(10L))
                .thenReturn(Optional.of(produtoA));

        when(produtoRepository.buscarPorIdComBloqueio(20L))
                .thenReturn(Optional.of(produtoB));

        RuntimeException erro = assertThrows(
                RuntimeException.class,
                () -> movimentacaoService.alterarStatus(
                        1L, "AUTORIZADO"));

        assertTrue(erro.getMessage().contains("Estoque insuficiente"));

        assertEquals(20L, produtoA.getQuantidade());
        assertEquals(1L, produtoB.getQuantidade());
        assertEquals("AGUARDANDO", requisicao.getStatus());

        verify(produtoRepository, never()).saveAll(any());
        verify(movimentacaoRepository, never()).save(any());
    }

    @Test
    void naoDeveAutorizarNovamenteRequisicaoAutorizada() {
        requisicao.setStatus("AUTORIZADO");

        when(movimentacaoRepository.buscarPorIdComBloqueio(1L))
                .thenReturn(Optional.of(requisicao));

        assertThrows(
                RuntimeException.class,
                () -> movimentacaoService.alterarStatus(
                        1L, "AUTORIZADO"));

        verifyNoInteractions(
                produtoRepository,
                requisicaoItemRepository);

        verify(movimentacaoRepository, never()).save(any());
    }
}
