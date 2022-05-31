package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.HttpResponse;
import com.vitshop.vitshop.domain.user.CutUser;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.domain.user.UserPrincipal;
import com.vitshop.vitshop.exceptions.*;
import com.vitshop.vitshop.service.UserService;
import com.vitshop.vitshop.utility.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping({"/api/user", "/"})
public class UserController {

    private final String USER_DELETED_SUCCESSFULLY = "User deleted successfully";

    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    public UserController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JWTTokenProvider jwtTokenProvider
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> register (
        @RequestBody UserEntity user
    ) throws UserNotFoundException, EmailExistException, UsernameExistException, EmptyObjectException {
        UserEntity newUser = userService.register(user.getUsername(), user.getPassword(), user.getEmail());
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<CutUser> login(
            @RequestBody UserEntity user
    ) {
        UserEntity loginUser;
        if (user.getUsername() != null) {
            authenticate(user.getUsername(), user.getPassword());
            loginUser = userService.findUserEntityByUsername(user.getUsername());
        } else {
            loginUser = userService.findUserEntityByEmail(user.getEmail());
            authenticate(loginUser.getUsername(), user.getPassword());
        }
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeaders = getJwtHeader(userPrincipal);
        CutUser cutUser = new CutUser(loginUser);
        return new ResponseEntity<>(cutUser, jwtHeaders, HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<UserEntity>> getAllUsers(Pageable page) {
        Page<UserEntity> users = userService.getUsers(page);
        return new ResponseEntity<Page<UserEntity>>(users, HttpStatus.OK);
    }

    @GetMapping("/userid/{userId}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable("userId") String userId) throws UserNotFoundException {
        UserEntity user = userService.findUserEntityByUserId(userId);
        user.setId(null);
        return new ResponseEntity<UserEntity>(user, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserEntity> getUserByEmail(@PathVariable("email") String email)
             {
        UserEntity user = userService.findUserEntityByEmail(email);
        user.setId(null);
        return new ResponseEntity<UserEntity>(user, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("username") String username) {
        userService.deleteUser(username);
        return response(HttpStatus.OK, USER_DELETED_SUCCESSFULLY);
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Jwt-Token", jwtTokenProvider.generateJwtToken(user));
        return headers;
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(
                new HttpResponse(httpStatus.value(),
                        httpStatus,
                        httpStatus.getReasonPhrase().toUpperCase(),
                        message.toUpperCase()
                ), httpStatus);
    }

    @GetMapping("/searchlist")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<UserEntity>> getSearchUsers(
            @RequestParam("search") String search,
            Pageable page
//            @RequestParam int size,
//            @RequestParam int number,
//            @RequestParam String sort
    ) {
        //Pageable page = PageRequest.of(number, size, Sort.by(sort));
        Page<UserEntity> users = userService.findUsersByUsernameAndEmail(page, search.toLowerCase());
        return new ResponseEntity<Page<UserEntity>>(users, HttpStatus.OK);
    }

    @PostMapping("/adduser")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserEntity> addUser(
            @RequestBody UserEntity user
    ) throws UserNotFoundException, EmailExistException, UsernameExistException {
        UserEntity newUser = this.userService.addNewUser(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRole(),
                user.isNotLocked(),
                user.isActive()
        );
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

}
