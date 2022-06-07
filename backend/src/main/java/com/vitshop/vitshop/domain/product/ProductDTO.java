package com.vitshop.vitshop.domain.product;

import java.math.BigDecimal;

public class ProductDTO {
    private String productId;
    private String name;
    private String description;
    private String composition;
    private String manufacturer;
    private String category;
    private BigDecimal basePrice;

    public ProductDTO(ProductEntity product) {
        this.productId = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.composition = product.getComposition();
        this.manufacturer = product.getManufacturer();
        this.category = product.getCategory();
        this.basePrice = product.getBasePrice();
    }
}
