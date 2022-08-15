package com.vitshop.vitshop.domain.cart;

import com.vitshop.vitshop.domain.user.UserEntity;

import javax.persistence.*;

@Entity
@Table(name = "cart_table")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    private String userId;

    @Column
    @Lob
    private String cartText;

    public CartEntity() {};

    public CartEntity(Long id, String userId, String cartText) {
        this.id = id;
        this.userId = userId;
        this.cartText = cartText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCartText() {
        return cartText;
    }

    public void setCartText(String cartText) {
        this.cartText = cartText;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
