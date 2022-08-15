package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.cart.ProductCart;
import com.vitshop.vitshop.domain.order.OrderEntity;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.repository.OrderRepository;
import com.vitshop.vitshop.repository.ProductCartRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private OrderRepository orderRepository;
    private UserService userService;
    private ProductService productService;
    private ProductCartRepository productCartRepository;

    @Autowired
    OrderService (
            OrderRepository orderRepository,
            UserService userService,
            ProductService productService,
            ProductCartRepository productCartRepository
    ) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.productService = productService;
        this.productCartRepository = productCartRepository;
    }

    public void saveOrder(OrderEntity orderEntity) {
        this.orderRepository.save(orderEntity);
    }

    public OrderEntity createOrder(
            String userId,
            HashMap<String, String>[] productIds
    ) throws UserNotFoundException {
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderId(RandomStringUtils.randomAlphanumeric(12));
        List<String> listProductIds = new ArrayList<>();
        List<ProductCart> productCartList = new ArrayList<>();
        HashMap<String, ProductCart> hashProductCart = new HashMap<>();
        BigDecimal amount = new BigDecimal(0).setScale(2, RoundingMode.CEILING);
        for (int i = 0; i < productIds.length; i++) {
            ProductCart cart = new ProductCart();
            cart.setQuantity(Integer.parseInt(productIds[i].get("qty")));
            cart.setOrderEntity(orderEntity);
            hashProductCart.put(
                    productIds[i].get("productId"),
                    cart
            );
            listProductIds.add(productIds[i].get("productId"));
        }
        List<ProductEntity> productEntityList = productService.findProducts(listProductIds);
        for (ProductEntity product: productEntityList) {
            hashProductCart.get(product.getProductId()).setProductEntity(product);
            Integer qty = hashProductCart.get(product.getProductId()).getQuantity();
            BigDecimal price = hashProductCart.get(product.getProductId()).getProductEntity().getBasePrice();
            amount = amount.add(price.multiply(new BigDecimal(qty)));
        }
        productCartList = hashProductCart.values().stream().collect(Collectors.toCollection(ArrayList::new));
        orderEntity.setUserEntity(userService.findUserEntityByUserId(userId));
        orderEntity.setProductCartList(productCartList);
        orderEntity.setOrderDate(new Date());
        amount = amount.add(amount.multiply(new BigDecimal("0.1")).setScale(2, RoundingMode.CEILING));
        orderEntity.setAmount(amount);
        return orderEntity;
    }

    public Page<OrderEntity> findAll(Pageable page) {
        return orderRepository.findAll(page);
    }
}
