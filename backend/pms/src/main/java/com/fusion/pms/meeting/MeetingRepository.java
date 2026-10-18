package com.fusion.pms.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByArchivedFalse();

    List<Meeting> findByArchivedTrue();

    List<Meeting> findByDecisionAndArchivedFalse(String decision);

    List<Meeting> findTop5ByArchivedFalseOrderByIdDesc();

    long countByArchivedFalse();

    long countByArchivedTrue();

    long countByDecisionAndArchivedFalse(String decision);
}