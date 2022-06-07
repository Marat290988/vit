package com.vitshop.vitshop.domain.product;

import javax.persistence.*;

@Entity
@Table(name = "manufacturer_table")
public class ProductManufacturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String manufacturerName;

    public ProductManufacturer() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

}
