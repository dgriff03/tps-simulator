# ⚡ TPS Simulator

Experience AI model streaming speeds in real-time. This interactive Single Page Application (SPA) allows you to simulate and compare the Tokens-Per-Second (TPS) performance of various state-of-the-art LLMs.

![TPS Simulator Preview](https://github.com/user-attachments/assets/preview-placeholder)

## ✨ Features

- **Real-time Simulation**: Experience text streaming at speeds ranging from 1 to 500 TPS.
- **Model Comparison**: Side-by-side comparison of two different models or custom speeds.
- **Filterable Combo Box**: Quickly search and select models from an extensive list.
- **Independent Controls**: Each simulator has its own manual TPS slider for precise testing.
- **High-Precision Timing**: Smooth, hardware-accelerated animations using `requestAnimationFrame`.
- **Modern Aesthetics**: Sleek dark mode design with glassmorphism effects and terminal-style visuals.
- **Data Source**: Model speed data is sourced from [Artificial Analysis](https://artificialanalysis.ai/models/claude-opus-4-6-adaptive).

## 🚀 Getting Started

### Local Development

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment to Vercel

The easiest way to deploy this project is using the Vercel CLI or by connecting your GitHub repository to Vercel.

### Option 1: Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

### Option 2: GitHub Integration

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/new).
3. Import your repository.
4. Vercel will automatically detect the Vite project and deploy it.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Modern CSS variables, Flexbox/Grid)
- **Typography**: Inter & JetBrains Mono

---

Built with ⚡ by Antigravity.
