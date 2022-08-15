package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.cart.ProductCart;
import com.vitshop.vitshop.domain.order.OrderEntity;
import com.vitshop.vitshop.exceptions.UserNotFoundException;
import com.vitshop.vitshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    private OrderService orderService;

    @Autowired
    OrderController (OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place_order/{id}")
    public ResponseEntity<OrderEntity> saveOrder(
            @PathVariable("id") String userId,
            @RequestBody HashMap<String, String>[] productIds
            ) throws UserNotFoundException {
        OrderEntity orderEntity = orderService.createOrder(userId, productIds);
        orderService.saveOrder(orderEntity);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<OrderEntity>> getOrderList(Pageable page) {
        Page<OrderEntity> list = orderService.findAll(page);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
