package com.vitshop.vitshop.service.impl;

import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.domain.user.UserPrincipal;
import com.vitshop.vitshop.repository.ProductRepository;
import com.vitshop.vitshop.service.ProductService;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public ProductServiceImpl(
        ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    @Override
    public Page<ProductEntity> getProducts(Pageable page) {
        return productRepository.findAll(page);
    }

    @Override
    public ProductEntity addProduct(
            String name,
            String description,
            String composition,
            String manufacturer,
            String category,
            double dPrice,
            String author
    ) {
        ProductEntity product = new ProductEntity();
        product.setProductId(generateProductId());
        product.setName(name);
        product.setDescription(description);
        product.setManufacturer(manufacturer);
        product.setCategory(category);
        product.setBasePrice(dPrice);
//        Object userPrincipal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String authorName = null;
//        if (userPrincipal instanceof UserPrincipal) {
//            authorName = ((UserPrincipal)userPrincipal).getUsername();
//        };
        product.setAuthorName(author);
        product.setCreationDate(new Date());
        productRepository.save(product);
        LOGGER.info("Have been created new product: " + product.getName());
        return product;
    }

    private String generateProductId() {
        return RandomStringUtils.randomAlphanumeric(12);
    }

}
