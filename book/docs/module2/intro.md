---
id: intro
title: "Module 2: Gazebo & Unity — The Digital Twin"
sidebar_label: Module Overview
sidebar_position: 1
---

# Module 2: Gazebo & Unity — The Digital Twin

## Why Simulate?

Building and testing on a real humanoid robot is expensive and dangerous. A single fall can damage thousands of dollars of hardware. **Simulation** lets you test, fail, and iterate thousands of times — for free, safely, and much faster than reality.

A **Digital Twin** is a virtual replica of your robot and its environment. Any code that works in simulation can (with proper sim-to-real transfer) be deployed to real hardware.

## Two Simulation Tools

### Gazebo
- Open-source physics simulator (standard for ROS 2)
- Simulates **rigid body dynamics, gravity, friction, collisions**
- Supports sensors: cameras, LiDAR, IMUs, GPS
- Tightly integrated with ROS 2

### Unity
- Game engine used for **high-fidelity rendering** and HRI (Human-Robot Interaction)
- Better visuals than Gazebo
- Used for training perception models with synthetic data
- Connects to ROS 2 via the `unity-robotics-hub` package

## Topics in This Module

- [Gazebo Simulation Setup](./gazebo-simulation)
- [Unity for Robot Visualization](./unity-visualization)
- [Simulating Sensors: LiDAR, Depth Camera, IMU](./sensors-lidar-camera)

---

> **Tools needed**: Gazebo Harmonic (or Classic), ROS 2 Humble, Unity 2022+
