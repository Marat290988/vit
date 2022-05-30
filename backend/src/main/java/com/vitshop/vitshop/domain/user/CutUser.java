package com.vitshop.vitshop.domain.user;

import java.util.Date;

public class CutUser {
    private String userId;
    private String username;
    private String email;
    private Role role;
    private Date lastLoginDate;
    private Date lastLoginDateDisplay;
    private Date joinDate;
    private boolean isActive;
    private boolean isNotLocked;

    public CutUser(UserEntity user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.lastLoginDate = user.getLastLoginDate();
        this.lastLoginDateDisplay = user.getLastLoginDateDisplay();
        this.joinDate = user.getJoinDate();
        this.isActive = user.isActive();
        this.isNotLocked = user.isNotLocked();
    }

    @Override
    public String toString() {
        return "CutUser{" +
                "userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", lastLoginDate=" + lastLoginDate +
                ", lastLoginDateDisplay=" + lastLoginDateDisplay +
                ", joinDate=" + joinDate +
                ", isActive=" + isActive +
                ", isNotLocked=" + isNotLocked +
                '}';
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Date getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(Date lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public Date getLastLoginDateDisplay() {
        return lastLoginDateDisplay;
    }

    public void setLastLoginDateDisplay(Date lastLoginDateDisplay) {
        this.lastLoginDateDisplay = lastLoginDateDisplay;
    }

    public Date getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isNotLocked() {
        return isNotLocked;
    }

    public void setNotLocked(boolean notLocked) {
        isNotLocked = notLocked;
    }
}
