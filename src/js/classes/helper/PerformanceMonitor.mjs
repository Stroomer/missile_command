/**
 * Performance Monitor - Optional debug utility
 * Shows FPS, update time, draw time, and collision detection stats
 */
export default class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.updateTime = 0;
    this.drawTime = 0;
    this.collisionTime = 0;
    this.enabled = true;

    // Create UI element
    this.createUI();
  }

  createUI() {
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #0f0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 10px;
      border: 1px solid #0f0;
      z-index: 10000;
      min-width: 200px;
    `;
    document.body.appendChild(this.element);
  }

  startMeasure() {
    return performance.now();
  }

  endMeasure(startTime) {
    return performance.now() - startTime;
  }

  update() {
    if (!this.enabled) return;

    const now = performance.now();
    this.frameCount++;

    // Update FPS every second
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;

      this.render();
    }
  }

  render() {
    const totalTime = this.updateTime + this.drawTime;
    const targetFrameTime = 16.67; // 60 FPS

    const fpsColor = this.fps >= 55 ? '#0f0' : this.fps >= 30 ? '#ff0' : '#f00';

    this.element.innerHTML = `
      <div style="color: ${fpsColor}; font-size: 16px; margin-bottom: 5px;">
        <strong>FPS: ${this.fps}</strong>
      </div>
      <div>Update: ${this.updateTime.toFixed(2)}ms</div>
      <div>Draw: ${this.drawTime.toFixed(2)}ms</div>
      <div>Collision: ${this.collisionTime.toFixed(2)}ms</div>
      <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #0f0;">
        Total: ${totalTime.toFixed(2)}ms / ${targetFrameTime.toFixed(2)}ms
      </div>
      <div style="margin-top: 5px; font-size: 10px; color: #888;">
        Press 'P' to toggle performance stats
      </div>
    `;
  }

  toggle() {
    this.enabled = !this.enabled;
    this.element.style.display = this.enabled ? 'block' : 'none';
  }
}
