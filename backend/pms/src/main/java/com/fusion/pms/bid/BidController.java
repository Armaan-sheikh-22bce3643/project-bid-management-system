package com.fusion.pms.bid;

import com.fusion.pms.opportunity.OwnerSummaryResponse;
import com.fusion.pms.project.Project;
import com.fusion.pms.project.ProjectRepository;
import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public BidController(BidRepository bidRepository,
                         UserRepository userRepository,
                         ProjectRepository projectRepository) {
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @PostMapping
    public BidResponse createBid(@RequestBody BidRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Bid bid = Bid.builder()
                .tenderNo(request.getTenderNo())
                .description(request.getDescription())
                .clientName(request.getClientName())
                .bidDecision(request.getBidDecision())
                .submissionDate(request.getSubmissionDate())
                .priority(request.getPriority())
                .finalReviewApprovalDate(request.getFinalReviewApprovalDate())
                .tenderedValue(request.getTenderedValue())
                .outcome(request.getOutcome())
                .remark(request.getRemark())
                .owner(owner)
                .build();

        Bid savedBid = bidRepository.save(bid);
        return mapToResponse(savedBid);
    }
 
    @GetMapping
    public List<BidResponse> getAllBids(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String outcome,
            @RequestParam(required = false) String bidDecision
    ) {
        List<Bid> bids;

        if (priority != null && outcome != null) {
            bids = bidRepository.findByPriorityAndOutcomeAndArchivedFalse(priority, outcome);
        } else if (priority != null) {
            bids = bidRepository.findByPriorityAndArchivedFalse(priority);
        } else if (outcome != null) {
            bids = bidRepository.findByOutcomeAndArchivedFalse(outcome);
        } else if (bidDecision != null) {
            bids = bidRepository.findByBidDecisionAndArchivedFalse(bidDecision);
        } else {
            bids = bidRepository.findByArchivedFalse();
        }

        return bids.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/archived")
    public List<BidResponse> getArchivedBids() {
        return bidRepository.findByArchivedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public BidResponse getBidById(@PathVariable Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        return mapToResponse(bid);
    }

    @PutMapping("/{id}")
    public BidResponse updateBid(@PathVariable Long id, @RequestBody BidRequest request) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        bid.setTenderNo(request.getTenderNo());
        bid.setDescription(request.getDescription());
        bid.setClientName(request.getClientName());
        bid.setBidDecision(request.getBidDecision());
        bid.setSubmissionDate(request.getSubmissionDate());
        bid.setPriority(request.getPriority());
        bid.setFinalReviewApprovalDate(request.getFinalReviewApprovalDate());
        bid.setTenderedValue(request.getTenderedValue());
        bid.setOutcome(request.getOutcome());
        bid.setRemark(request.getRemark());
        bid.setOwner(owner);

        Bid updatedBid = bidRepository.save(bid);
        return mapToResponse(updatedBid);
    }

    @DeleteMapping("/{id}")
    public String archiveBid(@PathVariable Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setArchived(true);
        bidRepository.save(bid);

        return "Bid archived successfully";
    }

    @PostMapping("/{id}/award")
    public BidResponse awardBid(@PathVariable Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setOutcome("WON");
        Bid updatedBid = bidRepository.save(bid);

        boolean projectAlreadyExists = projectRepository.findByBidId(bid.getId()).isPresent();

        if (!projectAlreadyExists) {
            Project project = Project.builder()
                    .projectName("Project - " + bid.getTenderNo())
                    .clientName(bid.getClientName())
                    .projectValue(bid.getTenderedValue())
                    .startDate(LocalDate.now())
                    .status("PLANNED")
                    .owner(bid.getOwner())
                    .bid(updatedBid)
                    .build();

            projectRepository.save(project);
        }

        return mapToResponse(updatedBid);
    }

    @PostMapping("/{id}/lose")
    public BidResponse loseBid(@PathVariable Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setOutcome("LOST");
        Bid updatedBid = bidRepository.save(bid);

        return mapToResponse(updatedBid);
    }

    private BidResponse mapToResponse(Bid bid) {
        OwnerSummaryResponse ownerResponse = new OwnerSummaryResponse(
                bid.getOwner().getId(),
                bid.getOwner().getFullName(),
                bid.getOwner().getEmail()
        );

        return new BidResponse(
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
                ownerResponse
        );
    }
}