package com.fusion.pms.bid;

import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fusion.pms.project.Project;

@Entity
@Table(name = "bids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tenderNo;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String bidDecision; // BID / NO_BID

    private LocalDate submissionDate;

    @Column(nullable = false)
    private String priority;

    private LocalDate finalReviewApprovalDate;

    private BigDecimal tenderedValue;

    @Column(nullable = false)
    private String outcome; // PENDING / WON / LOST

    @Column(length = 2000)
    private String remark;

    @Builder.Default
    @Column(nullable = false)
    private Boolean archived = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToOne(mappedBy = "bid")
    private Project project;

    @Column(nullable = false)
    private String clientName;
}