package com.vitshop.vitshop.domain.cart;

import com.vitshop.vitshop.domain.user.UserEntity;

import javax.persistence.*;

@Entity
@Table(name = "cart_table")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity userEntity;

    @Column
    @Lob
    private String cartText;

    public CartEntity() {};

    public CartEntity(Long id, UserEntity userEntity, String cartText) {
        this.id = id;
        this.userEntity = userEntity;
        this.cartText = cartText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public String getCartText() {
        return cartText;
    }

    public void setCartText(String cartText) {
        this.cartText = cartText;
    }
}
