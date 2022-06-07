package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.service.ProductService;
import com.vitshop.vitshop.utility.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping({"/api/product", "/"})
public class ProductController {
    private ProductService productService;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    ProductController(
            ProductService productService,
            JWTTokenProvider jwtTokenProvider
    ) {
        this.productService = productService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/addproduct")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductEntity> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("composition") String composition,
            @RequestParam("manufacturer") String manufacturer,
            @RequestParam("category") String category,
            @RequestParam("dPrice") double dPrice,
            @RequestHeader("Authorization") String bToken
    ) {
        String token = bToken.substring("Bearer ".length());
        String authorName = jwtTokenProvider.getSubject(token);
        ProductEntity newProduct = productService.addProduct(
                name, description, composition, manufacturer, category, dPrice, authorName
        );
        return new ResponseEntity<>(newProduct, HttpStatus.OK);
    }
}
