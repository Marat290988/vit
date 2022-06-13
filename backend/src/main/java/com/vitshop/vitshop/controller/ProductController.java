package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.product.ProductDTO;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.service.FileService;
import com.vitshop.vitshop.service.ProductService;
import com.vitshop.vitshop.utility.JWTTokenProvider;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.vitshop.vitshop.service.FileService.VIT_FOLDER;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

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

    @GetMapping("/list")
    public ResponseEntity<Page<ProductEntity>> productList() {
        Pageable page = PageRequest.of(0, 100);
        Page<ProductEntity> products = productService.getProducts(page);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/addproduct")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductEntity> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "composition", required = false) String composition,
            @RequestParam("manufacturer") String manufacturer,
            @RequestParam("category") String category,
            @RequestParam("dPrice") double dPrice,
            @RequestHeader("Authorization") String bToken,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "isActive") String isActive
            ) throws IOException {
        System.out.println(files.toString());
        String token = bToken.substring("Bearer ".length());
        String authorName = jwtTokenProvider.getSubject(token);
        ProductEntity newProduct = productService.addProduct(
                name, description, composition, manufacturer, category, dPrice, authorName, files, Boolean.parseBoolean(isActive)
        );
        return new ResponseEntity<>(newProduct, HttpStatus.OK);
    }

    @GetMapping(path = "/image/{productId}/{fileName}", produces = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
    public ResponseEntity<byte[]> getProfileImage(
            @PathVariable("productId") String productId,
            @PathVariable("fileName") String fileName
    ) throws IOException {
        return new ResponseEntity<>(productService.getProductImage(productId, fileName), HttpStatus.OK);
    }

    @GetMapping("/product_data")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<HashMap<String, Object>> getProductData() {
        HashMap<String, Object> mapCatAndMan = productService.getCategoryAndManufacturer();
        return new ResponseEntity<>(mapCatAndMan, HttpStatus.OK);
    }
 }
