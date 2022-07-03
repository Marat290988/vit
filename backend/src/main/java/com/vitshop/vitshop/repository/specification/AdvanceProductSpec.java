package com.vitshop.vitshop.repository.specification;

import com.vitshop.vitshop.domain.product.ProductEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Component
public class AdvanceProductSpec {
    public Specification<ProductEntity> getProducts(HashMap<String, Object> filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.containsKey("product") && filter.get("product") != null) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + filter.get("product").toString().toLowerCase() + "%"
                        )
                );
            }
            if (filter.containsKey("catListSelected") && filter.get("catListSelected") != null) {
                ArrayList<String> list = (ArrayList<String>)filter.get("catListSelected");
                for (int i = 0; i < list.size(); i++) {
                    predicates.add(
                            criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get("category")),
                                    "%" + list.get(i).toLowerCase() + "%"
                            )
                    );
                }
            }
            if (filter.containsKey("manListSelected") && filter.get("manListSelected") != null) {
                ArrayList<String> list = (ArrayList<String>)filter.get("manListSelected");
                for (int i = 0; i < list.size(); i++) {
                    predicates.add(
                            criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get("manufacturer")),
                                    "%" + list.get(i).toLowerCase() + "%"
                            )
                    );
                }
            }
            if (filter.containsKey("minPrice") && filter.get("minPrice") != null) {
                if (filter.get("minPrice").getClass() == Integer.class) {
                    Integer i = (Integer) filter.get("minPrice");
                    double d = i.doubleValue();
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("basePrice"), d));
                } else {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("basePrice"), (Double)filter.get("minPrice")));
                }
            }
            if (filter.containsKey("maxPrice") && filter.get("maxPrice") != null) {
                if (filter.get("maxPrice").getClass() == Integer.class) {
                    Integer i = (Integer) filter.get("maxPrice");
                    double d = i.doubleValue();
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), d));
                } else {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), (Double)filter.get("maxPrice")));
                }
            }
            query.orderBy(criteriaBuilder.asc(root.get("name")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
