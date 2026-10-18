package com.fusion.pms.dashboard;

public class IrfDashboardSummaryResponse {

    private long totalActiveIrfs;
    private long archivedIrfs;
    private long pendingIrfs;
    private long approvedIrfs;
    private long rejectedIrfs;
    private long managerPendingIrfs;
    private long financePendingIrfs;

    public IrfDashboardSummaryResponse(long totalActiveIrfs,
                                       long archivedIrfs,
                                       long pendingIrfs,
                                       long approvedIrfs,
                                       long rejectedIrfs,
                                       long managerPendingIrfs,
                                       long financePendingIrfs) {
        this.totalActiveIrfs = totalActiveIrfs;
        this.archivedIrfs = archivedIrfs;
        this.pendingIrfs = pendingIrfs;
        this.approvedIrfs = approvedIrfs;
        this.rejectedIrfs = rejectedIrfs;
        this.managerPendingIrfs = managerPendingIrfs;
        this.financePendingIrfs = financePendingIrfs;
    }

    public long getTotalActiveIrfs() {
        return totalActiveIrfs;
    }

    public long getArchivedIrfs() {
        return archivedIrfs;
    }

    public long getPendingIrfs() {
        return pendingIrfs;
    }

    public long getApprovedIrfs() {
        return approvedIrfs;
    }

    public long getRejectedIrfs() {
        return rejectedIrfs;
    }

    public long getManagerPendingIrfs() {
        return managerPendingIrfs;
    }

    public long getFinancePendingIrfs() {
        return financePendingIrfs;
    }
}