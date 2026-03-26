import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 — The Robotic Nervous System',
      items: [
        'module1/intro',
        'module1/nodes-topics-services',
        'module1/rclpy-python-agents',
        'module1/urdf-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Gazebo & Unity — The Digital Twin',
      items: [
        'module2/intro',
        'module2/gazebo-simulation',
        'module2/unity-visualization',
        'module2/sensors-lidar-camera',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac — The AI-Robot Brain',
      items: [
        'module3/intro',
        'module3/isaac-sim',
        'module3/isaac-ros-vslam',
        'module3/nav2-bipedal',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'module4/intro',
        'module4/whisper-voice-commands',
        'module4/llm-cognitive-planning',
        'module4/capstone-autonomous-humanoid',
      ],
    },
  ],
};

export default sidebars;
