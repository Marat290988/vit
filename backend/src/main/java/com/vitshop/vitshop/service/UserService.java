package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.user.Role;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.exceptions.EmailExistException;
import com.vitshop.vitshop.exceptions.EmptyObjectException;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.exceptions.UsernameExistException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserEntity register(
            String username,
            String password,
            String email
    ) throws UserNotFoundException, EmailExistException, UsernameExistException, EmptyObjectException;

    Page<UserEntity> getUsers(Pageable page);

    Page<UserEntity> findUsersByUsernameAndEmail(Pageable page, String search);

    UserEntity findUserEntityByUsername(String username);

    UserEntity findUserEntityByUserId(String userId) throws UserNotFoundException;

    UserEntity findUserEntityByEmail(String email);

    UserEntity addNewUser(
            String username,
            String password,
            String email,
            Role role,
            boolean isNotLocked,
            boolean isActive
    ) throws UserNotFoundException, EmailExistException, UsernameExistException;

    UserEntity updateUser(
            String currentUsername,
            String newUsername,
            String newEmail,
            String newPassword,
            Role role,
            boolean isNotLocked,
            boolean isActive
    ) throws UserNotFoundException, EmailExistException, UsernameExistException;

    void deleteUser(String email);

    UserEntity findUserEntityById(Long id);
}
