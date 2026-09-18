package com.example.studentmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication(scanBasePackages = "com.example")
@EntityScan("com.example.entity")
@EnableJpaRepositories("com.example.repository")
public class StudentmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentmanagerApplication.class, args);
	}

}