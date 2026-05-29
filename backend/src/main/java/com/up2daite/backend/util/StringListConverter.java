package com.up2daite.backend.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Konvertiert List&lt;String&gt; ↔ einzelner TEXT-Wert in der DB.
 * Trenner: "||" (sicher gegen normale Kommas/Pipes in Strings).
 *
 * Verwendung in Entities:
 *   @Convert(converter = StringListConverter.class)
 *   @Column(columnDefinition = "TEXT")
 *   private List&lt;String&gt; tasks;
 *
 * Alternative wäre @ElementCollection mit eigener Join-Tabelle, aber das
 * würde mehr Flyway-DDL und mehr Boilerplate für simple Stringlisten bedeuten.
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final String SEPARATOR = "||";
    private static final String SEPARATOR_REGEX = "\\|\\|";

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) return "";
        return String.join(SEPARATOR, attribute);
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return new ArrayList<>();
        return new ArrayList<>(Arrays.asList(dbData.split(SEPARATOR_REGEX)));
    }
}
