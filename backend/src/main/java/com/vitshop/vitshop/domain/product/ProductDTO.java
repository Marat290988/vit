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
    private BigDecimal dPrice;
    private boolean isActive;
    private List<FileEntity> files;

    public ProductDTO(ProductEntity product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.composition = product.getComposition();
        this.manufacturer = product.getManufacturer();
        this.category = product.getCategory();
        this.dPrice = product.getBasePrice();
        this.files = product.getFileList();
        this.isActive = product.isActive();
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
        return dPrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.dPrice = basePrice;
    }

    public List<FileEntity> getFileEntityList() {
        return files;
    }

    public void setFileEntityList(List<FileEntity> fileEntityList) {
        this.files = fileEntityList;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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
                ", basePrice=" + dPrice +
                '}';
    }
}
