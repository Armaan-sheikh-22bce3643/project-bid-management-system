package com.fusion.pms.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fusion.pms.role.Role;
import com.fusion.pms.role.RoleRepository;
import com.fusion.pms.user.User;
import com.fusion.pms.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name("ADMIN").build()
                ));

        @SuppressWarnings("unused")
        Role pmRole = roleRepository.findByName("PROJECT_MANAGER")
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name("PROJECT_MANAGER").build()
                ));

        if (!userRepository.existsByEmail("admin@fusion.com")) {
            User admin = User.builder()
                    .fullName("Fusion Admin")
                    .email("admin@fusion.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(adminRole)
                    .active(true)
                    .build();

            userRepository.save(admin);
        }
    }
}