package com.vitshop.vitshop.domain.product;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.vitshop.vitshop.domain.file.FileEntity;
import com.vitshop.vitshop.domain.user.UserPrincipal;
import lombok.Data;
import org.junit.Test;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "product_table")
public class ProductEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String productId;
    @Column
    private String name;
    @Column
    @Lob
    private String description;
    @Column
    @Lob
    private String composition;
    @Column
    private String manufacturer;
    @Column
    @JsonManagedReference
    private String category;
    @Column
    private BigDecimal basePrice;
    @Column
    private String authorName;
    @Column
    private Date creationDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<FileEntity> fileList;
    @Column
    Boolean isActive;

    public ProductEntity(String productId, String name, String description, String composition, String manufacturer, String category, BigDecimal basePrice, String authorName, Date creationDate, boolean isActive, List<FileEntity> fileList) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.composition = composition;
        this.manufacturer = manufacturer;
        this.category = category;
        this.basePrice = basePrice;
        this.authorName = authorName;
        this.creationDate = creationDate;
        this.isActive = isActive;
        this.fileList = fileList;
    }

    public ProductEntity() {

    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public List<FileEntity> getFileList() {
        return fileList;
    }

    public void setFileList(List<FileEntity> fileList) {
        this.fileList = fileList;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setBasePrice(double dPrice) {
        this.basePrice = new BigDecimal(dPrice).setScale(2, RoundingMode.CEILING);
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
}
