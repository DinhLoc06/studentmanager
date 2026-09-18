package com.example.studentmanager;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StudentmanagerController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot API";
    }

    @GetMapping("/student/{id}")
    public String getStudent(@PathVariable int id) {
        return "Sinh viên có mã: " + id;
    }

    @GetMapping("/student")
    public String greet(@RequestParam String name) {
    return "Xin chào " + name;
    }

    @GetMapping("/searchStudent")
    public String searchStudent(@RequestParam String name,
                         @RequestParam(defaultValue = "1") int age) {
    return "Tên=" + name + ", tuổi=" + age;
    }

    @GetMapping("/demo-students")
    public Student getStudent() {
        return new Student(1, "Nguyễn Văn A", 20);
    }

    public static class Student {
        private int id;
        private String name;
        private int age;

        public Student(int id, String name, int age) {
            this.id = id;
            this.name = name;
            this.age = age;
        }

        public int getId() {
            return id;
        }
        // getter

        public String getName() {
            return name;
        }
        // setters

        public int getAge() {
            return age;
        }
    }

    @GetMapping("/studenttall")
    public List<student> getstudents() {
    List<student> list = new ArrayList<>();
    list.add(new student(1, "A", 20));
    list.add(new student(2, "B", 21));
    return list;
    }

    @GetMapping("/getstudent")
    public String getStudents(@RequestHeader("Authorization") String inputstring){

    return "Authorization = " + inputstring;
    }

}    


