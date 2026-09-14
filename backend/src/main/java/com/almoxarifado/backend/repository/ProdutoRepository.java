package com.almoxarifado.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.almoxarifado.backend.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    
}