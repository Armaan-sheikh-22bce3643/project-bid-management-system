package com.fusion.pms.irf;

import com.fusion.pms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "irf_approval_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IrfApprovalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // APPROVED / REJECTED

    @Column(nullable = false)
    private String stage; // MANAGER / FINANCE

    @Column(length = 2000)
    private String remarks;

    @Column(nullable = false)
    private LocalDateTime actionAt;

    @ManyToOne
    @JoinColumn(name = "irf_id", nullable = false)
    private Irf irf;

    @ManyToOne
    @JoinColumn(name = "acted_by_id", nullable = false)
    private User actedBy;
}