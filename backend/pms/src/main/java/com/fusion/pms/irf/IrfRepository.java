package com.fusion.pms.irf;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IrfRepository extends JpaRepository<Irf, Long> {

    List<Irf> findByArchivedFalse();

    List<Irf> findByArchivedTrue();

    List<Irf> findByStatusAndArchivedFalse(String status);

    List<Irf> findByApprovalLevelAndArchivedFalse(String approvalLevel);

    List<Irf> findByRequestedByIdAndArchivedFalse(Long requestedById);

    long countByArchivedFalse();

    long countByArchivedTrue();

    long countByStatusAndArchivedFalse(String status);

    long countByApprovalLevelAndStatusAndArchivedFalse(String approvalLevel, String status);
}