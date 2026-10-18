package com.fusion.pms.project;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByArchivedFalse();

    List<Project> findByArchivedTrue();

    Optional<Project> findByBidId(Long bidId);

    long countByArchivedFalse();

    long countByArchivedTrue();

    long countByStatusAndArchivedFalse(String status);
}