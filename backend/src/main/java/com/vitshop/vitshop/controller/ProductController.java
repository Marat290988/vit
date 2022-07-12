package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.HttpResponse;
import com.vitshop.vitshop.domain.product.ProductDTO;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.repository.specification.AdvanceProductSpec;
import com.vitshop.vitshop.repository.specification.ProductSpecification;
import com.vitshop.vitshop.service.FileService;
import com.vitshop.vitshop.service.ProductService;
import com.vitshop.vitshop.utility.JWTTokenProvider;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.IOUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import static com.vitshop.vitshop.service.FileService.VIT_FOLDER;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@Controller
@RequestMapping({"/api/product", "/"})
public class ProductController {
    private ProductService productService;
    private JWTTokenProvider jwtTokenProvider;
    private AdvanceProductSpec advanceProductSpec;

    @Autowired
    ProductController(
            ProductService productService,
            JWTTokenProvider jwtTokenProvider,
            AdvanceProductSpec advanceProductSpec
    ) {
        this.productService = productService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.advanceProductSpec = advanceProductSpec;
    }

    @PostMapping("/list")
    public ResponseEntity<Page<ProductDTO>> productList(Pageable page, @RequestBody HashMap<String, Object> filter) {
        Specification<ProductEntity> spec = advanceProductSpec.getProducts(filter);
        return new ResponseEntity<>(productService.getProductWithFilter(spec, page), HttpStatus.OK);
    }

    @PostMapping("/addproduct")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductEntity> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(name = "composition", required = false) String composition,
            @RequestParam("manufacturer") String manufacturer,
            @RequestParam("category") String category,
            @RequestParam("dPrice") double dPrice,
            @RequestHeader("Authorization") String bToken,
            @RequestParam(name = "files", required = false) MultipartFile[] files,
            @RequestParam("isActive") String isActive,
            @RequestParam("activeImg") int activeImg
            ) throws IOException {
        String token = bToken.substring("Bearer ".length());
        String authorName = jwtTokenProvider.getSubject(token);
        ProductEntity newProduct = productService.addProduct(
                name, description, composition, manufacturer, category, dPrice, authorName, files, Boolean.parseBoolean(isActive), activeImg
        );
        return new ResponseEntity<>(newProduct, HttpStatus.OK);
    }

//    @Bean
//    public FilterRegistrationBean registration(HiddenHttpMethodFilter filter) {
//        FilterRegistrationBean registration = new FilterRegistrationBean(filter);
//        registration.setEnabled(false);
//        return registration;
//    }

    @PostMapping("/edit_product")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductEntity> editProduct(
            //@RequestBody HashMap<String, Object> editProduct
            HttpServletRequest req
            ) throws IOException, ClassNotFoundException {
        //byte[] processedText = req.getParameter()

        //System.out.println(i.getClass());
        //LinkedHashMap lM = (LinkedHashMap) editProduct.get("files");
//        HashMap a = (LinkedHashMap)editProduct.get("files");
        InputStream input = req.getInputStream();
        ObjectInputStream ois = new ObjectInputStream(input);
        HashMap<String, Object> data = (HashMap<String, Object>)ois.readObject();
        System.out.println(data);
//        System.out.println(a.getClass());
        //System.out.println(t.toString());
        return null;
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

    @DeleteMapping(path = "delete/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<HttpResponse> deleteProduct(@PathVariable("productId") String productId) throws UserNotFoundException {
        productService.deleteProduct(productId);
        return response(HttpStatus.OK, "PRODUCT DELETED SUCCESSFULLY");
    }

    @GetMapping("filelist/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<HashMap<String, Object>>> getFileList(
            @PathVariable("productId") String productId
    ) throws IOException, NoSuchFieldException, IllegalAccessException {
        this.productService.getFileList(productId);
//        List<byte[]> fileList = new ArrayList<>();
//        for (HashMap<String, String> hMap : urlList) {
//            fileList.add(productService.getProductImage((String) hMap.get("productId"), (String)hMap.get("fileName")));
//        }
//        return new ResponseEntity<>(fileList, HttpStatus.OK);
        return new ResponseEntity(this.productService.getFileList(productId), HttpStatus.OK);
    }

//    Specification<ProductEntity> initSpec(HashMap<String, Object> filter) {
//        Specification<ProductEntity> spec = new ProductSpecification();
//        if (filter.containsKey("product")) {
//            ((ProductSpecification) spec).setProductName((String)filter.get("product"));
//        }
//        if (filter.containsKey("catListSelected")) {
//            ((ProductSpecification) spec).setCatListSelected((ArrayList<String>) filter.get("catListSelected"));
//        }
//        if (filter.containsKey("manListSelected")) {
//            ((ProductSpecification) spec).setManListSelected((ArrayList<String>) filter.get("manListSelected"));
//        }
//        if (filter.containsKey("minPrice")) {
//            if (filter.get("minPrice").getClass() == Integer.class) {
//                Integer i = (Integer) filter.get("minPrice");
//                double d = i.doubleValue();
//                ((ProductSpecification) spec).setMinPrice(d);
//            } else {
//                ((ProductSpecification) spec).setMinPrice((Double) filter.get("minPrice"));
//            }
//        }
//        if (filter.containsKey("maxPrice")) {
//            if (filter.get("maxPrice").getClass() == Integer.class) {
//                Integer i = (Integer) filter.get("maxPrice");
//                double d = i.doubleValue();
//                ((ProductSpecification) spec).setMaxPrice(d);
//            } else {
//                ((ProductSpecification) spec).setMaxPrice((Double) filter.get("maxPrice"));
//            }
//        }
//        return spec;
//    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(
                new HttpResponse(httpStatus.value(),
                        httpStatus,
                        httpStatus.getReasonPhrase().toUpperCase(),
                        message.toUpperCase()
                ), httpStatus);
    }
 }
