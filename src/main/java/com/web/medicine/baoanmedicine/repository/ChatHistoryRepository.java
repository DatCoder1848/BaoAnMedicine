package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory,Long> {
    List<ChatHistory> findByUser_UserIdOrderByTimestampAsc(Long userId);
}
