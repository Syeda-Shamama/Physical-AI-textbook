---
id: unity-visualization
title: Unity for Human-Robot Interaction & Visualization
sidebar_label: Unity Visualization
sidebar_position: 3
---

# Unity for Human-Robot Interaction & Visualization

## Why Use Unity Alongside Gazebo?

Gazebo excels at **physics accuracy**. Unity excels at **visual fidelity and interaction design**. For Physical AI projects:

- Use **Gazebo** for physics-accurate control testing
- Use **Unity** for:
  - Photorealistic synthetic data generation (training perception models)
  - Human-Robot Interaction (HRI) scenarios
  - Visualizing robot behavior for demos and presentations

## Setup: Unity Robotics Hub

```bash
# Clone the Unity Robotics Hub
git clone https://github.com/Unity-Technologies/Unity-Robotics-Hub
```

In Unity Package Manager, add:
- `com.unity.robotics.ros-tcp-connector` — connects Unity to ROS 2
- `com.unity.robotics.urdf-importer` — imports URDF robot models

## Connecting Unity to ROS 2

**Step 1**: Start the ROS 2 TCP endpoint on your machine:
```bash
ros2 run ros_tcp_endpoint default_server_endpoint \
    --ros-args -p ROS_IP:=127.0.0.1 -p ROS_PORT:=10000
```

**Step 2**: In Unity, add a `ROSConnection` component and set the IP/port.

**Step 3**: Publish/Subscribe using C# in Unity:

```csharp
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Geometry;

public class RobotController : MonoBehaviour
{
    ROSConnection ros;
    string topicName = "/cmd_vel";

    void Start()
    {
        ros = ROSConnection.GetOrCreateInstance();
        ros.RegisterPublisher<TwistMsg>(topicName);
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.W))
        {
            TwistMsg cmd = new TwistMsg();
            cmd.linear.x = 0.5;
            ros.Publish(topicName, cmd);
        }
    }
}
```

## Importing Your Humanoid URDF into Unity

1. In Unity: **Assets → Import URDF**
2. Select your `.urdf` file
3. The URDF Importer creates a prefab with all joints and meshes
4. Add `ArticulationBody` components for physics simulation

## Synthetic Data Generation

Unity is powerful for generating **labeled training data** for computer vision:

```
Unity Scene → Randomize lighting, textures, poses → Capture RGB + Depth + Segmentation → Train perception model
```

Use the **Unity Perception Package** for automated dataset generation:
```
Window → Package Manager → Add "com.unity.perception"
```

---

**Next**: [Simulating Sensors](./sensors-lidar-camera)
