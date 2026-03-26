---
id: isaac-ros-vslam
title: Isaac ROS — Hardware-Accelerated VSLAM & Perception
sidebar_label: Isaac ROS & VSLAM
sidebar_position: 3
---

# Isaac ROS — Hardware-Accelerated VSLAM & Perception

## What is Isaac ROS?

**Isaac ROS** is a collection of GPU-accelerated ROS 2 packages from NVIDIA. Instead of running perception algorithms on the CPU (slow), Isaac ROS uses **CUDA** to accelerate them on the GPU, giving 10-100x speedups.

Key packages:

| Package | Function |
|---------|----------|
| `isaac_ros_visual_slam` | VSLAM — tracks robot position using camera |
| `isaac_ros_nvblox` | 3D mapping of the environment in real-time |
| `isaac_ros_object_detection` | GPU-accelerated object detection (YOLO, etc.) |
| `isaac_ros_depth_segmentation` | Freespace detection for navigation |
| `isaac_ros_image_proc` | GPU-accelerated image processing pipeline |

## Visual SLAM (VSLAM)

**SLAM (Simultaneous Localization and Mapping)** answers: *"Where am I, and what does my environment look like?"*

**Visual SLAM** does this using a camera (instead of expensive LiDAR), making it perfect for humanoids with limited payload capacity.

```bash
# Install Isaac ROS VSLAM
sudo apt install ros-humble-isaac-ros-visual-slam

# Launch VSLAM with a RealSense camera
ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam_realsense.launch.py
```

The output: a `/visual_slam/tracking/odometry` topic with the robot's estimated position and orientation.

## VSLAM Pipeline

```
RealSense D435i
    │
    ▼
Left + Right Stereo Images ──────────────────────┐
    │                                            │
    ▼                                            ▼
Rectification (GPU)                    IMU Data (Accelerometer + Gyro)
    │                                            │
    └─────────────────────┬──────────────────────┘
                          │
                          ▼
            Visual-Inertial Odometry (GPU)
                          │
                          ▼
            /visual_slam/tracking/odometry
            (pose: x, y, z + quaternion)
```

## Using VSLAM Output in Navigation

```python
from nav_msgs.msg import Odometry

class PositionTracker(Node):
    def __init__(self):
        super().__init__('position_tracker')
        self.sub = self.create_subscription(
            Odometry,
            '/visual_slam/tracking/odometry',
            self.callback,
            10
        )

    def callback(self, msg: Odometry):
        x = msg.pose.pose.position.x
        y = msg.pose.pose.position.y
        z = msg.pose.pose.position.z
        self.get_logger().info(f'Robot position: ({x:.2f}, {y:.2f}, {z:.2f})')
```

## nvblox — Real-Time 3D Mapping

nvblox builds a **3D voxel map** of the environment from depth camera data, updated in real-time on the GPU:

```bash
ros2 launch nvblox_ros nvblox_ros_realsense.launch.py
```

This creates a 3D occupancy grid that Nav2 can use for path planning.

---

**Next**: [Nav2 — Bipedal Navigation](./nav2-bipedal)
