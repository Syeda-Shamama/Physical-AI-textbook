---
id: intro
title: "Module 3: NVIDIA Isaac — The AI-Robot Brain"
sidebar_label: Module Overview
sidebar_position: 1
---

# Module 3: NVIDIA Isaac — The AI-Robot Brain

## The NVIDIA Isaac Platform

NVIDIA Isaac is a complete platform for developing AI-powered robots. It consists of three main components:

| Component | What It Does |
|-----------|-------------|
| **Isaac Sim** | Photorealistic simulation built on NVIDIA Omniverse |
| **Isaac ROS** | Hardware-accelerated ROS 2 packages for perception |
| **Isaac Lab** | Reinforcement learning framework for robot training |

## Why Isaac Sim Over Gazebo?

| Feature | Gazebo | Isaac Sim |
|---------|--------|-----------|
| Rendering | Basic | Photorealistic (RTX ray tracing) |
| Physics | Good | Excellent (PhysX 5) |
| Synthetic data | Limited | Advanced (domain randomization) |
| GPU acceleration | No | Yes |
| Hardware requirement | Any PC | NVIDIA RTX GPU required |

## Topics in This Module

- [Isaac Sim — Photorealistic Simulation](./isaac-sim)
- [Isaac ROS — Hardware-Accelerated Perception](./isaac-ros-vslam)
- [Nav2 — Bipedal Navigation](./nav2-bipedal)

---

> **Hardware Required**: NVIDIA GPU with RTX support (RTX 3070 minimum, RTX 4080+ recommended)
> **OS**: Ubuntu 22.04 (Windows support is limited)
