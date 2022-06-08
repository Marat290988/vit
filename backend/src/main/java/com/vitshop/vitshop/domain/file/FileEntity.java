package com.vitshop.vitshop.domain.file;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.vitshop.vitshop.domain.product.ProductEntity;

import javax.persistence.*;

@Entity
@Table(name = "file_table")
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    String path;

    @Column
    boolean mainFlag;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    ProductEntity product;

    public FileEntity(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isMainFlag() {
        return mainFlag;
    }

    public void setMainFlag(boolean mainFlag) {
        this.mainFlag = mainFlag;
    }

    public ProductEntity getProduct() {
        return product;
    }

    public void setProduct(ProductEntity product) {
        this.product = product;
    }
}
