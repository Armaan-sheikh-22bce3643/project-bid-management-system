package com.fusion.pms.bid;

import com.fusion.pms.opportunity.OwnerSummaryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BidResponse {

    private Long id;
    private String tenderNo;
    private String description;
    private String clientName;
    private String bidDecision;
    private LocalDate submissionDate;
    private String priority;
    private LocalDate finalReviewApprovalDate;
    private BigDecimal tenderedValue;
    private String outcome;
    private String remark;
    private Boolean archived;
    private OwnerSummaryResponse owner;

    public BidResponse(
            Long id,
            String tenderNo,
            String description,
            String clientName,
            String bidDecision,
            LocalDate submissionDate,
            String priority,
            LocalDate finalReviewApprovalDate,
            BigDecimal tenderedValue,
            String outcome,
            String remark,
            Boolean archived,
            OwnerSummaryResponse owner
    ) {
        this.id = id;
        this.tenderNo = tenderNo;
        this.description = description;
        this.clientName = clientName;
        this.bidDecision = bidDecision;
        this.submissionDate = submissionDate;
        this.priority = priority;
        this.finalReviewApprovalDate = finalReviewApprovalDate;
        this.tenderedValue = tenderedValue;
        this.outcome = outcome;
        this.remark = remark;
        this.archived = archived;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getTenderNo() {
        return tenderNo;
    }

    public String getDescription() {
        return description;
    }

    public String getClientName() {
        return clientName;
    }

    public String getBidDecision() {
        return bidDecision;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getFinalReviewApprovalDate() {
        return finalReviewApprovalDate;
    }

    public BigDecimal getTenderedValue() {
        return tenderedValue;
    }

    public String getOutcome() {
        return outcome;
    }

    public String getRemark() {
        return remark;
    }

    public Boolean getArchived() {
        return archived;
    }

    public OwnerSummaryResponse getOwner() {
        return owner;
    }
}