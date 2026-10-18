package com.fusion.pms.irf;

import com.fusion.pms.project.Project;
import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "irfs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Irf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String status; // PENDING / APPROVED / REJECTED

    @Column(nullable = false)
    private String approvalLevel; // MANAGER / FINANCE

    @Column(length = 2000)
    private String remarks;

    @Builder.Default
    @Column(nullable = false)
    private Boolean archived = false;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "requested_by_id", nullable = false)
    private User requestedBy;
}