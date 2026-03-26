---
id: isaac-sim
title: NVIDIA Isaac Sim — Photorealistic Robot Simulation
sidebar_label: Isaac Sim
sidebar_position: 2
---

# NVIDIA Isaac Sim — Photorealistic Robot Simulation

## What Makes Isaac Sim Special?

Isaac Sim is built on **NVIDIA Omniverse**, a platform for collaborative 3D simulation. Key features:

1. **RTX Ray Tracing** — photorealistic rendering, critical for training vision models that must transfer to the real world
2. **PhysX 5** — accurate rigid body and soft body physics
3. **USD (Universal Scene Description)** — the industry standard format for 3D scenes (used in Pixar films and industrial robotics)
4. **Domain Randomization** — automatically vary lighting, textures, and physics to make trained models robust

## Installation

```bash
# Prerequisites: NVIDIA driver 525+, CUDA 11.8+
# Download Isaac Sim from NVIDIA's website (requires free developer account)
# https://developer.nvidia.com/isaac-sim

# Install via pip (Isaac Sim Python environment)
pip install isaacsim-rl isaacsim-replicator isaacsim-extscache-physics \
    isaacsim-extscache-kit isaacsim-extscache-kit-sdk
```

## Loading a Robot in Isaac Sim (Python API)

```python
import isaacsim
from omni.isaac.kit import SimulationApp

# Launch the simulation
simulation_app = SimulationApp({"headless": False})

from omni.isaac.core import World
from omni.isaac.core.robots import Robot
from omni.isaac.core.utils.stage import add_reference_to_stage

# Create the world
world = World()
world.scene.add_default_ground_plane()

# Load a humanoid robot from USD
add_reference_to_stage(
    usd_path="/path/to/humanoid.usd",
    prim_path="/World/Humanoid"
)

# Initialize
world.reset()

# Simulation loop
while simulation_app.is_running():
    world.step(render=True)

simulation_app.close()
```

## Synthetic Data Generation with Isaac Replicator

Isaac Replicator automates the creation of labeled training datasets:

```python
import omni.replicator.core as rep

with rep.new_layer():
    # Create a camera
    camera = rep.create.camera(position=(0, 0, 2), look_at=(0, 0, 0))

    # Randomize lighting every frame
    with rep.trigger.on_frame(num_frames=1000):
        with rep.create.group([camera]):
            rep.modify.pose(
                position=rep.distribution.uniform((-3, -3, 1), (3, 3, 3)),
            )
        # Random lighting
        rep.create.light(
            light_type="Sphere",
            color=rep.distribution.uniform((0.1, 0.1, 0.1), (1, 1, 1)),
            intensity=rep.distribution.uniform(100, 10000),
            position=rep.distribution.uniform((-5, -5, 2), (5, 5, 5)),
        )

    # Capture RGB, Depth, and Semantic Segmentation
    rp = rep.create.render_product(camera, (1280, 720))
    writer = rep.WriterRegistry.get("BasicWriter")
    writer.initialize(
        output_dir="./synthetic_data",
        rgb=True,
        distance_to_image_plane=True,
        semantic_segmentation=True,
    )
    writer.attach([rp])

rep.orchestrator.run()
```

## Isaac Sim + ROS 2 Bridge

```bash
# Enable the ROS 2 bridge in Isaac Sim
# Extensions → Search "ROS2 Bridge" → Enable

# Now Isaac Sim publishes to ROS 2 topics
ros2 topic list  # You'll see /clock, /tf, camera topics, etc.
```

---

**Next**: [Isaac ROS — Hardware-Accelerated Perception](./isaac-ros-vslam)
