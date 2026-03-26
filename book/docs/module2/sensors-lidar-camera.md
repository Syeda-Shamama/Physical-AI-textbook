---
id: sensors-lidar-camera
title: Simulating Sensors — LiDAR, Depth Camera & IMU
sidebar_label: Sensors Simulation
sidebar_position: 4
---

# Simulating Sensors — LiDAR, Depth Camera & IMU

## The Sensor Stack of a Humanoid Robot

A humanoid robot needs multiple sensors to perceive its environment:

| Sensor | Data Type | Use Case |
|--------|-----------|----------|
| **RGB Camera** | Color images | Object detection, face recognition |
| **Depth Camera** | RGB + distance map | 3D object localization, obstacle avoidance |
| **LiDAR** | Point cloud (3D) | SLAM, navigation, mapping |
| **IMU** | Acceleration + angular velocity | Balance control, fall detection |
| **Force/Torque** | Forces at joints | Grasping, contact detection |

## Simulating LiDAR in Gazebo

Add a LiDAR to your URDF:

```xml
<link name="lidar_link">
  <visual>
    <geometry><cylinder radius="0.05" length="0.1"/></geometry>
  </visual>
</link>

<joint name="lidar_joint" type="fixed">
  <parent link="torso"/>
  <child link="lidar_link"/>
  <origin xyz="0 0 0.5" rpy="0 0 0"/>
</joint>

<gazebo reference="lidar_link">
  <sensor name="lidar" type="ray">
    <always_on>true</always_on>
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>360</samples>
          <resolution>1</resolution>
          <min_angle>-3.14159</min_angle>
          <max_angle>3.14159</max_angle>
        </horizontal>
      </scan>
      <range>
        <min>0.1</min>
        <max>30.0</max>
      </range>
    </ray>
    <plugin name="lidar_plugin" filename="libgazebo_ros_ray_sensor.so">
      <ros><remapping>~/out:=/scan</remapping></ros>
      <output_type>sensor_msgs/LaserScan</output_type>
    </plugin>
  </sensor>
</gazebo>
```

Reading LiDAR data in Python:

```python
from sensor_msgs.msg import LaserScan

class LidarReader(Node):
    def __init__(self):
        super().__init__('lidar_reader')
        self.sub = self.create_subscription(
            LaserScan, '/scan', self.callback, 10)

    def callback(self, msg: LaserScan):
        # msg.ranges is a list of distances (meters) at each angle
        min_dist = min(r for r in msg.ranges if r > msg.range_min)
        self.get_logger().info(f'Closest obstacle: {min_dist:.2f}m')
```

## Simulating Intel RealSense (Depth Camera)

The **Intel RealSense D435i** is the standard depth camera for humanoid robotics. In simulation:

```bash
# Install RealSense Gazebo plugin
sudo apt install ros-humble-realsense2-description
```

```xml
<!-- Add to your URDF -->
<xacro:include filename="$(find realsense2_description)/urdf/_d435i.urdf.xacro"/>
<xacro:sensor_d435i parent="torso" use_nominal_extrinsics="true">
  <origin xyz="0.1 0 0.3" rpy="0 0 0"/>
</xacro:sensor_d435i>
```

## IMU — The Robot's Inner Ear

An **IMU (Inertial Measurement Unit)** measures:
- **Linear acceleration** (3 axes) — detects falls, steps
- **Angular velocity** (3 axes) — measures rotation speed

```python
from sensor_msgs.msg import Imu

class BalanceMonitor(Node):
    def __init__(self):
        super().__init__('balance_monitor')
        self.sub = self.create_subscription(Imu, '/imu', self.callback, 10)

    def callback(self, msg: Imu):
        # Check if robot is tilting too far
        roll = msg.orientation.x
        pitch = msg.orientation.y
        if abs(pitch) > 0.5:  # ~28 degrees
            self.get_logger().warn('Robot is about to fall!')
```

---

**Module 2 Complete!** Move on to [Module 3: NVIDIA Isaac →](/module3/intro)
