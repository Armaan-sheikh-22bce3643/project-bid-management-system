package com.fusion.pms.dashboard;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fusion.pms.bid.BidRepository;
import com.fusion.pms.bid.BidResponse;
import com.fusion.pms.irf.IrfRepository;
import com.fusion.pms.meeting.MeetingRepository;
import com.fusion.pms.meeting.MeetingResponse;
import com.fusion.pms.opportunity.OpportunityRepository;
import com.fusion.pms.opportunity.OpportunityResponse;
import com.fusion.pms.opportunity.OwnerSummaryResponse;
import com.fusion.pms.project.ProjectRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final OpportunityRepository opportunityRepository;
    private final BidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final MeetingRepository meetingRepository;
    private final IrfRepository irfRepository;

    public DashboardController(OpportunityRepository opportunityRepository,
                               BidRepository bidRepository,
                               ProjectRepository projectRepository,
                               MeetingRepository meetingRepository,
                               IrfRepository irfRepository) {
        this.opportunityRepository = opportunityRepository;
        this.bidRepository = bidRepository;
        this.projectRepository = projectRepository;
        this.meetingRepository = meetingRepository;
        this.irfRepository = irfRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        long activeOpportunities = opportunityRepository.countByArchivedFalse();
        long archivedOpportunities = opportunityRepository.countByArchivedTrue();
        long openOpportunities = opportunityRepository.countByStatusAndArchivedFalse("Open");

        long activeBids = bidRepository.countByArchivedFalse();
        long archivedBids = bidRepository.countByArchivedTrue();
        long wonBids = bidRepository.countByOutcomeAndArchivedFalse("WON");
        long lostBids = bidRepository.countByOutcomeAndArchivedFalse("LOST");

        long activeProjects = projectRepository.countByArchivedFalse();
        long archivedProjects = projectRepository.countByArchivedTrue();
        long plannedProjects = projectRepository.countByStatusAndArchivedFalse("PLANNED");
        long runningProjects = projectRepository.countByStatusAndArchivedFalse("ACTIVE");
        long completedProjects = projectRepository.countByStatusAndArchivedFalse("COMPLETED");

        long activeMeetings = meetingRepository.countByArchivedFalse();
        long archivedMeetings = meetingRepository.countByArchivedTrue();
        long proceedMeetings = meetingRepository.countByDecisionAndArchivedFalse("PROCEED");

        return new DashboardSummaryResponse(
                activeOpportunities,
                archivedOpportunities,
                openOpportunities,
                activeBids,
                archivedBids,
                wonBids,
                lostBids,
                activeProjects,
                archivedProjects,
                plannedProjects,
                runningProjects,
                completedProjects,
                activeMeetings,
                archivedMeetings,
                proceedMeetings
        );
    }

    @GetMapping("/recent")
    public DashboardRecentResponse getRecent() {

        List<OpportunityResponse> recentOpportunities = opportunityRepository
                .findTop5ByArchivedFalseOrderByIdDesc()
                .stream()
                .map(opportunity -> new OpportunityResponse(
                        opportunity.getId(),
                        opportunity.getTitle(),
                        opportunity.getDescription(),
                        opportunity.getCategory(),
                        opportunity.getClientName(),
                        opportunity.getBidRoute(),
                        opportunity.getEstimatedCost(),
                        opportunity.getPriority(),
                        opportunity.getStatus(),
                        opportunity.getRemarks(),
                        opportunity.getMiscellaneous(),
                        opportunity.getArchived(),
                        new OwnerSummaryResponse(
                                opportunity.getOwner().getId(),
                                opportunity.getOwner().getFullName(),
                                opportunity.getOwner().getEmail()
                        )
                ))
                .toList();

        List<BidResponse> recentBids = bidRepository
                .findTop5ByArchivedFalseOrderByIdDesc()
                .stream()
                .map(bid -> new BidResponse(
                        bid.getId(),
                        bid.getTenderNo(),
                        bid.getDescription(),
                        bid.getClientName(),
                        bid.getBidDecision(),
                        bid.getSubmissionDate(),
                        bid.getPriority(),
                        bid.getFinalReviewApprovalDate(),
                        bid.getTenderedValue(),
                        bid.getOutcome(),
                        bid.getRemark(),
                        bid.getArchived(),
                        new OwnerSummaryResponse(
                                bid.getOwner().getId(),
                                bid.getOwner().getFullName(),
                                bid.getOwner().getEmail()
                        )
                ))
                .toList();

        List<MeetingResponse> recentMeetings = meetingRepository
                .findTop5ByArchivedFalseOrderByIdDesc()
                .stream()
                .map(meeting -> new MeetingResponse(
                        meeting.getId(),
                        meeting.getTitle(),
                        meeting.getMeetingDateTime(),
                        meeting.getAttendees(),
                        meeting.getAgenda(),
                        meeting.getNotes(),
                        meeting.getDecision(),
                        meeting.getNextAction(),
                        meeting.getArchived(),
                        meeting.getOpportunity() != null ? meeting.getOpportunity().getId() : null,
                        meeting.getBid() != null ? meeting.getBid().getId() : null,
                        new OwnerSummaryResponse(
                                meeting.getOwner().getId(),
                                meeting.getOwner().getFullName(),
                                meeting.getOwner().getEmail()
                        )
                ))
                .toList();

        return new DashboardRecentResponse(
                recentOpportunities,
                recentBids,
                recentMeetings
        );
    }

    @GetMapping("/analytics")
    public DashboardAnalyticsResponse getAnalytics() {

        long wonBids = bidRepository.countByOutcomeAndArchivedFalse("WON");
        long lostBids = bidRepository.countByOutcomeAndArchivedFalse("LOST");
        long pendingBids = bidRepository.countByOutcomeAndArchivedFalse("PENDING");

        long plannedProjects = projectRepository.countByStatusAndArchivedFalse("PLANNED");
        long activeProjects = projectRepository.countByStatusAndArchivedFalse("ACTIVE");
        long onHoldProjects = projectRepository.countByStatusAndArchivedFalse("ON_HOLD");
        long completedProjects = projectRepository.countByStatusAndArchivedFalse("COMPLETED");

        return new DashboardAnalyticsResponse(
                wonBids,
                lostBids,
                pendingBids,
                plannedProjects,
                activeProjects,
                onHoldProjects,
                completedProjects
        );
    }

    @GetMapping("/irf-summary")
    public IrfDashboardSummaryResponse getIrfSummary() {
        long totalActiveIrfs = irfRepository.countByArchivedFalse();
        long archivedIrfs = irfRepository.countByArchivedTrue();
        long pendingIrfs = irfRepository.countByStatusAndArchivedFalse("PENDING");
        long approvedIrfs = irfRepository.countByStatusAndArchivedFalse("APPROVED");
        long rejectedIrfs = irfRepository.countByStatusAndArchivedFalse("REJECTED");

        long managerPendingIrfs = irfRepository.countByApprovalLevelAndStatusAndArchivedFalse("MANAGER", "PENDING");
        long financePendingIrfs = irfRepository.countByApprovalLevelAndStatusAndArchivedFalse("FINANCE", "PENDING");

        return new IrfDashboardSummaryResponse(
                totalActiveIrfs,
                archivedIrfs,
                pendingIrfs,
                approvedIrfs,
                rejectedIrfs,
                managerPendingIrfs,
                financePendingIrfs
        );
    }
}