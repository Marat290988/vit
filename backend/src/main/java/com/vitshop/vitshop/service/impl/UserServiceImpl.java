package com.vitshop.vitshop.service.impl;

import com.vitshop.vitshop.domain.user.Role;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.domain.user.UserPrincipal;
import com.vitshop.vitshop.exceptions.EmailExistException;
import com.vitshop.vitshop.exceptions.EmptyObjectException;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.exceptions.UsernameExistException;
import com.vitshop.vitshop.repository.UserRepository;
import com.vitshop.vitshop.service.LoginAttemptService;
import com.vitshop.vitshop.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    private final String NO_USER_FOUND_BY_USERNAME = "No user found by username ";
    private final String FOUND_USER_BY_USERNAME = "Returning found user by username: ";
    private final String USERNAME_ALREADY_EXISTS = "Username already exists";
    private final String EMAIL_ALREADY_EXISTS = "Email already exists";
    private final String EMPTY_OBJECT = "An empty object was passed";

    private Logger LOGGER = LoggerFactory.getLogger(getClass());
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private LoginAttemptService loginAttemptService;

    @Autowired
    public UserServiceImpl(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            LoginAttemptService loginAttemptService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public UserEntity register(
            String username,
            String password,
            String email
    ) throws UserNotFoundException, EmailExistException, UsernameExistException, EmptyObjectException {
        if (username == null || password == null || email == null) {
            throw new EmptyObjectException(EMPTY_OBJECT);
        }
        validateNewUsernameAndEmail(StringUtils.EMPTY, username, email);
        UserEntity user = new UserEntity();
        user.setUserId(generateUserId());
        user.setEmail(email);
        String encodedPass = passwordEncoder.encode(password);
        user.setUsername(username);
        user.setPassword(encodedPass);
        user.setJoinDate(new Date());
        user.setActive(true);
        user.setNotLocked(true);
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);
        LOGGER.info("Registered new user with username " + user.getUsername());
        return user;
    }

    @Override
    public Page<UserEntity> getUsers(Pageable page) {
        return userRepository.findAll(page);
    }

    @Override
    public Page<UserEntity> findUsersByUsernameAndEmail(Pageable page, String search) {
        return userRepository.findUsersByUsernameAndEmail(page, search);
    }

    @Override
    public UserEntity findUserEntityByUsername(String username) {
        return userRepository.findUserEntityByUsername(username);
    }

    @Override
    public UserEntity findUserEntityByEmail(String email) {
        return userRepository.findUserEntityByEmail(email);
    }

    @Override
    public UserEntity addNewUser(
            String username,
            String password,
            String email,
            Role role,
            boolean isNotLocked,
            boolean isActive
    ) throws UserNotFoundException, EmailExistException, UsernameExistException {
        validateNewUsernameAndEmail(StringUtils.EMPTY, username, email);
        UserEntity user = new UserEntity();
        user.setPassword(password);
        user.setUserId(generateUserId());
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(role);
        user.setNotLocked(isNotLocked);
        user.setActive(isActive);
        user.setJoinDate(new Date());
        userRepository.save(user);
        LOGGER.info("Have been created new user with username " + user.getUsername());
        return user;
    }

    @Override
    public UserEntity updateUser(
            String currentUsername,
            String newUsername,
            String newEmail,
            String newPassword,
            Role role,
            boolean isNotLocked,
            boolean isActive
    ) throws UserNotFoundException, EmailExistException, UsernameExistException {
        UserEntity currentUser = validateNewUsernameAndEmail(currentUsername, newUsername, newEmail);
        currentUser.setPassword(newPassword);
        currentUser.setUserId(generateUserId());
        currentUser.setUsername(newUsername);
        currentUser.setEmail(newEmail);
        currentUser.setRole(role);
        currentUser.setNotLocked(isNotLocked);
        currentUser.setActive(isActive);
        userRepository.save(currentUser);
        LOGGER.info("Have been updated new user with username " + currentUser.getUsername());
        return currentUser;
    }

    @Override
    public void deleteUser(String username) {
        UserEntity user = userRepository.findUserEntityByUsername(username);
        userRepository.deleteById(user.getId());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findUserEntityByUsername(username);
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_USERNAME + username);
            throw new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME + username);
        } else {
            validateLoginAttempt(user);
            user.setLastLoginDateDisplay(user.getLastLoginDate());
            user.setLastLoginDate(new Date());
            userRepository.save(user);
            UserPrincipal userPrincipal = new UserPrincipal(user);
            LOGGER.info(FOUND_USER_BY_USERNAME + username);
            return userPrincipal;
        }
    }

    @Override
    public UserEntity findUserEntityByUserId(String userId) throws UserNotFoundException {
        UserEntity user = userRepository.findUserEntityByUserId(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found with this id");
        }
        return user;
    }

    private void validateLoginAttempt(UserEntity user) {
        if (user.isNotLocked()) {
            if (loginAttemptService.hasExceededMaxAttempts(user.getUsername())) {
                user.setNotLocked(false);
            } else {
                user.setNotLocked(true);
            }
        } else {
            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
        }
    }

    private UserEntity validateNewUsernameAndEmail(
            String currentUsername,
            String newUsername,
            String newEmail
    ) throws UserNotFoundException, UsernameExistException, EmailExistException {
        UserEntity newUserByUsername = findUserEntityByUsername(newUsername);
        UserEntity newUserByEmail = findUserEntityByEmail(newEmail);
        if (StringUtils.isNotBlank(currentUsername)) {
            UserEntity currentUser = findUserEntityByUsername(currentUsername);
            if (currentUser == null) {
                throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + currentUsername);
            }
            if (newUserByUsername != null && !currentUser.getId().equals(newUserByUsername.getId())) {
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if (newUserByEmail != null && !currentUser.getId().equals(newUserByEmail.getId())) {
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
            return currentUser;
        } else {
            if (newUserByUsername != null) {
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if (newUserByEmail != null) {
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
            return null;
        }
    }

    private String generateUserId() {
        return RandomStringUtils.randomNumeric(12);
    }
}
