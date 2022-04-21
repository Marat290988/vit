package com.vitshop.vitshop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSecurityController {

    @GetMapping("admin/get")
    public String getAdmin() {
        return "Admin";
    }

    @GetMapping("admin/user")
    public String getUser() {
        return "User";
    }
}
