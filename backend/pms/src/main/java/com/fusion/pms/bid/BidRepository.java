package com.fusion.pms.bid;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByArchivedFalse();

    List<Bid> findByArchivedTrue();

    List<Bid> findByPriorityAndArchivedFalse(String priority);

    List<Bid> findByOutcomeAndArchivedFalse(String outcome);

    List<Bid> findByBidDecisionAndArchivedFalse(String bidDecision);

    List<Bid> findByPriorityAndOutcomeAndArchivedFalse(String priority, String outcome);

    List<Bid> findTop5ByArchivedFalseOrderByIdDesc();

    long countByArchivedFalse();

    long countByArchivedTrue();

    long countByOutcomeAndArchivedFalse(String outcome);
}