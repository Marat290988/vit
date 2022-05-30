package com.vitshop.vitshop.domain.user;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "user_table")
public class UserEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userId;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column
    private Role role;

    @Column
    private Date lastLoginDate;

    @Column
    private Date lastLoginDateDisplay;

    @Column
    private Date joinDate;

    @Column
    private boolean isActive;

    @Column
    private boolean isNotLocked;

    public UserEntity(){};

    public UserEntity(
            Long id,
            String userId,
            String username,
            String email,
            String password,
            Role role,
            Date lastLoginDate,
            Date lastLoginDateDisplay,
            Date joinDate,
            boolean isActive,
            boolean isNotLocked) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.lastLoginDate = lastLoginDate;
        this.lastLoginDateDisplay = lastLoginDateDisplay;
        this.joinDate = joinDate;
        this.isActive = isActive;
        this.isNotLocked = isNotLocked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", lastLoginDate=" + lastLoginDate +
                ", lastLoginDateDisplay=" + lastLoginDateDisplay +
                ", joinDate=" + joinDate +
                ", isActive=" + isActive +
                ", isNotLocked=" + isNotLocked +
                '}';
    }
}
