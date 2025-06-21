package com.expensetracker.service;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
   
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
   
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUser(Long userId, User updatedUser) {
        Optional<User> existingUser = userRepository.findById(userId);
        
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        
        User user = existingUser.get();
        
        
        if (updatedUser.getFirstName() != null) {
            user.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            user.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
          
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new RuntimeException("Email already exists!");
            }
            user.setEmail(updatedUser.getEmail());
        }
        
        return userRepository.save(user);
    }
    
   
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        
        User user = userOpt.get();
        
      
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect!");
        }
        
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
   
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found!");
        }
        userRepository.deleteById(userId);
    }
    
    
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
    
    
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}

