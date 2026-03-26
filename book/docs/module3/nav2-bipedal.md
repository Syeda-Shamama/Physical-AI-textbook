---
id: nav2-bipedal
title: Nav2 — Path Planning for Bipedal Humanoid Movement
sidebar_label: Nav2 for Bipedal Robots
sidebar_position: 4
---

# Nav2 — Path Planning for Bipedal Humanoid Movement

## What is Nav2?

**Nav2** (Navigation 2) is the standard navigation framework for ROS 2. It provides:
- **Costmaps** — 2D/3D representations of obstacles
- **Path Planners** — algorithms to find a safe path from A to B
- **Controllers** — algorithms to follow the planned path
- **Behavior Trees** — high-level task management

## The Nav2 Stack

```
Goal Pose
    │
    ▼
┌─────────────────┐
│   BT Navigator  │  ← Behavior Tree manager
└────────┬────────┘
         │
    ┌────▼────┐
    │ Planner │  ← Global path planning (NavFn, Smac)
    └────┬────┘
         │
    ┌────▼────┐
    │Controller│  ← Local trajectory following (DWB, RPP)
    └────┬────┘
         │
    ┌────▼────┐
    │ Costmap │  ← Obstacle representation from sensors
    └─────────┘
         │
         ▼
   /cmd_vel → Robot
```

## Launching Nav2

```bash
# Basic Nav2 launch with Gazebo
ros2 launch nav2_bringup tb3_simulation_launch.py

# With your custom robot
ros2 launch nav2_bringup bringup_launch.py \
    map:=/path/to/map.yaml \
    params_file:=/path/to/nav2_params.yaml
```

## Sending Navigation Goals from Python

```python
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator
import rclpy

rclpy.init()
navigator = BasicNavigator()

# Wait for Nav2 to be ready
navigator.waitUntilNav2Active()

# Define goal pose
goal_pose = PoseStamped()
goal_pose.header.frame_id = 'map'
goal_pose.header.stamp = navigator.get_clock().now().to_msg()
goal_pose.pose.position.x = 2.0
goal_pose.pose.position.y = 1.5
goal_pose.pose.orientation.w = 1.0  # Facing forward

# Send goal
navigator.goToPose(goal_pose)

# Wait for completion
while not navigator.isTaskComplete():
    feedback = navigator.getFeedback()
    print(f'Distance remaining: {feedback.distance_remaining:.2f}m')

result = navigator.getResult()
print(f'Navigation result: {result}')
rclpy.shutdown()
```

## Bipedal Considerations

Wheeled robots and bipedal humanoids have different navigation challenges:

| Challenge | Wheeled Robot | Bipedal Humanoid |
|-----------|--------------|------------------|
| Stability | Always stable | Must maintain balance |
| Footstep planning | Not needed | Required |
| Terrain | Flat surfaces | Stairs, uneven ground |
| Recovery | Simple | Complex (fall recovery) |

For bipedal robots, you need to add a **footstep planner** on top of Nav2. Research projects use:
- **Humanoid Path Planner (HPP)**
- **Footstep Planning in IHMC**
- **MIT Footstep Planner**

---

**Module 3 Complete!** Move on to [Module 4: Vision-Language-Action →](/module4/intro)
