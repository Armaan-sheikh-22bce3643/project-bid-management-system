package com.fusion.pms.irf;

import java.time.LocalDateTime;

import com.fusion.pms.opportunity.OwnerSummaryResponse;

public class IrfApprovalHistoryResponse {

    private Long id;
    private String action;
    private String stage;
    private String remarks;
    private LocalDateTime actionAt;
    private OwnerSummaryResponse actedBy;

    public IrfApprovalHistoryResponse(
            Long id,
            String action,
            String stage,
            String remarks,
            LocalDateTime actionAt,
            OwnerSummaryResponse actedBy
    ) {
        this.id = id;
        this.action = action;
        this.stage = stage;
        this.remarks = remarks;
        this.actionAt = actionAt;
        this.actedBy = actedBy;
    }

    public Long getId() {
        return id;
    }

    public String getAction() {
        return action;
    }

    public String getStage() {
        return stage;
    }

    public String getRemarks() {
        return remarks;
    }

    public LocalDateTime getActionAt() {
        return actionAt;
    }

    public OwnerSummaryResponse getActedBy() {
        return actedBy;
    }
}