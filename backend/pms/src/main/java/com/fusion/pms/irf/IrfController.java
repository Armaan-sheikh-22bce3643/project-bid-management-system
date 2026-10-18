package com.fusion.pms.irf;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fusion.pms.exception.ForbiddenOperationException;
import com.fusion.pms.exception.ResourceNotFoundException;
import com.fusion.pms.opportunity.OwnerSummaryResponse;
import com.fusion.pms.project.Project;
import com.fusion.pms.project.ProjectRepository;
import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;

@RestController
@RequestMapping("/api/irfs")
public class IrfController {

    private final IrfRepository irfRepository;
    private final IrfApprovalHistoryRepository irfApprovalHistoryRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public IrfController(IrfRepository irfRepository,
                         IrfApprovalHistoryRepository irfApprovalHistoryRepository,
                         ProjectRepository projectRepository,
                         UserRepository userRepository) {
        this.irfRepository = irfRepository;
        this.irfApprovalHistoryRepository = irfApprovalHistoryRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public IrfResponse createIrf(@RequestBody IrfRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User requestedBy = userRepository.findById(request.getRequestedById())
                .orElseThrow(() -> new ResourceNotFoundException("Requested user not found"));

        Irf irf = Irf.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .status("PENDING")
                .approvalLevel(request.getApprovalLevel())
                .remarks(request.getRemarks())
                .project(project)
                .requestedBy(requestedBy)
                .build();

        return mapToResponse(irfRepository.save(irf));
    }

    @GetMapping
        public List<IrfResponse> getAllIrfs(
                @RequestParam(required = false) String status,
                @RequestParam(required = false) String approvalLevel,
                @AuthenticationPrincipal User currentUser
        ) {
        String currentRole = currentUser.getRole().getName();
        List<Irf> irfs;

        if ("ADMIN".equals(currentRole)) {
                if (status != null) {
                irfs = irfRepository.findByStatusAndArchivedFalse(status);
                } else if (approvalLevel != null) {
                irfs = irfRepository.findByApprovalLevelAndArchivedFalse(approvalLevel);
                } else {
                irfs = irfRepository.findByArchivedFalse();
                }
        } else if ("MANAGER".equals(currentRole)) {
                irfs = irfRepository.findByApprovalLevelAndArchivedFalse("MANAGER");
        } else if ("FINANCE".equals(currentRole)) {
                irfs = irfRepository.findByApprovalLevelAndArchivedFalse("FINANCE");
        } else {
                irfs = irfRepository.findByRequestedByIdAndArchivedFalse(currentUser.getId());
        }

        return irfs.stream()
                .map(this::mapToResponse)
                .toList();
        }

    @GetMapping("/archived")
    public List<IrfResponse> getArchivedIrfs() {
        return irfRepository.findByArchivedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/{id}")
        public IrfResponse getIrfById(@PathVariable Long id,
                                @AuthenticationPrincipal User currentUser) {

        Irf irf = irfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IRF not found"));

        String role = currentUser.getRole().getName();

        // ADMIN → full access
        if ("ADMIN".equals(role)) {
                return mapToResponse(irf);
        }

        // MANAGER → only MANAGER stage
        if ("MANAGER".equals(role) && "MANAGER".equals(irf.getApprovalLevel())) {
                return mapToResponse(irf);
        }

        // FINANCE → only FINANCE stage
        if ("FINANCE".equals(role) && "FINANCE".equals(irf.getApprovalLevel())) {
                return mapToResponse(irf);
        }

        // Requester → only own IRFs
        if (irf.getRequestedBy().getId().equals(currentUser.getId())) {
                return mapToResponse(irf);
        }

        throw new ForbiddenOperationException("You are not allowed to access this IRF");
        }

    @GetMapping("/{id}/history")
    public List<IrfApprovalHistoryResponse> getIrfHistory(@PathVariable Long id) {
        return irfApprovalHistoryRepository.findByIrfIdOrderByActionAtAsc(id)
                .stream()
                .map(history -> new IrfApprovalHistoryResponse(
                        history.getId(),
                        history.getAction(),
                        history.getStage(),
                        history.getRemarks(),
                        history.getActionAt(),
                        new OwnerSummaryResponse(
                                history.getActedBy().getId(),
                                history.getActedBy().getFullName(),
                                history.getActedBy().getEmail()
                        )
                ))
                .toList();
    }

    @PutMapping("/{id}")
    public IrfResponse updateIrf(@PathVariable Long id, @RequestBody IrfRequest request) {
        Irf irf = irfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IRF not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User requestedBy = userRepository.findById(request.getRequestedById())
                .orElseThrow(() -> new ResourceNotFoundException("Requested user not found"));

        irf.setAmount(request.getAmount());
        irf.setDescription(request.getDescription());
        irf.setApprovalLevel(request.getApprovalLevel());
        irf.setRemarks(request.getRemarks());
        irf.setProject(project);
        irf.setRequestedBy(requestedBy);

        return mapToResponse(irfRepository.save(irf));
    }

    // ✅ APPROVE WITH REMARKS
    @PostMapping("/{id}/approve")
    public IrfResponse approveIrf(@PathVariable Long id,
                                 @RequestBody(required = false) IrfApprovalRequest request,
                                 @AuthenticationPrincipal User currentUser) {

        Irf irf = irfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IRF not found"));

        if ("APPROVED".equals(irf.getStatus()) || "REJECTED".equals(irf.getStatus())) {
            throw new ForbiddenOperationException("IRF is already finalized and cannot be approved again");
        }

        String currentRole = currentUser.getRole().getName();
        String currentStage = irf.getApprovalLevel();

        if ("MANAGER".equals(currentStage)) {
            if (!"MANAGER".equals(currentRole) && !"ADMIN".equals(currentRole)) {
                throw new ForbiddenOperationException("Only MANAGER or ADMIN can approve at this stage");
            }
            irf.setApprovalLevel("FINANCE");
            irf.setStatus("PENDING");

        } else if ("FINANCE".equals(currentStage)) {
            if (!"FINANCE".equals(currentRole) && !"ADMIN".equals(currentRole)) {
                throw new ForbiddenOperationException("Only FINANCE or ADMIN can approve at this stage");
            }
            irf.setStatus("APPROVED");
        }

        Irf updatedIrf = irfRepository.save(irf);

        String remarks = (request != null && request.getRemarks() != null)
                ? request.getRemarks()
                : "Approved by " + currentRole;

        IrfApprovalHistory history = IrfApprovalHistory.builder()
                .action("APPROVED")
                .stage(currentStage)
                .remarks(remarks)
                .actionAt(LocalDateTime.now())
                .irf(updatedIrf)
                .actedBy(currentUser)
                .build();

        irfApprovalHistoryRepository.save(history);

        return mapToResponse(updatedIrf);
    }

    // ✅ REJECT WITH REMARKS
    @PostMapping("/{id}/reject")
    public IrfResponse rejectIrf(@PathVariable Long id,
                                @RequestBody(required = false) IrfApprovalRequest request,
                                @AuthenticationPrincipal User currentUser) {

        Irf irf = irfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IRF not found"));

        if ("APPROVED".equals(irf.getStatus()) || "REJECTED".equals(irf.getStatus())) {
            throw new ForbiddenOperationException("IRF is already finalized and cannot be rejected again");
        }

        String currentStage = irf.getApprovalLevel();

        irf.setStatus("REJECTED");
        Irf updatedIrf = irfRepository.save(irf);

        String remarks = (request != null && request.getRemarks() != null)
                ? request.getRemarks()
                : "Rejected by " + currentUser.getRole().getName();

        IrfApprovalHistory history = IrfApprovalHistory.builder()
                .action("REJECTED")
                .stage(currentStage)
                .remarks(remarks)
                .actionAt(LocalDateTime.now())
                .irf(updatedIrf)
                .actedBy(currentUser)
                .build();

        irfApprovalHistoryRepository.save(history);

        return mapToResponse(updatedIrf);
    }

    @DeleteMapping("/{id}")
    public String archiveIrf(@PathVariable Long id) {
        Irf irf = irfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IRF not found"));

        irf.setArchived(true);
        irfRepository.save(irf);

        return "IRF archived successfully";
    }

    private IrfResponse mapToResponse(Irf irf) {
        OwnerSummaryResponse requestedByResponse = new OwnerSummaryResponse(
                irf.getRequestedBy().getId(),
                irf.getRequestedBy().getFullName(),
                irf.getRequestedBy().getEmail()
        );

        return new IrfResponse(
                irf.getId(),
                irf.getAmount(),
                irf.getDescription(),
                irf.getStatus(),
                irf.getApprovalLevel(),
                irf.getRemarks(),
                irf.getArchived(),
                irf.getProject().getId(),
                irf.getProject().getProjectName(),
                requestedByResponse
        );
    }
}