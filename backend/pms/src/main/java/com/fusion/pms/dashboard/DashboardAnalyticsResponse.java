package com.fusion.pms.dashboard;

public class DashboardAnalyticsResponse {

    private long wonBids;
    private long lostBids;
    private long pendingBids;

    private long plannedProjects;
    private long activeProjects;
    private long onHoldProjects;
    private long completedProjects;

    public DashboardAnalyticsResponse(
            long wonBids,
            long lostBids,
            long pendingBids,
            long plannedProjects,
            long activeProjects,
            long onHoldProjects,
            long completedProjects
    ) {
        this.wonBids = wonBids;
        this.lostBids = lostBids;
        this.pendingBids = pendingBids;
        this.plannedProjects = plannedProjects;
        this.activeProjects = activeProjects;
        this.onHoldProjects = onHoldProjects;
        this.completedProjects = completedProjects;
    }

    public long getWonBids() { return wonBids; }
    public long getLostBids() { return lostBids; }
    public long getPendingBids() { return pendingBids; }
    public long getPlannedProjects() { return plannedProjects; }
    public long getActiveProjects() { return activeProjects; }
    public long getOnHoldProjects() { return onHoldProjects; }
    public long getCompletedProjects() { return completedProjects; }
}