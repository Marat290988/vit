package com.vitshop.vitshop.repository;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vitshop.vitshop.domain.product.ProductDTO;
import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    ProductEntity findProductEntityByProductId(String productId);

    @Query(value = "Select new com.vitshop.vitshop.domain.product.ProductDTO(pr) From ProductEntity pr", countQuery = "Select count(*) From ProductEntity")
    Page<ProductDTO> getAllProducts(Pageable page);

    @Query("Select Distinct u.category From ProductEntity u")
    List<String> getAllCategory();

    @Query("Select Distinct u.manufacturer From ProductEntity u")
    List<String> getAllManufacturer();

}
