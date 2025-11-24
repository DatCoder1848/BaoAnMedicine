package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ObjectNotFoundException("Not found userId: {}", userId));
    }
}
