package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.cart.CartEntity;
import com.vitshop.vitshop.repository.CartRepository;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Service
public class CartService {
    CartRepository cartRepository;
    HikariDataSource hikariDataSource;

    @Autowired
    public CartService(
            CartRepository cartRepository,
            HikariDataSource hikariDataSource
    ) {
        this.cartRepository = cartRepository;
        this.hikariDataSource = hikariDataSource;
    }

    public CartEntity findCartEntity(String userId) {
        return cartRepository.getCart(userId);
    }

    public void saveCart(String cartText, String userId) throws SQLException {
        Connection connection = hikariDataSource.getConnection();
        String SQL = "Insert Into Cart_Table (Cart_Text, User_Id) Values(?, ?)";
        PreparedStatement preparedStatement = connection.prepareStatement(SQL);
        preparedStatement.setString(1, cartText);
        preparedStatement.setString(2, userId);
        preparedStatement.executeUpdate();
        preparedStatement.close();
        connection.close();
    }

    public void updateCart(String cartText, String userId) throws SQLException {
        Connection connection = hikariDataSource.getConnection();
        String SQL = "Update Cart_Table t Set t.Cart_Text = ? Where t.User_Id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(SQL);
        preparedStatement.setString(1, cartText);
        preparedStatement.setString(2, userId);
        preparedStatement.executeUpdate();
        preparedStatement.close();
        connection.close();
    }

}
