package com.vitshop.vitshop.service;

import com.vitshop.vitshop.domain.file.FileEntity;
import com.vitshop.vitshop.domain.product.ProductEntity;
import com.vitshop.vitshop.repository.FileRepository;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public List<FileEntity> saveProductImage(ProductEntity product, MultipartFile[] listFile, int activeImg) throws IOException {
        List<FileEntity> productFileList = new ArrayList<>();
        int n = 1;
        for (MultipartFile file: listFile) {
            FileEntity fileEntity = new FileEntity();
            boolean mainState = n == activeImg+1 ? true : false;
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
            fileEntity.setName(product.getProductId() + n + EXTENSION);
            productFileList.add(fileEntity);
            ++n;
        }
        return productFileList;
    }

    public byte[] getImage(String productId, String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(VIT_FOLDER + productId + FORWARD_SLASH + fileName));
    }

    public List<HashMap<String, Object>> getFileList(Long productId, String prId) throws NoSuchFieldException, IllegalAccessException, IOException {
        List<HashMap<String, Object>> fileList = new ArrayList<>();
        List<FileEntity> fileEntityList = fileRepository.findAllByProductEquals(productId);
        for (FileEntity f: fileEntityList) {
            HashMap<String, Object> hMap = new HashMap<>();
            hMap.put("id",f.getId());
            Pattern pattern = Pattern.compile("\\/.[^\\/]+$");
            Matcher matcher = pattern.matcher(f.getPath());
            String fileName = "";
            while (matcher.find()) {
                fileName = f.getPath().substring(matcher.start()+1, matcher.end());
            }
            hMap.put("file", Files.readAllBytes(Paths.get(VIT_FOLDER + prId + FORWARD_SLASH + fileName)));
            hMap.put("active", f.isMainFlag());
            fileList.add(hMap);
        }
        return fileList;
    }

    public List<FileEntity> saveFileEditProduct(
            ProductEntity product,
            ArrayList<HashMap<String, String>> fileList
    ) throws IOException {
        List<FileEntity> productFileList = new ArrayList<>();
        List<FileEntity> fileListFromProduct = fileRepository.findAllByProductEquals(product.getId());
        long lastId = fileRepository.getId(product.getId()).get(0);
        int i = (int)lastId;
        if (fileList.size() > 0) {
            for (HashMap<String, String> fileData: fileList) {
                i++;
                FileEntity fileEntity = new FileEntity();
                String base64 = fileData.get("file");
                String status = fileData.get("main");
                String ext = fileData.get("fileName").substring(fileData.get("fileName").lastIndexOf(DOT), fileData.get("fileName").length());
                Base64.Decoder decoder = Base64.getDecoder();
                byte[] decodedByte = decoder.decode(base64.split(",")[1]);
                Path productFolder = Paths.get(VIT_FOLDER + product.getProductId()).toAbsolutePath().normalize();
                if (!Files.exists(productFolder)) {
                    Files.createDirectories(productFolder);
                }
                File file = new File(productFolder + FORWARD_SLASH + product.getProductId() + i + ext);
                fileEntity.setName(product.getProductId() + i + ext);
                fileEntity.setProduct(product);
                fileEntity.setPath(setProductImageUrl(product.getProductId(), i, ext));
                if (status.equalsIgnoreCase("active")) {
                    for (FileEntity fItem: fileListFromProduct) {
                        fItem.setMainFlag(false);
                    }
                }
                fileEntity.setMainFlag(status.equalsIgnoreCase("active"));
                FileOutputStream fos = new FileOutputStream(file);
                fos.write(decodedByte);
                fos.close();
                productFileList.add(fileEntity);
            }
        }
        if (fileListFromProduct.size() > 0) {
            productFileList.addAll(fileListFromProduct);
        }
        return productFileList;
    }

//    Users user = userRepository.findUsersByUsername(username);
//    Path userFolder = Paths.get(USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();
//    FileUtils.deleteDirectory(new File(userFolder.toString()));
//    userRepository.deleteById(user.getId());


    @Transactional
    public List<FileEntity> removeFile(String productId, Long id, List<Integer> deleteList) {
        for (Integer iId: deleteList) {
            Long lId = new Long(iId);
            System.out.println(lId);
            fileRepository.deleteFileEntityById(lId);
        }
//        FileEntity fileEntity = fileRepository.getById(id);
//        Path filePath = Paths.get(VIT_FOLDER + productId + FORWARD_SLASH + fileEntity.getName()).toAbsolutePath().normalize();
//        File file = new File(filePath.toString());
//        if (file.exists()) {
//            file.delete();
//        }
//        fileRepository.deleteById(id);
        return fileRepository.findAllByProductEquals(id);
    }

    private String setProductImageUrl (String productId, int n, String EXT) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(
                PRODUCT_IMAGE_PATH + productId + FORWARD_SLASH + productId + n + EXT
        ).toUriString();
    }

}
