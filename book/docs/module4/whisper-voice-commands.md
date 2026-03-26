---
id: whisper-voice-commands
title: Whisper — Converting Voice Commands to Text
sidebar_label: Whisper Voice Commands
sidebar_position: 2
---

# Whisper — Converting Voice Commands to Text

## What is Whisper?

**OpenAI Whisper** is an open-source speech recognition model. It converts spoken audio into text with high accuracy across many languages, including Urdu and other non-English languages.

**Best part**: Whisper runs **completely locally** — no API key, no internet, no cost.

## Installation

```bash
pip install openai-whisper
# Also needs ffmpeg
sudo apt install ffmpeg  # Ubuntu
```

## Basic Transcription

```python
import whisper

# Load model (sizes: tiny, base, small, medium, large)
# "base" is a good balance of speed and accuracy
model = whisper.load_model("base")

# Transcribe an audio file
result = model.transcribe("command.wav")
print(result["text"])
# Output: "Move forward and pick up the red ball"
```

## Real-Time Voice Command Node (ROS 2)

```python
import whisper
import sounddevice as sd
import numpy as np
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

SAMPLE_RATE = 16000
RECORD_SECONDS = 3  # Listen for 3 seconds

class VoiceCommandNode(Node):
    def __init__(self):
        super().__init__('voice_command_node')
        self.publisher = self.create_publisher(String, '/voice_command', 10)
        self.model = whisper.load_model("base")
        self.get_logger().info("Voice command node ready. Listening...")
        # Timer to capture audio every 3 seconds
        self.timer = self.create_timer(4.0, self.capture_and_transcribe)

    def capture_and_transcribe(self):
        self.get_logger().info("Listening...")
        audio = sd.rec(
            int(RECORD_SECONDS * SAMPLE_RATE),
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype='float32'
        )
        sd.wait()

        # Whisper expects float32 mono audio
        audio_flat = audio.flatten()
        result = self.model.transcribe(audio_flat, fp16=False)
        text = result["text"].strip()

        if text:
            self.get_logger().info(f'Heard: "{text}"')
            msg = String()
            msg.data = text
            self.publisher.publish(msg)

def main():
    rclpy.init()
    node = VoiceCommandNode()
    rclpy.spin(node)
    rclpy.shutdown()
```

## Multilingual Support

Whisper supports **99 languages** including Urdu:

```python
# Force Urdu transcription
result = model.transcribe("command.wav", language="ur")
print(result["text"])  # Output in Urdu script
```

## Whisper Model Sizes

| Model | Parameters | Speed | Accuracy | VRAM |
|-------|-----------|-------|----------|------|
| `tiny` | 39M | Very fast | Low | ~1 GB |
| `base` | 74M | Fast | Good | ~1 GB |
| `small` | 244M | Medium | Better | ~2 GB |
| `medium` | 769M | Slow | High | ~5 GB |
| `large` | 1550M | Very slow | Best | ~10 GB |

For robot applications on Jetson Orin, use `base` or `small`.

---

**Next**: [LLM Cognitive Planning](./llm-cognitive-planning)
