package com.vitshop.vitshop.service.impl;

import com.vitshop.vitshop.domain.file.FileEntity;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.domain.user.UserPrincipal;
import com.vitshop.vitshop.repository.ProductRepository;
import com.vitshop.vitshop.service.FileService;
import com.vitshop.vitshop.service.ProductService;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    private Logger LOGGER = LoggerFactory.getLogger(getClass());
    private FileService fileService;

    @Autowired
    public ProductServiceImpl(
        ProductRepository productRepository,
        FileService fileService
    ) {
        this.productRepository = productRepository;
        this.fileService = fileService;
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
            String author,
            MultipartFile[] files
    ) throws IOException {
        ProductEntity product = new ProductEntity();
        product.setProductId(generateProductId());
        product.setName(name);
        product.setDescription(description);
        product.setManufacturer(manufacturer);
        product.setCategory(category);
        product.setComposition(composition);
        product.setBasePrice(dPrice);
        product.setAuthorName(author);
        product.setCreationDate(new Date());
        List<FileEntity> fileEntityList = fileService.saveProductImage(product, files);
        product.setFileList(fileEntityList);
        productRepository.save(product);
        LOGGER.info("Have been created new product: " + product.getName());
        return product;
    }

    public byte[] getProductImage(String productId, String fileName) throws IOException {
        return fileService.getImage(productId, fileName);
    }

    private String generateProductId() {
        return RandomStringUtils.randomAlphanumeric(12);
    }

}
