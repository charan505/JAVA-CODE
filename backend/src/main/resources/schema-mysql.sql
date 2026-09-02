-- MySQL Schema for Smart Disaster Early Warning and Community Alert Management System

CREATE DATABASE IF NOT EXISTS disaster_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE disaster_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL DEFAULT 'COMMUNITY_USER',
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: disaster_alerts
CREATE TABLE IF NOT EXISTS disaster_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disaster_type VARCHAR(40) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    alert_date_time DATETIME NOT NULL,
    safety_instructions TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_by_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: alert_read_status
CREATE TABLE IF NOT EXISTS alert_read_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    alert_id BIGINT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_alert UNIQUE (user_id, alert_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (alert_id) REFERENCES disaster_alerts(id) ON DELETE CASCADE
);

-- Table: safety_guidelines
CREATE TABLE IF NOT EXISTS safety_guidelines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disaster_type VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    dos TEXT,
    donts TEXT,
    emergency_kit_items TEXT,
    icon_name VARCHAR(50),
    order_index INT DEFAULT 0
);
