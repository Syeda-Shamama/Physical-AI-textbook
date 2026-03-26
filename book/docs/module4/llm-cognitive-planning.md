---
id: llm-cognitive-planning
title: LLM Cognitive Planning — Natural Language to Robot Actions
sidebar_label: LLM Cognitive Planning
sidebar_position: 3
---

# LLM Cognitive Planning — Natural Language to Robot Actions

## The Core Idea

A robot that only understands commands like `move_forward(0.5)` is limited. We want a robot that understands:

> *"Go to the kitchen, pick up the water bottle from the counter, and bring it to me."*

This requires **cognitive planning** — decomposing a high-level goal into a sequence of low-level robot actions. LLMs are excellent at this because they have been trained on vast amounts of human task descriptions.

## The Task Planning Architecture

```
High-level Goal (natural language)
        │
        ▼
  ┌─────────────┐
  │    LLM      │  ← Decomposes goal into action sequence
  └──────┬──────┘
         │  Returns structured JSON action plan
         ▼
┌────────────────────┐
│  Action Executor   │  ← Maps actions to ROS 2 calls
└────────────────────┘
         │
         ▼
  ROS 2 (Nav2, MoveIt, etc.)
```

## Structured Output with Groq (Free LLM API)

We use **Groq** (free tier with llama3) instead of paid OpenAI API:

```python
from groq import Groq
import json

client = Groq(api_key="your_groq_key")  # Free at console.groq.com

SYSTEM_PROMPT = """
You are a robot task planner. Given a natural language command,
output a JSON array of robot actions.

Available actions:
- navigate_to(location: str)
- pick_up(object: str)
- place_at(location: str)
- say(text: str)
- look_at(direction: str)

Always output valid JSON only, no explanation.

Example:
Input: "Get the book from the table"
Output: [
  {"action": "navigate_to", "args": {"location": "table"}},
  {"action": "look_at", "args": {"direction": "table_surface"}},
  {"action": "pick_up", "args": {"object": "book"}},
  {"action": "say", "args": {"text": "I have the book"}}
]
"""

def plan_task(command: str) -> list[dict]:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": command}
        ],
        temperature=0.1,  # Low temperature for consistent structured output
    )
    return json.loads(response.choices[0].message.content)

# Test it
plan = plan_task("Go to the kitchen and bring me a water bottle")
for step in plan:
    print(f"Step: {step['action']} → {step['args']}")
```

## Executing the Plan with ROS 2

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

# Map location names to coordinates
LOCATIONS = {
    "kitchen": (3.0, 1.0),
    "table": (1.5, 2.0),
    "home": (0.0, 0.0),
}

class TaskExecutor(Node):
    def __init__(self):
        super().__init__('task_executor')
        self.navigator = BasicNavigator()
        self.speech_pub = self.create_publisher(String, '/robot_speech', 10)

    def execute_plan(self, action_plan: list[dict]):
        for step in action_plan:
            action = step['action']
            args = step.get('args', {})

            if action == 'navigate_to':
                self.navigate_to(args['location'])
            elif action == 'pick_up':
                self.pick_up(args['object'])
            elif action == 'say':
                self.say(args['text'])

    def navigate_to(self, location: str):
        if location not in LOCATIONS:
            self.get_logger().warn(f'Unknown location: {location}')
            return

        x, y = LOCATIONS[location]
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

    def pick_up(self, obj: str):
        # In a real system, this calls MoveIt for arm control
        self.get_logger().info(f'Picking up: {obj}')

    def say(self, text: str):
        msg = String()
        msg.data = text
        self.speech_pub.publish(msg)
        self.get_logger().info(f'Robot says: {text}')
```

## Chain of Thought Planning

For complex tasks, use **Chain of Thought** prompting:

```python
COT_PROMPT = """
Think step by step about what the robot needs to do.
First reason about the task, then output the JSON action plan.

Format:
<thinking>
Your reasoning here...
</thinking>
<plan>
[JSON action array here]
</plan>
"""
```

---

**Next**: [Capstone — The Autonomous Humanoid](./capstone-autonomous-humanoid)
