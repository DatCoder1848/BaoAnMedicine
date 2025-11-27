package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.request.ChatRequestDTO;
import com.web.medicine.baoanmedicine.dto.response.ChatResponseDTO;
import com.web.medicine.baoanmedicine.service.AiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired private AiChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            Authentication authentication, // Thử dùng Authentication thay vì @AuthenticationPrincipal
            @RequestBody ChatRequestDTO request) {

        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication is NULL");
        }

        Object principal = authentication.getPrincipal();
        System.out.println("Principal class: " + principal.getClass().getName());

        if (principal instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            return ResponseEntity.ok(chatService.processChat(userDetails.getUserId(), request.getMessage()));
        } else {
            return ResponseEntity.status(500).body("Principal is not UserDetailsImpl");
        }
    }
}