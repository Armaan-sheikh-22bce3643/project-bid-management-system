package com.fusion.pms.project;

import com.fusion.pms.bid.Bid;
import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String projectName;

    @Column(nullable = false)
    private String clientName;

    private BigDecimal projectValue;

    private LocalDate startDate;

    @Column(nullable = false)
    private String status; // PLANNED / ACTIVE / ON_HOLD / COMPLETED

    @Builder.Default
    @Column(nullable = false)
    private Boolean archived = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToOne
    @JoinColumn(name = "bid_id", unique = true)
    private Bid bid;
}