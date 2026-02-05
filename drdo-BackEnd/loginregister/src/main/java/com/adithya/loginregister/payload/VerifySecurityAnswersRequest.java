package com.adithya.loginregister.payload;

import jakarta.validation.constraints.NotBlank;

public class VerifySecurityAnswersRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String answer1;

    @NotBlank
    private String answer2;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAnswer1() { return answer1; }
    public void setAnswer1(String answer1) { this.answer1 = answer1; }

    public String getAnswer2() { return answer2; }
    public void setAnswer2(String answer2) { this.answer2 = answer2; }
}
