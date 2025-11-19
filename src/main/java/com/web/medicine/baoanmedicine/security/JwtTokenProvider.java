package com.web.medicine.baoanmedicine.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Hàm 1: Tạo Token (Đã sửa cú pháp)
    public String generateToken(Authentication authentication){
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        // Cú pháp tương thích với JJWT 0.11.x
        return Jwts.builder()
                .setSubject(username) // Thay thế .subject() bằng .setSubject()
                .setIssuedAt(new Date()) // Thay thế .issuedAt() bằng .setIssuedAt()
                .setExpiration(expireDate) // Thay thế .expiration() bằng .setExpiration()
                .signWith(key()) // Cú pháp ký đơn giản hơn (sử dụng Keys.hmacShaKeyFor)
                .compact();
    }

    // Hàm 2: Lấy username từ Token (Đã sửa cú pháp)
    public String getUsername(String token){
        // Cú pháp tương thích với JJWT 0.11.x
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                // KHÔNG CẦN .build() trong phiên bản 0.11.x
                .build() // Giữ .build() nếu bạn muốn giữ code hiện đại, nhưng nếu lỗi thì bỏ .build() này đi.
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Hàm 3: Validate Token (Đã sửa cú pháp)
    public boolean validateToken(String token){
        try{
            // Cú pháp tương thích với JJWT 0.11.x
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build() // Giữ .build() nếu bạn muốn giữ code hiện đại, nhưng nếu lỗi thì bỏ .build() này đi.
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("JWT Validation Error: " + e.getMessage());
        }
        return false;
    }
}