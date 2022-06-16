package com.vitshop.vitshop.domain.product;

import com.vitshop.vitshop.domain.file.FileEntity;

import java.math.BigDecimal;
import java.util.List;

public class ProductDTO {
    private String productId;
    private String name;
    private String description;
    private String composition;
    private String manufacturer;
    private String category;
    private BigDecimal basePrice;
    private List<FileEntity> fileEntityList;

    public ProductDTO(ProductEntity product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.composition = product.getComposition();
        this.manufacturer = product.getManufacturer();
        this.category = product.getCategory();
        this.basePrice = product.getBasePrice();
        this.fileEntityList = product.getFileList();
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getComposition() {
        return composition;
    }

    public void setComposition(String composition) {
        this.composition = composition;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public List<FileEntity> getFileEntityList() {
        return fileEntityList;
    }

    public void setFileEntityList(List<FileEntity> fileEntityList) {
        this.fileEntityList = fileEntityList;
    }

    @Override
    public String toString() {
        return "ProductDTO{" +
                "productId='" + productId + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", composition='" + composition + '\'' +
                ", manufacturer='" + manufacturer + '\'' +
                ", category='" + category + '\'' +
                ", basePrice=" + basePrice +
                '}';
    }
}
