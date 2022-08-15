package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.order.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findAll(Pageable page);
}
