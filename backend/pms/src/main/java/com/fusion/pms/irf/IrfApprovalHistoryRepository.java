package com.fusion.pms.irf;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IrfApprovalHistoryRepository extends JpaRepository<IrfApprovalHistory, Long> {

    List<IrfApprovalHistory> findByIrfIdOrderByActionAtAsc(Long irfId);
}