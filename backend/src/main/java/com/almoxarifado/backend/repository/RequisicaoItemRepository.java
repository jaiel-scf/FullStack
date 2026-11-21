package com.almoxarifado.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.almoxarifado.backend.model.RequisicaoItem;

public interface RequisicaoItemRepository extends JpaRepository<RequisicaoItem, Long> {
    List<RequisicaoItem> findByRequisicaoId(Long requisicaoId);
    List<RequisicaoItem> findByRequisicaoIdIn(List<Long> requisicaoIds);
}
