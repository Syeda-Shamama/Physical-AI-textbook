---
id: intro
title: "Module 4: Vision-Language-Action (VLA)"
sidebar_label: Module Overview
sidebar_position: 1
---

# Module 4: Vision-Language-Action (VLA)

## The Convergence of LLMs and Robotics

This module represents the cutting edge of Physical AI: giving a robot the ability to **understand language, see the world, and act** — all together.

**VLA (Vision-Language-Action)** models are the next generation of robot brains. They take:
- **Vision** — what the camera sees
- **Language** — what the human said
- **Action** — what motor command to execute

And output robot actions directly, without hard-coded rules.

## The VLA Pipeline

```
Human Voice
    │
    ▼
Whisper (Speech-to-Text)
    │
    ▼
LLM (Task Planning) ──── Visual Input (Camera)
    │
    ▼
ROS 2 Action Sequence
    │
    ▼
Robot Executes Task
```

## Topics in This Module

- [Whisper — Voice Commands to Text](./whisper-voice-commands)
- [LLM Cognitive Planning](./llm-cognitive-planning)
- [Capstone: The Autonomous Humanoid](./capstone-autonomous-humanoid)

---

> This is the capstone module. You'll combine everything from Modules 1-3 into one complete system.
