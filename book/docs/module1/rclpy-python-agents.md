---
id: rclpy-python-agents
title: Bridging Python AI Agents to ROS 2 with rclpy
sidebar_label: rclpy & Python Agents
sidebar_position: 3
---

# Bridging Python AI Agents to ROS 2 with rclpy

## rclpy — The Python Client Library for ROS 2

`rclpy` is the official Python library for writing ROS 2 nodes. It lets you use Python to:
- Subscribe to sensor data (camera, LiDAR, IMU)
- Publish control commands (velocity, joint positions)
- Call services and actions
- Build the "glue" between your LLM agent and the robot's hardware

## Your First ROS 2 Node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class TalkerNode(Node):
    def __init__(self):
        super().__init__('talker')
        self.publisher = self.create_publisher(String, '/chatter', 10)
        # Timer fires every 1 second
        self.timer = self.create_timer(1.0, self.publish_message)

    def publish_message(self):
        msg = String()
        msg.data = f'Hello from ROS 2 at time {self.get_clock().now()}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Published: {msg.data}')

def main():
    rclpy.init()
    node = TalkerNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Connecting an AI Agent to ROS 2

The real power comes when you connect an **LLM agent** (or any AI model) to ROS 2. Here is an architecture where an LLM translates a natural language command into a ROS 2 velocity command:

```
Voice Input → Whisper (STT) → LLM → rclpy Node → /cmd_vel → Robot Motors
```

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class LLMCommandBridge(Node):
    """Translates LLM text commands into ROS 2 velocity messages."""

    def __init__(self):
        super().__init__('llm_command_bridge')
        self.publisher = self.create_publisher(Twist, '/cmd_vel', 10)

    def execute_command(self, command: str):
        """
        Parse a simple natural language command and publish velocity.
        In production, this would call your LLM API.
        """
        twist = Twist()

        if 'forward' in command.lower():
            twist.linear.x = 0.5   # m/s forward
        elif 'backward' in command.lower():
            twist.linear.x = -0.5
        elif 'left' in command.lower():
            twist.angular.z = 0.5  # rad/s turn left
        elif 'right' in command.lower():
            twist.angular.z = -0.5
        elif 'stop' in command.lower():
            pass  # zero velocity = stop

        self.publisher.publish(twist)
        self.get_logger().info(f'Command "{command}" → vel: ({twist.linear.x}, {twist.angular.z})')

def main():
    rclpy.init()
    node = LLMCommandBridge()

    # Simulate commands from an AI agent
    commands = ['move forward', 'turn left', 'stop']
    for cmd in commands:
        node.execute_command(cmd)

    rclpy.shutdown()
```

## Building a ROS 2 Package

```bash
# Create a new package
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_robot_ai \
    --dependencies rclpy geometry_msgs sensor_msgs

# Build
cd ~/ros2_ws
colcon build --symlink-install

# Source
source install/setup.bash

# Run your node
ros2 run my_robot_ai llm_bridge
```

## Key rclpy Patterns

| Pattern | Use Case |
|---------|----------|
| `create_publisher` | Send data to hardware |
| `create_subscription` | Receive sensor data |
| `create_timer` | Periodic tasks (control loops) |
| `create_service` | Respond to queries |
| `create_action_server` | Handle long-running tasks |

---

**Next**: [URDF — Describing Humanoid Robots](./urdf-humanoids)
