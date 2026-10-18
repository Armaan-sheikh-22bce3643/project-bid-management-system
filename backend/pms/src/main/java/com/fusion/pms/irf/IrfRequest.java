package com.fusion.pms.irf;

import java.math.BigDecimal;

public class IrfRequest {

    private BigDecimal amount;
    private String description;
    private String approvalLevel;
    private String remarks;
    private Long projectId;
    private Long requestedById;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getApprovalLevel() {
        return approvalLevel;
    }

    public void setApprovalLevel(String approvalLevel) {
        this.approvalLevel = approvalLevel;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getRequestedById() {
        return requestedById;
    }

    public void setRequestedById(Long requestedById) {
        this.requestedById = requestedById;
    }
}