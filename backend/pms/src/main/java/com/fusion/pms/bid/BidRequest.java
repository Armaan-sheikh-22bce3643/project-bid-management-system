package com.fusion.pms.bid;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BidRequest {

    private String tenderNo;
    private String description;
    private String bidDecision;
    private LocalDate submissionDate;
    private String priority;
    private LocalDate finalReviewApprovalDate;
    private BigDecimal tenderedValue;
    private String outcome;
    private String remark;
    private Long ownerId;
    private String clientName;
   

    public String getTenderNo() {
        return tenderNo;
    }

    public void setTenderNo(String tenderNo) {
        this.tenderNo = tenderNo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBidDecision() {
        return bidDecision;
    }

    public void setBidDecision(String bidDecision) {
        this.bidDecision = bidDecision;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getFinalReviewApprovalDate() {
        return finalReviewApprovalDate;
    }

    public void setFinalReviewApprovalDate(LocalDate finalReviewApprovalDate) {
        this.finalReviewApprovalDate = finalReviewApprovalDate;
    }

    public BigDecimal getTenderedValue() {
        return tenderedValue;
    }

    public void setTenderedValue(BigDecimal tenderedValue) {
        this.tenderedValue = tenderedValue;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }
}