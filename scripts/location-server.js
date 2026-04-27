/**
 * 实时位置信息服务器
 * 在后台持续运行，定期更新位置
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const configPath = path.join(__dirname, '../_config.icarus.yml');

/**
 * 获取当前状态
 */
function getCurrentStatus() {
  const now = new Date();
  const hours = now.getHours();
  
  const statuses = {
    sleep: { range: [0, 6], emoji: '😴', text: 'Sleeping' },
    morning: { range: [6, 9], emoji: '☀️', text: 'Morning' },
    working: { range: [9, 12], emoji: '💼', text: 'Working' },
    active: { range: [12, 18], emoji: '⚡', text: 'Active' },
    evening: { range: [18, 21], emoji: '🌆', text: 'Evening' },
    night: { range: [21, 24], emoji: '🌙', text: 'Night' }
  };
  
  for (const [key, status] of Object.entries(statuses)) {
    if (hours >= status.range[0] && hours < status.range[1]) {
      return `${status.emoji} ${status.text}`;
    }
  }
  
  return '🌐 Online';
}

/**
 * 从 IP 获取城市信息
 */
async function getCityFromIP() {
  return new Promise((resolve) => {
    const apiKey = '0e7564adde9a43f4a87b5a2d378ee8c8';
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    
    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const city = json.city || 'Online';
          const stateProv = json.state_prov ? `, ${json.state_prov}` : '';
          const country = json.country_name || '';
          const location = `📍 ${city}${stateProv}${country ? `, ${country}` : ''}`;
          resolve(location);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * 更新配置
 */
function updateConfig(location) {
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    content = content.replace(
      /location: .+$/m,
      `location: ${location}`
    );
    fs.writeFileSync(configPath, content, 'utf8');
    return true;
  } catch (error) {
    console.error('更新失败:', error.message);
    return false;
  }
}

/**
 * 定期更新位置
 */
async function startUpdating() {
  console.log('🚀 位置实时更新服务已启动');
  
  // 初始更新
  const location = await getCityFromIP();
  const finalLocation = location || getCurrentStatus();
  updateConfig(finalLocation);
  console.log(`[${new Date().toLocaleTimeString()}] 已更新: ${finalLocation}`);
  
  // 每 10 分钟更新一次位置（避免 API 请求过于频繁）
  setInterval(async () => {
    const location = await getCityFromIP();
    const finalLocation = location || getCurrentStatus();
    const updated = updateConfig(finalLocation);
    
    if (updated) {
      console.log(`[${new Date().toLocaleTimeString()}] 已更新: ${finalLocation}`);
    }
  }, 600000); // 每 600 秒 (10分钟) 更新一次
}

// 启动服务
startUpdating().catch(console.error);

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 位置更新服务已停止');
  process.exit(0);
});
