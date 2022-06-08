package com.vitshop.vitshop.repository;

import com.vitshop.vitshop.domain.file.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
}
