---
id: gazebo-simulation
title: Gazebo Simulation for Humanoid Robots
sidebar_label: Gazebo Simulation
sidebar_position: 2
---

# Gazebo Simulation for Humanoid Robots

## Installing Gazebo Harmonic with ROS 2

```bash
# Install Gazebo Harmonic (recommended with ROS 2 Jazzy)
sudo apt install ros-jazzy-ros-gz

# Or for ROS 2 Humble → use Gazebo Fortress
sudo apt install ros-humble-gazebo-ros-pkgs
```

## Launching a Robot in Gazebo

```bash
# Launch Gazebo with an empty world
ros2 launch gazebo_ros gazebo.launch.py

# Spawn your robot URDF into the running simulation
ros2 run gazebo_ros spawn_entity.py \
    -file my_humanoid.urdf \
    -entity humanoid_robot \
    -x 0 -y 0 -z 1.0
```

## Writing a World File (SDF)

Gazebo worlds are described in **SDF (Simulation Description Format)**:

```xml
<?xml version="1.0"?>
<sdf version="1.8">
  <world name="robotics_lab">

    <!-- Physics settings -->
    <physics name="1ms" type="ignored">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>

    <!-- Lighting -->
    <light type="directional" name="sun">
      <cast_shadows>true</cast_shadows>
      <direction>-0.5 0.1 -0.9</direction>
    </light>

    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry><plane><normal>0 0 1</normal></plane></geometry>
        </collision>
        <visual name="visual">
          <geometry><plane><normal>0 0 1</normal><size>100 100</size></plane></geometry>
        </visual>
      </link>
    </model>

    <!-- Include your robot -->
    <include>
      <uri>model://my_humanoid</uri>
      <pose>0 0 1 0 0 0</pose>
    </include>

  </world>
</sdf>
```

## Controlling the Robot via ROS 2

Once your robot is in Gazebo, control it using ROS 2 topics:

```bash
# See all topics from Gazebo
ros2 topic list

# Send a velocity command to move the robot
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \
    "linear: {x: 0.5, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}"
```

## Gazebo Plugins

Gazebo plugins add behavior to your simulation:

| Plugin | Function |
|--------|----------|
| `libgazebo_ros_diff_drive.so` | Differential drive controller |
| `libgazebo_ros_joint_state_publisher.so` | Publishes joint states to ROS 2 |
| `libgazebo_ros_camera.so` | Simulated RGB camera |
| `libgazebo_ros_ray_sensor.so` | Simulated LiDAR |
| `libgazebo_ros_imu_sensor.so` | Simulated IMU |

Add to your URDF:
```xml
<gazebo>
  <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
    <ros>
      <namespace>/robot</namespace>
    </ros>
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <wheel_separation>0.4</wheel_separation>
    <wheel_diameter>0.2</wheel_diameter>
  </plugin>
</gazebo>
```

---

**Next**: [Unity for Robot Visualization](./unity-visualization)
