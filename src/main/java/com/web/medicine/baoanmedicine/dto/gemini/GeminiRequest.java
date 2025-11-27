package com.web.medicine.baoanmedicine.dto.gemini;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class GeminiRequest {
    private List<Content> contents;

    public GeminiRequest(String text) {
        this.contents = Collections.singletonList(new Content(text));
    }

    @Data
    @NoArgsConstructor
    public static class Content {
        private List<Part> parts;
        public Content(String text) {
            this.parts = Collections.singletonList(new Part(text));
        }
    }

    @Data
    @NoArgsConstructor
    public static class Part {
        private String text;
        public Part(String text) {
            this.text = text;
        }
    }
}