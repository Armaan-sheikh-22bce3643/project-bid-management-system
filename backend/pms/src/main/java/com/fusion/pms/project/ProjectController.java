package com.fusion.pms.project;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fusion.pms.opportunity.OwnerSummaryResponse;
import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findByArchivedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/archived")
    public List<ProjectResponse> getArchivedProjects() {
        return projectRepository.findByArchivedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return mapToResponse(project);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        project.setProjectName(request.getProjectName());
        project.setClientName(request.getClientName());
        project.setProjectValue(request.getProjectValue());
        project.setStartDate(request.getStartDate());
        project.setStatus(request.getStatus());
        project.setOwner(owner);

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    @DeleteMapping("/{id}")
    public String archiveProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setArchived(true);
        projectRepository.save(project);

        return "Project archived successfully";
    }

    @PostMapping("/{id}/activate")
    public ProjectResponse activateProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus("ACTIVE");
        Project updatedProject = projectRepository.save(project);

        return mapToResponse(updatedProject);
    }

    @PostMapping("/{id}/hold")
    public ProjectResponse holdProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus("ON_HOLD");
        Project updatedProject = projectRepository.save(project);

        return mapToResponse(updatedProject);
    }

    @PostMapping("/{id}/complete")
    public ProjectResponse completeProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus("COMPLETED");
        Project updatedProject = projectRepository.save(project);

        return mapToResponse(updatedProject);
    }

    private ProjectResponse mapToResponse(Project project) {
        OwnerSummaryResponse ownerResponse = new OwnerSummaryResponse(
                project.getOwner().getId(),
                project.getOwner().getFullName(),
                project.getOwner().getEmail()
        );

        return new ProjectResponse(
                project.getId(),
                project.getProjectName(),
                project.getClientName(),
                project.getProjectValue(),
                project.getStartDate(),
                project.getStatus(),
                project.getArchived(),
                project.getBid() != null ? project.getBid().getId() : null,
                ownerResponse
        );
    }
}