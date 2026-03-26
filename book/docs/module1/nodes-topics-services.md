---
id: nodes-topics-services
title: ROS 2 Nodes, Topics & Services
sidebar_label: Nodes, Topics & Services
sidebar_position: 2
---

# ROS 2 Nodes, Topics & Services

## The Building Blocks of a Robot

A ROS 2 application is made up of **nodes** — independent processes that each perform one task. Think of each node as a specialist employee: one reads the camera, another plans the path, another controls the motors.

These nodes communicate through three mechanisms:

### 1. Topics (Publish/Subscribe)

A **topic** is a named data stream. Any node can **publish** data to it; any other node can **subscribe** to receive it.

```
Camera Node ──publishes──> /image_raw ──subscribes──> Perception Node
```

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image

class CameraSubscriber(Node):
    def __init__(self):
        super().__init__('camera_subscriber')
        self.subscription = self.create_subscription(
            Image,
            '/image_raw',
            self.listener_callback,
            10  # QoS queue size
        )

    def listener_callback(self, msg):
        self.get_logger().info(f'Received image: {msg.height}x{msg.width}')

def main():
    rclpy.init()
    node = CameraSubscriber()
    rclpy.spin(node)
    rclpy.shutdown()
```

### 2. Services (Request/Response)

A **service** is a two-way call: one node sends a **request**, another processes it and sends back a **response**.

```
Navigation Node ──request──> /compute_path ──response──> Path Planner Node
```

Services are synchronous — use them for one-time queries like "what is the current battery level?"

### 3. Actions (Long-Running Tasks)

**Actions** are like services but for tasks that take time and need feedback (e.g., "walk to position X").

They have three parts:
- **Goal**: what you want done
- **Feedback**: progress updates
- **Result**: final outcome

```
Main Node ──goal──> /navigate_to_pose ──feedback──> (position updates) ──result──> success/fail
```

## Key ROS 2 CLI Commands

```bash
# List all active nodes
ros2 node list

# List all active topics
ros2 topic list

# See what a topic is publishing
ros2 topic echo /chatter

# Get info about a topic
ros2 topic info /cmd_vel

# Call a service manually
ros2 service call /set_bool std_srvs/srv/SetBool "data: true"
```

## DDS — The Communication Layer

ROS 2 uses **DDS (Data Distribution Service)** as its underlying transport. Unlike ROS 1 (which used a central "ROS Master"), DDS is **decentralized** — nodes discover each other automatically on the network.

This means:
- No single point of failure
- Works across multiple robots on the same network
- Supports real-time guarantees

---

**Next**: [rclpy — Writing Python Nodes](./rclpy-python-agents)
