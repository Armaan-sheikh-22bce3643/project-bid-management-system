package com.fusion.pms.irf;

import java.math.BigDecimal;

import com.fusion.pms.opportunity.OwnerSummaryResponse;

public class IrfResponse {

    private Long id;
    private BigDecimal amount;
    private String description;
    private String status;
    private String approvalLevel;
    private String remarks;
    private Boolean archived;
    private Long projectId;
    private String projectName;
    private OwnerSummaryResponse requestedBy;

    public IrfResponse(
            Long id,
            BigDecimal amount,
            String description,
            String status,
            String approvalLevel,
            String remarks,
            Boolean archived,
            Long projectId,
            String projectName,
            OwnerSummaryResponse requestedBy
    ) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.approvalLevel = approvalLevel;
        this.remarks = remarks;
        this.archived = archived;
        this.projectId = projectId;
        this.projectName = projectName;
        this.requestedBy = requestedBy;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getApprovalLevel() {
        return approvalLevel;
    }

    public String getRemarks() {
        return remarks;
    }

    public Boolean getArchived() {
        return archived;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public OwnerSummaryResponse getRequestedBy() {
        return requestedBy;
    }
}