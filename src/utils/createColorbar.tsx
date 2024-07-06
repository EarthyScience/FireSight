export function createColorbar(
    colorbarElement: HTMLDivElement,
    ticksElement: HTMLDivElement,
    minValue: number,
    maxValue: number,
    numTicks: number
  ) {
    // Create gradient
    const gradient = `linear-gradient(to right, 
      hsl(240, 100%, 50%), 
      hsl(180, 100%, 50%), 
      hsl(120, 100%, 50%), 
      hsl(60, 100%, 50%), 
      hsl(0, 100%, 50%)
    )`;
    colorbarElement.style.background = gradient;
  
    // Clear existing ticks
    ticksElement.innerHTML = '';
  
    // Create ticks
    const range = maxValue - minValue;
    const tickStep = range / (numTicks - 1);
  
    for (let i = 0; i < numTicks; i++) {
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.left = `${(i / (numTicks - 1)) * 100}%`;
      ticksElement.appendChild(tick);
  
      const label = document.createElement('div');
      label.className = 'tick-label';
      label.style.left = `${(i / (numTicks - 1)) * 100}%`;
      label.style.top = '10px';
      label.textContent = (minValue + i * tickStep).toFixed(1);
      ticksElement.appendChild(label);
    }
  }