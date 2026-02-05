package com.adithya.loginregister.payload;

public class PasswordRecoveryResponse {
    private String message;
    private String temporaryPassword;

    public PasswordRecoveryResponse() {}

    public PasswordRecoveryResponse(String message, String temporaryPassword) {
        this.message = message;
        this.temporaryPassword = temporaryPassword;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTemporaryPassword() { return temporaryPassword; }
    public void setTemporaryPassword(String temporaryPassword) { this.temporaryPassword = temporaryPassword; }
}
