---
id: intro
title: "Module 1: ROS 2 — The Robotic Nervous System"
sidebar_label: Module Overview
sidebar_position: 1
---

# Module 1: ROS 2 — The Robotic Nervous System

## Module Overview

Just as the human nervous system connects the brain to every muscle and sensor in the body, **ROS 2 (Robot Operating System 2)** is the communication backbone of a modern robot. It connects the AI "brain" (your Python code, LLMs) to the physical actuators and sensors.

ROS 2 is not a traditional operating system — it is a **middleware framework** that provides:
- A standardized way for software components to **communicate**
- Tools for **visualization**, **debugging**, and **simulation**
- A rich **ecosystem of packages** for navigation, perception, and control

## Why ROS 2 (not ROS 1)?

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| Real-time support | No | Yes (DDS middleware) |
| Security | None | Built-in (SROS2) |
| Multi-robot support | Limited | Native |
| Python version | Python 2 | Python 3 |
| Active support | Ended 2025 | Active (Jazzy/Iron) |

## What You Will Learn in This Module

1. **ROS 2 Architecture** — How nodes, topics, services, and actions work together
2. **Building Nodes with rclpy** — Writing robot controllers in Python
3. **Bridging AI Agents to ROS** — Connecting LLM outputs to robot actions
4. **URDF** — Describing humanoid robot bodies in XML

## Topics in This Module

- [Nodes, Topics & Services](./nodes-topics-services)
- [rclpy — Python Agents in ROS 2](./rclpy-python-agents)
- [URDF for Humanoid Robots](./urdf-humanoids)

---

> **Prerequisites**: Ubuntu 22.04, ROS 2 Humble/Jazzy installed, Python 3.10+
