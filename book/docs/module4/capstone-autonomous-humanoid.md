---
id: capstone-autonomous-humanoid
title: "Capstone: The Autonomous Humanoid"
sidebar_label: Capstone Project
sidebar_position: 4
---

# Capstone: The Autonomous Humanoid

## Project Overview

In this capstone project, you will build a complete **autonomous humanoid robot system** that:

1. Receives a **voice command** from a human
2. **Transcribes** it using Whisper (local, free)
3. **Plans** a sequence of actions using an LLM (Groq, free)
4. **Navigates** to the target location using Nav2
5. **Identifies** the target object using computer vision
6. **Manipulates** (picks up) the object

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Capstone System                       │
│                                                          │
│  [Microphone] → [Whisper STT] → [LLM Planner]           │
│                                        │                 │
│  [RealSense Camera] → [YOLO Detection] │                 │
│                           │            │                 │
│                           └────────────┘                 │
│                                │                         │
│                         [Task Executor]                  │
│                                │                         │
│              ┌─────────────────┼───────────────┐         │
│              ▼                 ▼               ▼         │
│          [Nav2]           [MoveIt 2]       [TTS Output]  │
│              │                 │                         │
│        [Robot Base]      [Robot Arm]                     │
└─────────────────────────────────────────────────────────┘
```

## Full Integration Code

```python
#!/usr/bin/env python3
"""
Capstone: Autonomous Humanoid Robot
Combines: Whisper + Groq LLM + ROS 2 Nav2
"""

import rclpy
from rclpy.node import Node
import whisper
import sounddevice as sd
import numpy as np
from groq import Groq
import json
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator

SAMPLE_RATE = 16000
RECORD_SECONDS = 4

LOCATIONS = {
    "kitchen": (3.0, 1.0, 0.0),
    "living room": (0.5, 3.0, 0.0),
    "table": (1.5, 2.0, 0.0),
    "door": (0.0, 5.0, 0.0),
}

SYSTEM_PROMPT = """
You are a robot task planner. Convert the command to a JSON action array.
Available: navigate_to(location), pick_up(object), say(text), wait(seconds)
Output ONLY valid JSON array.
"""


class AutonomousHumanoid(Node):
    def __init__(self):
        super().__init__('autonomous_humanoid')

        # Initialize components
        self.whisper_model = whisper.load_model("base")
        self.groq_client = Groq(api_key="YOUR_GROQ_KEY")
        self.navigator = BasicNavigator()
        self.speech_pub = self.create_publisher(String, '/robot_speech', 10)

        self.get_logger().info("Autonomous Humanoid ready!")
        self.navigator.waitUntilNav2Active()

    def listen(self) -> str:
        """Record audio and transcribe with Whisper."""
        self.get_logger().info("Listening for command...")
        audio = sd.rec(
            int(RECORD_SECONDS * SAMPLE_RATE),
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype='float32'
        )
        sd.wait()
        result = self.whisper_model.transcribe(audio.flatten(), fp16=False)
        text = result["text"].strip()
        self.get_logger().info(f'Heard: "{text}"')
        return text

    def plan(self, command: str) -> list[dict]:
        """Use Groq LLM to create action plan."""
        response = self.groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": command}
            ],
            temperature=0.1,
        )
        return json.loads(response.choices[0].message.content)

    def execute(self, plan: list[dict]):
        """Execute the action plan."""
        for step in plan:
            action = step.get('action', '')
            args = step.get('args', {})
            self.get_logger().info(f'Executing: {action}({args})')

            if action == 'navigate_to':
                self._navigate(args.get('location', ''))
            elif action == 'pick_up':
                self._pick_up(args.get('object', ''))
            elif action == 'say':
                self._say(args.get('text', ''))

    def _navigate(self, location: str):
        if location not in LOCATIONS:
            self.get_logger().warn(f'Unknown location: {location}')
            return
        x, y, z = LOCATIONS[location]
        goal = PoseStamped()
        goal.header.frame_id = 'map'
        goal.header.stamp = self.get_clock().now().to_msg()
        goal.pose.position.x = x
        goal.pose.position.y = y
        goal.pose.orientation.w = 1.0
        self.navigator.goToPose(goal)
        while not self.navigator.isTaskComplete():
            pass
        self.get_logger().info(f'Arrived at {location}')

    def _pick_up(self, obj: str):
        # Placeholder: in real system, calls MoveIt 2 arm controller
        self.get_logger().info(f'Attempting to pick up: {obj}')

    def _say(self, text: str):
        msg = String()
        msg.data = text
        self.speech_pub.publish(msg)

    def run(self):
        """Main loop."""
        while rclpy.ok():
            command = self.listen()
            if command:
                try:
                    plan = self.plan(command)
                    self.get_logger().info(f'Plan: {json.dumps(plan, indent=2)}')
                    self.execute(plan)
                except Exception as e:
                    self.get_logger().error(f'Error: {e}')


def main():
    rclpy.init()
    robot = AutonomousHumanoid()
    robot.run()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Running the Capstone

```bash
# Terminal 1: Start Gazebo simulation
ros2 launch your_robot_pkg gazebo.launch.py

# Terminal 2: Start Nav2
ros2 launch nav2_bringup bringup_launch.py map:=lab_map.yaml

# Terminal 3: Start the Autonomous Humanoid
ros2 run capstone autonomous_humanoid
```

Then speak: *"Go to the kitchen and pick up the water bottle"*

## Evaluation Checklist

- [ ] Voice command captured and transcribed correctly
- [ ] LLM generates valid action plan
- [ ] Robot navigates to the correct location
- [ ] Robot identifies the target object
- [ ] Robot performs the pick-up action
- [ ] System handles unknown commands gracefully

---

**Congratulations!** You have completed the Physical AI & Humanoid Robotics textbook.

*Built with Docusaurus. Powered by ROS 2, NVIDIA Isaac, and open-source AI tools.*
