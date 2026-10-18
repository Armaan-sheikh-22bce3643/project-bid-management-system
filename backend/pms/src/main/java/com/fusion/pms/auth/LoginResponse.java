package com.fusion.pms.auth;

public class LoginResponse {

    @SuppressWarnings("FieldMayBeFinal")
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}