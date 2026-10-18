package com.fusion.pms.opportunity;

import java.math.BigDecimal;

public class OpportunityResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String clientName;
    private String bidRoute;
    private BigDecimal estimatedCost;
    private String priority;
    private String status;
    private String remarks;
    private String miscellaneous;
    private Boolean archived; 
    private OwnerSummaryResponse owner;

    public OpportunityResponse(
            Long id,
            String title,
            String description,
            String category,
            String clientName,
            String bidRoute,
            BigDecimal estimatedCost,
            String priority,
            String status,
            String remarks,
            String miscellaneous,
            Boolean archived, 
            OwnerSummaryResponse owner
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.clientName = clientName;
        this.bidRoute = bidRoute;
        this.estimatedCost = estimatedCost;
        this.priority = priority;
        this.status = status;
        this.remarks = remarks;
        this.miscellaneous = miscellaneous;
        this.archived = archived; 
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getClientName() {
        return clientName;
    }

    public String getBidRoute() {
        return bidRoute;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getMiscellaneous() {
        return miscellaneous;
    }

    public Boolean getArchived() { 
        return archived;
    }

    public OwnerSummaryResponse getOwner() {
        return owner;
    }
}