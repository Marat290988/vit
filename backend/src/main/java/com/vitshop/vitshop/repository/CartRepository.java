package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.cart.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    @Query("Select u From CartEntity u Where user_id = :userId")
    CartEntity getCart(String userId);

    @Query("Update CartEntity Set Cart_Text = :cartText, User_Id = :userId")
    void saveUserCart(String cartText, String userId);

}
