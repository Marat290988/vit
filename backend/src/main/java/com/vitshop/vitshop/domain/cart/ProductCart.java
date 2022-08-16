package com.vitshop.vitshop.domain.cart;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vitshop.vitshop.domain.order.OrderEntity;
import com.vitshop.vitshop.domain.product.ProductEntity;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productcart_table")
public class ProductCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonManagedReference
    ProductEntity productEntity;

    Integer quantity;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "orderentity_id")
    @JsonIgnoreProperties("productCartList")
    OrderEntity orderEntity;

    public ProductCart(Long id, ProductEntity productEntity, Integer quantity, OrderEntity orderEntity) {
        this.id = id;
        this.productEntity = productEntity;
        this.quantity = quantity;
        this.orderEntity = orderEntity;
    }

    public ProductCart(){}

    public ProductEntity getProductEntity() {
        return productEntity;
    }

    public void setProductEntity(ProductEntity productEntity) {
        this.productEntity = productEntity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderEntity getOrderEntity() {
        return orderEntity;
    }

    public void setOrderEntity(OrderEntity orderEntity) {
        this.orderEntity = orderEntity;
    }

}
