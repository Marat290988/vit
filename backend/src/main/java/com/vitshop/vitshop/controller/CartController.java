package com.vitshop.vitshop.controller;

import com.vitshop.vitshop.domain.cart.CartEntity;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    CartService cartService;

    @Autowired
    public CartController (
            CartService cartService
    ) {
        this.cartService = cartService;
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<String> saveOrUpdateCart(
            @PathVariable("id") String userId,
            @RequestBody String cartText
    ) throws SQLException {
        CartEntity cartEntity = cartService.findCartEntity(userId);
        if (cartEntity == null) {
            cartEntity = new CartEntity();
            cartEntity.setCartText(cartText);
            cartService.saveCart(cartEntity.getCartText(), userId);
        } else {
            cartEntity = new CartEntity();
            cartEntity.setCartText(cartText);
            cartService.updateCart(cartEntity.getCartText(), userId);
        }
        return new ResponseEntity<>(cartEntity.getCartText(), HttpStatus.OK);
    }

    @GetMapping("/usercart/{userId}")
    public ResponseEntity<String> getCart(@PathVariable("userId") String userId) {
        CartEntity cart = cartService.findCartEntity(userId);
        if (cart != null) {
            return new ResponseEntity<>(cartService.findCartEntity(userId).getCartText(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cart with this id does not exist", HttpStatus.OK);
        }
    }
}
