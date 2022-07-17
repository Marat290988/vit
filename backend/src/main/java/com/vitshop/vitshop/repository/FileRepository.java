package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.file.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends CrudRepository<FileEntity, Long> {
//    @Query("Select u From FileEntity u Where ProductEntity.productId = :productId")
//    List<FileEntity> findAllFilesByProductId(@Param("productId")  String productId);

    @Query("Select u From FileEntity u Where product_id = :productId")
    List<FileEntity> findAllByProductEquals(Long productId);

    @Query("Select u.id From FileEntity u Where product_id = :productId ORDER BY u.id DESC")
    List<Long> getId(Long productId);

    @Modifying
    @Query("Delete From FileEntity u Where u.id = :id")
    void deleteFileEntityById(Long id);

    FileEntity getFileEntityById(Long id);
}
