package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // Tìm tất cả địa chỉ của 1 user
    List<Address> findByUser_UserId(Long userId);
}