package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductEntity> getProducts(Pageable page);

    ProductEntity addProduct(
            String name,
            String description,
            String composition,
            String manufacturer,
            String category,
            double dPrice,
            String author
    );
}
