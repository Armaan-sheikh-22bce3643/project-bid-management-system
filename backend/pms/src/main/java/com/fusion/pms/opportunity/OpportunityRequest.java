package com.fusion.pms.opportunity;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpportunityRequest {
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
    private Long ownerId;
}