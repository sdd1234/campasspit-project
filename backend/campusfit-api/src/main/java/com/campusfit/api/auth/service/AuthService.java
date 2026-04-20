package com.campusfit.api.auth.service;

import com.campusfit.api.auth.dto.*;

public interface AuthService {
    SignupResponse signup(SignupRequest request);

    LoginResponse login(LoginRequest request);

    RefreshResponse refresh(String refreshToken);

    void resetPassword(String email, String newPassword);
}
