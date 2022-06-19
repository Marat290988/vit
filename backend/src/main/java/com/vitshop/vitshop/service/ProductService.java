package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.product.ProductDTO;
import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public interface ProductService {
    Page<ProductDTO> getProducts(Pageable page);

    ProductEntity addProduct(
            String name,
            String description,
            String composition,
            String manufacturer,
            String category,
            double dPrice,
            String author,
            MultipartFile[] files,
            boolean isActive,
            int activeImg
    ) throws IOException;

    byte[] getProductImage(String productId, String fileName) throws IOException;

    HashMap<String, Object> getCategoryAndManufacturer();
    Page<ProductDTO> getProductWithFilter(Specification<ProductEntity> spec, Pageable page);
}
