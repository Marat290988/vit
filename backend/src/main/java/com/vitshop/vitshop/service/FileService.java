package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.file.FileEntity;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.repository.FileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
public class FileService {
    //private final String sep = System.getProperty("os.name").toLowerCase().contains("win") ? "\\" : "/";
    public static final String VIT_FOLDER = System.getProperty("user.home") + "/vit/product/";
    public static final String DOT = ".";
    public static final String FORWARD_SLASH = "/";
    public static final String PRODUCT_IMAGE_PATH = "api/product/image/";
    private FileRepository fileRepository;
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    public FileService(
            FileRepository fileRepository
    ) {
        this.fileRepository = fileRepository;
    }

    public List<FileEntity> saveProductImage(ProductEntity product, MultipartFile[] listFile) throws IOException {
        List<FileEntity> productFileList = new ArrayList<>();
        int n = 1;
        for (MultipartFile file: listFile) {
            System.out.println(n);
            FileEntity fileEntity = new FileEntity();
            boolean mainState = n == 1 ? true : false;
            fileEntity.setMainFlag(mainState);
            fileEntity.setProduct(product);
            Path productFolder = Paths.get(VIT_FOLDER + product.getProductId()).toAbsolutePath().normalize();
            if (!Files.exists(productFolder)) {
                Files.createDirectories(productFolder);
                LOGGER.info("Created directory for: " + productFolder);
            }
            String fileName = file.getOriginalFilename();
            String EXTENSION = "";
            if (fileName.lastIndexOf(".") > -1) {
                EXTENSION = fileName.substring(fileName.lastIndexOf(DOT), fileName.length());
            }
            Files.deleteIfExists(Paths.get(productFolder + product.getProductId() + n + EXTENSION));
            Files.copy(file.getInputStream(), productFolder.resolve(product.getProductId() + n + EXTENSION), REPLACE_EXISTING);
            fileEntity.setPath(setProductImageUrl(product.getProductId(), n, EXTENSION));
            productFileList.add(fileEntity);
            ++n;
        }
        return productFileList;
    }

    public byte[] getImage(String productId, String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(VIT_FOLDER + productId + FORWARD_SLASH + fileName));
    }

    private String setProductImageUrl (String productId, int n, String EXT) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(
                PRODUCT_IMAGE_PATH + productId + FORWARD_SLASH + productId + n + EXT
        ).toUriString();
    }

}
