package com.vitshop.vitshop.service.impl;

import com.vitshop.vitshop.domain.file.FileEntity;
import com.vitshop.vitshop.domain.product.ProductDTO;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.repository.ProductRepository;
import com.vitshop.vitshop.repository.specification.ProductSpecification;
import com.vitshop.vitshop.service.FileService;
import com.vitshop.vitshop.service.ProductService;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Converter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    private Logger LOGGER = LoggerFactory.getLogger(getClass());
    private FileService fileService;
    private HikariDataSource hikariDataSource;
    private EntityManager entityManager;

    @Autowired
    public ProductServiceImpl(
        ProductRepository productRepository,
        FileService fileService,
        HikariDataSource hikariDataSource,
        EntityManager entityManager
    ) {
        this.productRepository = productRepository;
        this.fileService = fileService;
        this.hikariDataSource = hikariDataSource;
        this.entityManager = entityManager;
    }

    @Override
    public Page<ProductDTO> getProducts(Pageable page) {
        return productRepository.getAllProducts(page);
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
            MultipartFile[] files,
            boolean isActive,
            int activeImg
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
        product.setActive(isActive);
        if (files != null) {
            List<FileEntity> fileEntityList = fileService.saveProductImage(product, files, activeImg);
            product.setFileList(fileEntityList);
        }
        productRepository.save(product);
        LOGGER.info("Have been created new product: " + product.getName());
        return product;
    }

    public byte[] getProductImage(String productId, String fileName) throws IOException {
        return fileService.getImage(productId, fileName);
    }

    @Override
    public HashMap<String, Object> getCategoryAndManufacturer() {
        List<String> categoryList = productRepository.getAllCategory();
        List<String> manufacturerList = productRepository.getAllManufacturer();
        HashMap<String, Object> mapCatAndMan = new HashMap<>();
        mapCatAndMan.put("category", categoryList);
        mapCatAndMan.put("manufacturer", manufacturerList);
        return mapCatAndMan;
    }

    @Override
    public void deleteProduct(String productId) throws UserNotFoundException {
        ProductEntity productEntity = productRepository.findProductEntityByProductId(productId);
        if (productEntity == null) {
            throw new UserNotFoundException("Product not found with this productId");
        };
        productRepository.deleteById(productEntity.getId());
    }

    @Override
    public List<HashMap<String, Object>> getFileList(String productId) throws NoSuchFieldException, IllegalAccessException, IOException {
        ProductEntity productEntity = productRepository.findProductEntityByProductId(productId);
        return fileService.getFileList(productEntity.getId(), productId);
    }

    private String generateProductId() {
        return RandomStringUtils.randomAlphanumeric(12);
    }

    public Page<ProductDTO> getProductWithFilter(Specification<ProductEntity> spec, Pageable page) {
        Page<ProductEntity> pageProductEntity = productRepository.findAll(spec, page);
        Page<ProductDTO> pageProductDTO = pageProductEntity.map(el -> new ProductDTO(el));
        return pageProductDTO;
    }

}
