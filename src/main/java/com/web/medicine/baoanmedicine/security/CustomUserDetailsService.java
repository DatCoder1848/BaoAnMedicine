package com.web.medicine.baoanmedicine.security;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl; // Import class của bạn
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // 1. Tìm user trong DB
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        // 2. QUAN TRỌNG: Trả về UserDetailsImpl (Class của bạn)
        // Thay vì trả về org.springframework.security.core.userdetails.User
        return UserDetailsImpl.build(user);
    }
}