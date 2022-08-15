package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.cart.ProductCart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCartRepository extends JpaRepository<ProductCart, Long> {
}
