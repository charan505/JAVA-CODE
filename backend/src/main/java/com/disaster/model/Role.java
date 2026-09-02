package com.disaster.model;

public enum Role {
    ROLE_ADMIN,
    ROLE_COMMUNITY_USER;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return ROLE_COMMUNITY_USER;
        String normalized = roleStr.trim().toUpperCase();
        if (normalized.equals("ADMIN") || normalized.equals("ROLE_ADMIN") || normalized.equals("ADMINISTRATOR")) {
            return ROLE_ADMIN;
        }
        return ROLE_COMMUNITY_USER;
    }
}
