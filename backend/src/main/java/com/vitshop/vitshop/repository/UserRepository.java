package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findUserEntityByUsername(String username);
    UserEntity findUserEntityByEmail(String email);
    UserEntity findUserEntityByUserId(String userId);

    UserEntity findUserEntityById(Long id);

    @Query("Select u " +
            "From UserEntity u " +
            "where lower(u.email) like %:search% or lower(u.username) like %:search%"
    )
    Page<UserEntity> findUsersByUsernameAndEmail(Pageable page, @Param("search") String search);
}
