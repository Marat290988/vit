package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    ProductEntity findProductEntityByProductId(String productId);
}
