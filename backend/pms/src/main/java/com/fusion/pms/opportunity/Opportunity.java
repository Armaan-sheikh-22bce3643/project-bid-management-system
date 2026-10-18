package com.fusion.pms.opportunity;

import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String bidRoute;

    private BigDecimal estimatedCost;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status;

    @Column(length = 2000)
    private String remarks;

    @Column(length = 2000)
    private String miscellaneous;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Builder.Default
    @Column(nullable = false)
    private Boolean archived = false;
}