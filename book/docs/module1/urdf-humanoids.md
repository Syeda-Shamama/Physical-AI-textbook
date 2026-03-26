---
id: urdf-humanoids
title: URDF — Describing Humanoid Robot Bodies
sidebar_label: URDF for Humanoids
sidebar_position: 4
---

# URDF — Describing Humanoid Robot Bodies

## What is URDF?

**URDF (Unified Robot Description Format)** is an XML format used to describe a robot's physical structure — its links (rigid bodies), joints (connections), sensors, and visual geometry.

Think of URDF as the robot's "birth certificate" — it tells ROS 2, Gazebo, and NVIDIA Isaac exactly what the robot looks like and how it can move.

## URDF Structure

A URDF file describes two things:
1. **Links** — the rigid bodies (torso, legs, arms, head)
2. **Joints** — how links connect and move relative to each other

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">

  <!-- Base / Torso -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.1" iyy="0.1" izz="0.05" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Left Hip Joint -->
  <joint name="left_hip" type="revolute">
    <parent link="torso"/>
    <child link="left_thigh"/>
    <origin xyz="-0.1 0 -0.25" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>  <!-- Rotates around X axis -->
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1.0"/>
  </joint>

  <!-- Left Thigh -->
  <link name="left_thigh">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.4"/>
      </geometry>
    </visual>
    <inertial>
      <mass value="3.0"/>
      <inertia ixx="0.02" iyy="0.02" izz="0.005" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

</robot>
```

## Joint Types

| Type | Description | Example |
|------|-------------|---------|
| `revolute` | Rotates around an axis (with limits) | Hip, knee, elbow |
| `continuous` | Rotates without limits | Wheels |
| `prismatic` | Slides along an axis | Linear actuators |
| `fixed` | No movement | Camera mount on head |
| `floating` | 6 DOF (rarely used directly) | Robot base in simulation |

## Viewing URDF in RViz2

```bash
# Install joint state publisher GUI
sudo apt install ros-humble-joint-state-publisher-gui

# Launch RViz2 with your URDF
ros2 launch urdf_tutorial display.launch.py model:=my_humanoid.urdf
```

## From URDF to Gazebo (SDF)

Gazebo uses **SDF (Simulation Description Format)** which is more expressive than URDF. You can either:
1. Use URDF directly with Gazebo's URDF → SDF auto-conversion
2. Add `<gazebo>` extension tags inside your URDF for physics properties

```xml
<!-- Add Gazebo-specific properties to your URDF -->
<gazebo reference="left_thigh">
  <material>Gazebo/Blue</material>
  <mu1>0.8</mu1>   <!-- Friction coefficient -->
  <mu2>0.8</mu2>
</gazebo>
```

## Real Humanoid URDFs

For real projects, you don't build URDF from scratch. Download existing models:

```bash
# Unitree H1 humanoid
git clone https://github.com/unitreerobotics/unitree_ros

# Robotis OP3
sudo apt install ros-humble-robotis-op3-description

# Generic humanoid template
sudo apt install ros-humble-humanoid-nav-msgs
```

---

**Module 1 Complete!** Move on to [Module 2: Gazebo & Unity →](/module2/intro)
