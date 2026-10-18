package com.fusion.pms.dashboard;

import java.util.List;

import com.fusion.pms.bid.BidResponse;
import com.fusion.pms.meeting.MeetingResponse;
import com.fusion.pms.opportunity.OpportunityResponse;

public class DashboardRecentResponse {

    private List<OpportunityResponse> recentOpportunities;
    private List<BidResponse> recentBids;
    private List<MeetingResponse> recentMeetings;

    public DashboardRecentResponse(
            List<OpportunityResponse> recentOpportunities,
            List<BidResponse> recentBids,
            List<MeetingResponse> recentMeetings
    ) {
        this.recentOpportunities = recentOpportunities;
        this.recentBids = recentBids;
        this.recentMeetings = recentMeetings;
    }

    public List<OpportunityResponse> getRecentOpportunities() {
        return recentOpportunities;
    }

    public List<BidResponse> getRecentBids() {
        return recentBids;
    }

    public List<MeetingResponse> getRecentMeetings() {
        return recentMeetings;
    }
}