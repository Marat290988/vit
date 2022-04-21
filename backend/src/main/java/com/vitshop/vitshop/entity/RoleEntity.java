package com.vitshop.vitshop.entity;

import lombok.Data;
import javax.persistence.*;

@Entity(name = "role_table")
@Data
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name;
}
