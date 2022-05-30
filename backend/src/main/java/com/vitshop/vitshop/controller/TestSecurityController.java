package com.vitshop.vitshop.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSecurityController {

    @GetMapping("admin/get")
    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public String getAdmin() {
        return "Admin";
    }

    @GetMapping("/user/get")
    public String getUser() {
        return "User";
    }
}
