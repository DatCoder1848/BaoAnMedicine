package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Advertisement;
import com.web.medicine.baoanmedicine.enums.AdSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    // Lấy quảng cáo theo vị trí, đang hoạt động, sắp xếp theo ưu tiên
    List<Advertisement> findByAdSlotAndIsActiveTrueOrderByPriorityDesc(AdSlot adSlot);
}