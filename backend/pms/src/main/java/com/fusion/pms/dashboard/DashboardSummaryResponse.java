package com.fusion.pms.dashboard;

public class DashboardSummaryResponse {

    private long activeOpportunities;
    private long archivedOpportunities;
    private long openOpportunities;

    private long activeBids;
    private long archivedBids;
    private long wonBids;
    private long lostBids;

    private long activeProjects;
    private long archivedProjects;
    private long plannedProjects;
    private long runningProjects;
    private long completedProjects;

    private long activeMeetings;
    private long archivedMeetings;
    private long proceedMeetings;

    public DashboardSummaryResponse(
            long activeOpportunities,
            long archivedOpportunities,
            long openOpportunities,
            long activeBids,
            long archivedBids,
            long wonBids,
            long lostBids,
            long activeProjects,
            long archivedProjects,
            long plannedProjects,
            long runningProjects,
            long completedProjects,
            long activeMeetings,
            long archivedMeetings,
            long proceedMeetings
    ) {
        this.activeOpportunities = activeOpportunities;
        this.archivedOpportunities = archivedOpportunities;
        this.openOpportunities = openOpportunities;
        this.activeBids = activeBids;
        this.archivedBids = archivedBids;
        this.wonBids = wonBids;
        this.lostBids = lostBids;
        this.activeProjects = activeProjects;
        this.archivedProjects = archivedProjects;
        this.plannedProjects = plannedProjects;
        this.runningProjects = runningProjects;
        this.completedProjects = completedProjects;
        this.activeMeetings = activeMeetings;
        this.archivedMeetings = archivedMeetings;
        this.proceedMeetings = proceedMeetings;
    }

    public long getActiveOpportunities() {
        return activeOpportunities;
    }

    public long getArchivedOpportunities() {
        return archivedOpportunities;
    }

    public long getOpenOpportunities() {
        return openOpportunities;
    }

    public long getActiveBids() {
        return activeBids;
    }

    public long getArchivedBids() {
        return archivedBids;
    }

    public long getWonBids() {
        return wonBids;
    }

    public long getLostBids() {
        return lostBids;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public long getArchivedProjects() {
        return archivedProjects;
    }

    public long getPlannedProjects() {
        return plannedProjects;
    }

    public long getRunningProjects() {
        return runningProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public long getActiveMeetings() {
        return activeMeetings;
    }

    public long getArchivedMeetings() {
        return archivedMeetings;
    }

    public long getProceedMeetings() {
        return proceedMeetings;
    }
}