package com.adithya.loginregister.payload;

public class SecurityQuestionsResponse {
    private String userId;
    private String question1;
    private String question2;

    public SecurityQuestionsResponse() {}

    public SecurityQuestionsResponse(String userId, String question1, String question2) {
        this.userId = userId;
        this.question1 = question1;
        this.question2 = question2;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuestion1() { return question1; }
    public void setQuestion1(String question1) { this.question1 = question1; }

    public String getQuestion2() { return question2; }
    public void setQuestion2(String question2) { this.question2 = question2; }
}
