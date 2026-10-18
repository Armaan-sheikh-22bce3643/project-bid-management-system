package com.fusion.pms.project;

import com.fusion.pms.opportunity.OwnerSummaryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectResponse {

    private Long id;
    private String projectName;
    private String clientName;
    private BigDecimal projectValue;
    private LocalDate startDate;
    private String status;
    private Boolean archived;
    private Long bidId;
    private OwnerSummaryResponse owner;

    public ProjectResponse(
            Long id,
            String projectName,
            String clientName,
            BigDecimal projectValue,
            LocalDate startDate,
            String status,
            Boolean archived,
            Long bidId,
            OwnerSummaryResponse owner
    ) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.projectValue = projectValue;
        this.startDate = startDate;
        this.status = status;
        this.archived = archived;
        this.bidId = bidId;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public BigDecimal getProjectValue() {
        return projectValue;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public String getStatus() {
        return status;
    }

    public Boolean getArchived() {
        return archived;
    }

    public Long getBidId() {
        return bidId;
    }

    public OwnerSummaryResponse getOwner() {
        return owner;
    }
}