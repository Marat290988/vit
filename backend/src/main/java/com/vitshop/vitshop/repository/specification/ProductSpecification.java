package com.vitshop.vitshop.repository.specification;

import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;

public class ProductSpecification  implements Specification<ProductEntity> {

    private String manufacturer;

    public ProductSpecification(

    ) {

    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    @Override
    public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = criteriaBuilder.greaterThan(root.get("id"), 0);
        if (this.manufacturer != null) {
            predicate = criteriaBuilder.and(criteriaBuilder.like(root.get("manufacturer"), this.manufacturer));
        }
        return predicate;
    }
}

//public class ProductSpecification {
//    public static Specification<ProductEntity> searchWithFilter() {
//        return new Specification<ProductEntity>() {
//            public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
//                Predicate predicate = criteriaBuilder.greaterThan(root.get("id"), 0);
//                return predicate;
//            }
//        };
//    }
//}


