package com.vitshop.vitshop;

import com.vitshop.vitshop.domain.user.Role;
import com.vitshop.vitshop.domain.user.UserEntity;
import com.vitshop.vitshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;
import java.util.stream.IntStream;

@SpringBootApplication
public class VitshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitshopApplication.class, args);
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
				"Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));
		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
				"Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		return new CorsFilter(urlBasedCorsConfigurationSource);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

//	@Bean
//	CommandLineRunner run(UserRepository userRepository) {
//		return args -> IntStream.rangeClosed(1, 1).forEach(i -> {
//			UserEntity user = new UserEntity();
//			user.setUsername("admin1");
//			user.setEmail("admin1@mail.com");
//			user.setPassword("$2a$10$jWWGQVPyzsCfxCPx.Bll6OaTUSH5J9X6pRsE.YkCPrFYJfJ/c7aVi");
//			user.setUserId(Integer.toString(301));
//			user.setActive(true);
//			user.setNotLocked(true);
//			user.setRole(Role.ROLE_ADMIN);
//			userRepository.save(user);
//		});
//	}

}
