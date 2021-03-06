package com.backend.ehealthspringboot.service;

import java.io.IOException;
import java.util.List;

import com.backend.ehealthspringboot.domain.*;
import com.backend.ehealthspringboot.exception.domain.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;

public interface UserService {

    User findUserByUsername(String username) ;

    User findUserByEmail(String email);

    User register(User user) throws Exception;
//    User addNewUser(User user);

//    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws UserNotFoundException, EmailExistException, UsernameExistException, IOException, NotAnImageFileException;


    void deleteUser(String username) throws IOException;

    void resetPassword(String email) throws EmailNotFoundException, MessagingException;


    List<User> getUsers();


    List<User> getUsersByRole(String role);

    User updateUser(String loggedInUsername, String currentUsername, User user) throws UserNotFoundException, EmailExistException, UsernameExistException;
}
