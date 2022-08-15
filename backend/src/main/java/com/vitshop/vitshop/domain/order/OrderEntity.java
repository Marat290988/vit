package com.vitshop.vitshop.domain.order;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vitshop.vitshop.domain.cart.ProductCart;
import com.vitshop.vitshop.domain.user.UserEntity;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "order_table")
@Data
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, name = "orderentity_id")
    private String orderId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orderEntity", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ProductCart> productCartList;

    @Column
    private Date orderDate;

    @Column
    BigDecimal amount;

    public OrderEntity() {}
}
