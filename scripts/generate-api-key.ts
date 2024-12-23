import * as crypto from 'crypto';

const generateApiKey = () => {
    // 生成 32 字节的随机数
    const key = crypto.randomBytes(32).toString('hex');
    
    // 生成时间戳
    const timestamp = new Date().toISOString();
    
    console.log('===============================');
    console.log('Generated API Key Information:');
    console.log('===============================');
    console.log('API Key:', key);
    console.log('Generated at:', timestamp);
    console.log('Length:', key.length, 'characters');
    console.log('===============================');
    
    // 创建 .env 文件的内容
    return `PORT=3000
API_KEY=${key}
CORS_ORIGIN=http://localhost:3000,https://your-frontend-domain.com
# Generated at: ${timestamp}`;
};

// 写入 .env 文件
const fs = require('fs');
fs.writeFileSync('.env', generateApiKey()); 