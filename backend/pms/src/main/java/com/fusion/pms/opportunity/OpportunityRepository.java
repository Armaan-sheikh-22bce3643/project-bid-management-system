package com.fusion.pms.opportunity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByArchivedFalse();

    List<Opportunity> findByStatusAndArchivedFalse(String status);

    List<Opportunity> findByPriorityAndArchivedFalse(String priority);

    List<Opportunity> findByCategoryAndArchivedFalse(String category);

    List<Opportunity> findByStatusAndPriorityAndArchivedFalse(String status, String priority);

    List<Opportunity> findByStatusAndCategoryAndArchivedFalse(String status, String category);

    List<Opportunity> findByPriorityAndCategoryAndArchivedFalse(String priority, String category);

    List<Opportunity> findByStatusAndPriorityAndCategoryAndArchivedFalse(String status, String priority, String category);

    List<Opportunity> findByArchivedTrue();

    List<Opportunity> findTop5ByArchivedFalseOrderByIdDesc();

    

    long countByArchivedFalse();

    long countByArchivedTrue();

    long countByStatusAndArchivedFalse(String status);
}