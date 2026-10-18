package com.fusion.pms.meeting;

import com.fusion.pms.bid.Bid;
import com.fusion.pms.opportunity.Opportunity;
import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private LocalDateTime meetingDateTime;

    @Column(length = 2000)
    private String attendees;

    @Column(length = 2000)
    private String agenda;

    @Column(length = 4000)
    private String notes;

    @Column(nullable = false)
    private String decision;

    @Column(length = 2000)
    private String nextAction;

    @Builder.Default
    @Column(nullable = false)
    private Boolean archived = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    @ManyToOne
    @JoinColumn(name = "bid_id")
    private Bid bid;
}