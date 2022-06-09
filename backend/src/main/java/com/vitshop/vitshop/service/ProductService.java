package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public interface ProductService {
    Page<ProductEntity> getProducts(Pageable page);

    ProductEntity addProduct(
            String name,
            String description,
            String composition,
            String manufacturer,
            String category,
            double dPrice,
            String author,
            MultipartFile[] files
    ) throws IOException;

    byte[] getProductImage(String productId, String fileName) throws IOException;

    HashMap<String, Object> getCategoryAndManufacturer();
}
