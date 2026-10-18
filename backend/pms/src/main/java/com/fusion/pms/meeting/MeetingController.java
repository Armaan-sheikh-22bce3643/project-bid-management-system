package com.fusion.pms.meeting;

import com.fusion.pms.bid.Bid;
import com.fusion.pms.bid.BidRepository;
import com.fusion.pms.opportunity.Opportunity;
import com.fusion.pms.opportunity.OpportunityRepository;
import com.fusion.pms.opportunity.OwnerSummaryResponse;
import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final BidRepository bidRepository;

    public MeetingController(MeetingRepository meetingRepository,
                             UserRepository userRepository,
                             OpportunityRepository opportunityRepository,
                             BidRepository bidRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
        this.opportunityRepository = opportunityRepository;
        this.bidRepository = bidRepository;
    }

    @PostMapping
    public MeetingResponse createMeeting(@RequestBody MeetingRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Opportunity opportunity = null;
        if (request.getOpportunityId() != null) {
            opportunity = opportunityRepository.findById(request.getOpportunityId())
                    .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        }

        Bid bid = null;
        if (request.getBidId() != null) {
            bid = bidRepository.findById(request.getBidId())
                    .orElseThrow(() -> new RuntimeException("Bid not found"));
        }

        Meeting meeting = Meeting.builder()
                .title(request.getTitle())
                .meetingDateTime(request.getMeetingDateTime())
                .attendees(request.getAttendees())
                .agenda(request.getAgenda())
                .notes(request.getNotes())
                .decision(request.getDecision())
                .nextAction(request.getNextAction())
                .owner(owner)
                .opportunity(opportunity)
                .bid(bid)
                .build();

        Meeting savedMeeting = meetingRepository.save(meeting);
        return mapToResponse(savedMeeting);
    }

    @GetMapping
    public List<MeetingResponse> getAllMeetings(@RequestParam(required = false) String decision) {
        List<Meeting> meetings;

        if (decision != null) {
            meetings = meetingRepository.findByDecisionAndArchivedFalse(decision);
        } else {
            meetings = meetingRepository.findByArchivedFalse();
        }

        return meetings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/archived")
    public List<MeetingResponse> getArchivedMeetings() {
        return meetingRepository.findByArchivedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList(); 
    }

    @GetMapping("/{id}")
    public MeetingResponse getMeetingById(@PathVariable Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        return mapToResponse(meeting);
    }

    @PutMapping("/{id}")
    public MeetingResponse updateMeeting(@PathVariable Long id, @RequestBody MeetingRequest request) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Opportunity opportunity = null;
        if (request.getOpportunityId() != null) {
            opportunity = opportunityRepository.findById(request.getOpportunityId())
                    .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        }

        Bid bid = null;
        if (request.getBidId() != null) {
            bid = bidRepository.findById(request.getBidId())
                    .orElseThrow(() -> new RuntimeException("Bid not found"));
        }

        meeting.setTitle(request.getTitle());
        meeting.setMeetingDateTime(request.getMeetingDateTime());
        meeting.setAttendees(request.getAttendees());
        meeting.setAgenda(request.getAgenda());
        meeting.setNotes(request.getNotes());
        meeting.setDecision(request.getDecision());
        meeting.setNextAction(request.getNextAction());
        meeting.setOwner(owner);
        meeting.setOpportunity(opportunity);
        meeting.setBid(bid);

        Meeting updatedMeeting = meetingRepository.save(meeting);
        return mapToResponse(updatedMeeting);
    }

    @DeleteMapping("/{id}")
    public String archiveMeeting(@PathVariable Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        meeting.setArchived(true);
        meetingRepository.save(meeting);

        return "Meeting archived successfully";
    }

    private MeetingResponse mapToResponse(Meeting meeting) {
        OwnerSummaryResponse ownerResponse = new OwnerSummaryResponse(
                meeting.getOwner().getId(),
                meeting.getOwner().getFullName(),
                meeting.getOwner().getEmail()
        );

        return new MeetingResponse(
                meeting.getId(),
                meeting.getTitle(),
                meeting.getMeetingDateTime(),
                meeting.getAttendees(),
                meeting.getAgenda(),
                meeting.getNotes(),
                meeting.getDecision(),
                meeting.getNextAction(),
                meeting.getArchived(),
                meeting.getOpportunity() != null ? meeting.getOpportunity().getId() : null,
                meeting.getBid() != null ? meeting.getBid().getId() : null,
                ownerResponse
        );
    }
}