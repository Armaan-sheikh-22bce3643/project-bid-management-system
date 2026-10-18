package com.fusion.pms.meeting;

import com.fusion.pms.opportunity.OwnerSummaryResponse;

import java.time.LocalDateTime;

public class MeetingResponse {

    private Long id;
    private String title;
    private LocalDateTime meetingDateTime;
    private String attendees;
    private String agenda;
    private String notes;
    private String decision;
    private String nextAction;
    private Boolean archived;
    private Long opportunityId;
    private Long bidId;
    private OwnerSummaryResponse owner;

    public MeetingResponse(
            Long id,
            String title,
            LocalDateTime meetingDateTime,
            String attendees,
            String agenda,
            String notes,
            String decision,
            String nextAction,
            Boolean archived,
            Long opportunityId,
            Long bidId,
            OwnerSummaryResponse owner
    ) {
        this.id = id;
        this.title = title;
        this.meetingDateTime = meetingDateTime;
        this.attendees = attendees;
        this.agenda = agenda;
        this.notes = notes;
        this.decision = decision;
        this.nextAction = nextAction;
        this.archived = archived;
        this.opportunityId = opportunityId;
        this.bidId = bidId;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getMeetingDateTime() {
        return meetingDateTime;
    }

    public String getAttendees() {
        return attendees;
    }

    public String getAgenda() {
        return agenda;
    }

    public String getNotes() {
        return notes;
    }

    public String getDecision() {
        return decision;
    }

    public String getNextAction() {
        return nextAction;
    }

    public Boolean getArchived() {
        return archived;
    }

    public Long getOpportunityId() {
        return opportunityId;
    }

    public Long getBidId() {
        return bidId;
    }

    public OwnerSummaryResponse getOwner() {
        return owner;
    }
}