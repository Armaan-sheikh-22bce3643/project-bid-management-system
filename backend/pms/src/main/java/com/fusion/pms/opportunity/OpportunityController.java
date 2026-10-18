package com.fusion.pms.opportunity;

import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    public OpportunityController(OpportunityRepository opportunityRepository, UserRepository userRepository) {
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public OpportunityResponse createOpportunity(@RequestBody OpportunityRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .clientName(request.getClientName())
                .bidRoute(request.getBidRoute())
                .estimatedCost(request.getEstimatedCost())
                .priority(request.getPriority())
                .status(request.getStatus())
                .remarks(request.getRemarks())
                .miscellaneous(request.getMiscellaneous())
                .owner(owner)
                .build();

        Opportunity savedOpportunity = opportunityRepository.save(opportunity);
        return mapToResponse(savedOpportunity);
    }

    @GetMapping
    public List<OpportunityResponse> getAllOpportunities(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category
    ) {
        List<Opportunity> opportunities;

        if (status != null && priority != null && category != null) {
            opportunities = opportunityRepository.findByStatusAndPriorityAndCategoryAndArchivedFalse(status, priority, category);
        } else if (status != null && priority != null) {
            opportunities = opportunityRepository.findByStatusAndPriorityAndArchivedFalse(status, priority);
        } else if (status != null && category != null) {
            opportunities = opportunityRepository.findByStatusAndCategoryAndArchivedFalse(status, category);
        } else if (priority != null && category != null) {
            opportunities = opportunityRepository.findByPriorityAndCategoryAndArchivedFalse(priority, category);
        } else if (status != null) {
            opportunities = opportunityRepository.findByStatusAndArchivedFalse(status);
        } else if (priority != null) {
            opportunities = opportunityRepository.findByPriorityAndArchivedFalse(priority);
        } else if (category != null) {
            opportunities = opportunityRepository.findByCategoryAndArchivedFalse(category);
        } else {
            opportunities = opportunityRepository.findByArchivedFalse();
        }

        return opportunities.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/archived")
    public List<OpportunityResponse> getArchivedOpportunities() {
        return opportunityRepository.findByArchivedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public OpportunityResponse getOpportunityById(@PathVariable Long id) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        return mapToResponse(opportunity);
    }

    @PutMapping("/{id}")
    public OpportunityResponse updateOpportunity(@PathVariable Long id, @RequestBody OpportunityRequest request) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        opportunity.setTitle(request.getTitle());
        opportunity.setDescription(request.getDescription());
        opportunity.setCategory(request.getCategory());
        opportunity.setClientName(request.getClientName());
        opportunity.setBidRoute(request.getBidRoute());
        opportunity.setEstimatedCost(request.getEstimatedCost());
        opportunity.setPriority(request.getPriority());
        opportunity.setStatus(request.getStatus());
        opportunity.setRemarks(request.getRemarks());
        opportunity.setMiscellaneous(request.getMiscellaneous());
        opportunity.setOwner(owner);

        Opportunity updatedOpportunity = opportunityRepository.save(opportunity);
        return mapToResponse(updatedOpportunity);
    }

    @DeleteMapping("/{id}")
    public String deleteOpportunity(@PathVariable Long id) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        opportunity.setArchived(true);
        opportunityRepository.save(opportunity);

        return "Opportunity archived successfully";
    }

    private OpportunityResponse mapToResponse(Opportunity opportunity) {
        OwnerSummaryResponse ownerResponse = new OwnerSummaryResponse(
                opportunity.getOwner().getId(),
                opportunity.getOwner().getFullName(),
                opportunity.getOwner().getEmail()
        );

        return new OpportunityResponse(
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
                ownerResponse
        );
    }
}