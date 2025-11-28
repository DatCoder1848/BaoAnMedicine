package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.AddressDto;
import com.web.medicine.baoanmedicine.model.Address;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.AddressRepository;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired private AddressRepository addressRepository;
    @Autowired private UserRepository userRepository;

    // 1. Lấy danh sách địa chỉ
    public List<AddressDto> getAddressesByUserId(Long userId) {
        return addressRepository.findByUser_UserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 2. Thêm địa chỉ mới
    @Transactional
    public AddressDto addAddress(Long userId, AddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Address> existingAddresses = addressRepository.findByUser_UserId(userId);

        Address address = new Address();
        address.setUser(user);
        address.setRecipientName(dto.getRecipientName());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setSpecificAddress(dto.getSpecificAddress());
        address.setCity(dto.getCity());
        address.setLabel(dto.getLabel());

        // Logic Default:
        // Nếu đây là địa chỉ đầu tiên -> Mặc định là True
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        } else {
            // Nếu user chọn True -> Set các cái cũ thành False
            if (Boolean.TRUE.equals(dto.getIsDefault())) {
                existingAddresses.forEach(a -> a.setIsDefault(false));
                addressRepository.saveAll(existingAddresses);
                address.setIsDefault(true);
            } else {
                address.setIsDefault(false);
            }
        }

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    // 3. Xóa địa chỉ
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Bảo mật: Chỉ xóa nếu địa chỉ thuộc về user đó
        if (!address.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa địa chỉ này");
        }

        addressRepository.delete(address);
    }

    // 4. Thiết lập mặc định
    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        List<Address> addresses = addressRepository.findByUser_UserId(userId);

        for (Address addr : addresses) {
            if (addr.getId().equals(addressId)) {
                addr.setIsDefault(true);
            } else {
                addr.setIsDefault(false);
            }
        }
        addressRepository.saveAll(addresses);
    }

    // Helper: Map Entity -> DTO (Thủ công cho nhanh, hoặc dùng Mapper nếu muốn)
    private AddressDto mapToDto(Address entity) {
        return new AddressDto(
                entity.getId(),
                entity.getRecipientName(),
                entity.getPhoneNumber(),
                entity.getSpecificAddress(),
                entity.getCity(),
                entity.getIsDefault(),
                entity.getLabel()
        );
    }
}