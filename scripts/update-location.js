/**
 * 实时更新位置信息脚本
 * 通过 API 获取当前位置并更新到配置文件
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置文件路径
const configPath = path.join(__dirname, '../_config.icarus.yml');

/**
 * 从 IP API 获取位置信息
 * 使用 ipgeolocation.io API
 */
function getLocationFromIP() {
  return new Promise((resolve, reject) => {
    const apiKey = '0e7564adde9a43f4a87b5a2d378ee8c8';
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // 返回城市、州和国家
          const city = json.city || 'Unknown';
          const stateProv = json.state_prov ? `, ${json.state_prov}` : '';
          const country = json.country_name || 'Unknown';
          const location = `📍 ${city}${stateProv}, ${country}`;
          resolve(location);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * 从自定义 API 获取状态信息
 * 您可以修改这个 URL 为自己的 API 端点
 */
function getStatusFromAPI() {
  return new Promise((resolve) => {
    // 这是一个示例，您可以替换为自己的 API
    const now = new Date();
    const hours = now.getHours();
    
    let status = '🌐 Online';
    if (hours >= 0 && hours < 6) {
      status = '😴 Sleeping';
    } else if (hours >= 6 && hours < 9) {
      status = '☀️ Morning';
    } else if (hours >= 9 && hours < 12) {
      status = '💼 Working';
    } else if (hours >= 12 && hours < 18) {
      status = '⚡ Active';
    } else if (hours >= 18 && hours < 21) {
      status = '🌆 Evening';
    } else {
      status = '🌙 Night';
    }
    
    resolve(status);
  });
}

/**
 * 更新配置文件中的位置信息
 */
function updateConfig(location) {
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // 替换 location 字段
    content = content.replace(
      /location: .+/,
      `location: ${location}`
    );
    
    fs.writeFileSync(configPath, content, 'utf8');
    console.log(`✓ 位置已更新: ${location}`);
    return true;
  } catch (error) {
    console.error('✗ 更新配置失败:', error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('📍 正在获取位置信息...');
    
    // 获取位置信息
    const location = await getLocationFromIP();
    
    // 更新配置
    updateConfig(location);
    
  } catch (error) {
    console.error('获取位置信息失败:', error.message);
    // 失败时保持原值
    console.log('将保持原有位置信息不变');
  }
}

main();
