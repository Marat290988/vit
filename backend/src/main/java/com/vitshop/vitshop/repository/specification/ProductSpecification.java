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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;

public class ProductSpecification  implements Specification<ProductEntity> {

    private String productName;
    private ArrayList<String> catListSelected;
    private ArrayList<String> manListSelected;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    public ProductSpecification(

    ) {

    }

    @Override
    public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = criteriaBuilder.greaterThan(root.get("id"), 0);
        if (productName != null) {
            predicate = criteriaBuilder.and(criteriaBuilder.like(root.get("name"), productName));
        }
        if (catListSelected != null) {
            for (int i = 0; i < catListSelected.size(); i++) {
                predicate = criteriaBuilder.and(criteriaBuilder.like(root.get("category"), "%" + catListSelected.get(i) + "%"));
            }
        }
        if (manListSelected != null) {
            for (int i = 0; i < manListSelected.size(); i++) {
                predicate = criteriaBuilder.and(criteriaBuilder.like(root.get("manufacturer"), "%" + manListSelected.get(i) + "%"));
            }
        }
        if (minPrice != null) {
            predicate = criteriaBuilder.and(criteriaBuilder.greaterThan(root.get("basePrice"), minPrice));
        }
        if (maxPrice != null) {
            predicate = criteriaBuilder.and(criteriaBuilder.lessThan(root.get("basePrice"), maxPrice));
        }
        return predicate;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public ArrayList<String> getCatListSelected() {
        return catListSelected;
    }

    public void setCatListSelected(ArrayList<String> catListSelected) {
        this.catListSelected = catListSelected;
    }

    public ArrayList<String> getManListSelected() {
        return manListSelected;
    }

    public void setManListSelected(ArrayList<String> manListSelected) {
        this.manListSelected = manListSelected;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(double minPrice) {
        this.minPrice = new BigDecimal(minPrice).setScale(2, BigDecimal.ROUND_DOWN);
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(double maxPrice) {
        this.maxPrice = new BigDecimal(maxPrice).setScale(2, BigDecimal.ROUND_DOWN);
    }

    @Override
    public String toString() {
        return "ProductSpecification{" +
                "productName='" + productName + '\'' +
                ", catListSelected=" + catListSelected +
                ", manListSelected=" + manListSelected +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                '}';
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


