package com.backend.ehealthspringboot.repository;

import com.backend.ehealthspringboot.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface UserRepository extends JpaRepository<User, Long> {

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    User findByUsername(String username);



    List<User> findByRole(String role);

//    @Query("from Doctor")
//    List<Doctor> findAllDoctors();
//
//    @Query("from Doctor")
//    Doctor findDoctorByUsername(String doctorUsername);
//
//    @Query("from Visitor")
//    List<Visitor> findAllVisitors();
}
