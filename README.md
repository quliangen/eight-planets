# 漫游太阳系 🪐

专为小朋友设计的 3D 太阳系互动百科：八大行星围绕太阳公转，点击星球查看介绍、听语音讲解，还有手势控制、AR 模式和星舰巡游玩法。

## 本地运行

**前置要求：** Node.js

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 构建生产版本：`npm run build`（含 TypeScript 类型检查）

无需任何 API Key —— 所有行星贴图均为程序化生成，HDR 环境与手势模型已打包到本地，可完全离线部署。

## 功能

- 🪐 八大行星 + 冥王星（可开关）、木卫/土卫系统、月球与中国空间站
- 🔊 中文语音讲解（Web Speech API）
- 👋 手势控制（MediaPipe HandLandmarker，本地模型）：单手旋转、双手缩放、捏合锁定、比耶返回
- 📹 AR 模式（摄像头画面作为背景）
- 🚀 星舰巡游：随机航线走访 5 颗行星并返回地球
- ⏱️ 时间引擎：0x ~ 20x 仿真速度调节

## 技术栈

React 18 + TypeScript + Vite + Three.js（@react-three/fiber、@react-three/drei）+ MediaPipe Tasks Vision + Tailwind CSS v4
