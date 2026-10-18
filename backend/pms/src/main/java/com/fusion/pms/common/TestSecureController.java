package com.fusion.pms.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSecureController {

    @GetMapping("/api/secure")
    public String secureEndpoint() {
        return "You accessed a protected endpoint successfully";
    }
}