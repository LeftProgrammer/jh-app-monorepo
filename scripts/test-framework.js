#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 开始测试 jinghe-sanjiaoroad App 框架结构...\n');

// 检查包结构
const packagesDir = path.resolve(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

console.log('📦 检查包结构:');
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  const pkgJsonPath = path.join(pkgPath, 'package.json');

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    console.log(`  ✅ ${pkgJson.name} - ${pkgJson.description}`);
  } else {
    console.log(`  ❌ ${pkg} - 缺少 package.json`);
  }
});

// 检查示例项目
const playgroundDir = path.resolve(__dirname, '../playground');
if (fs.existsSync(playgroundDir)) {
  const playgrounds = fs.readdirSync(playgroundDir);
  console.log('\n🎮 检查开发验证项目:');
  playgrounds.forEach(playground => {
    const playgroundPath = path.join(playgroundDir, playground);
    const playgroundJsonPath = path.join(playgroundPath, 'package.json');

    if (fs.existsSync(playgroundJsonPath)) {
      const playgroundJson = JSON.parse(fs.readFileSync(playgroundJsonPath, 'utf8'));
      console.log(`  ✅ ${playgroundJson.name} - ${playgroundJson.description}`);
    } else {
      console.log(`  ⚠️  ${playground} - 开发验证项目`);
    }
  });
}

// 检查一体化包文件
const jhAppDir = path.resolve(__dirname, '../packages/jinghe-sanjiaoroad-app/src');
const jhAppFiles = [
  'index.ts',
  'http/index.ts',
  'store/index.ts',
  'router/index.ts',
  'config/index.ts',
  'utils/index.ts',
  'types/index.ts'
];

console.log('\n🔧 检查一体化包文件:');
jhAppFiles.forEach(file => {
  const filePath = path.join(jhAppDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - 文件缺失`);
  }
});

// 检查组件文件
const componentsDir = path.resolve(__dirname, '../packages/jinghe-sanjiaoroad-app/src/components');
if (fs.existsSync(componentsDir)) {
  const componentFiles = fs.readdirSync(componentsDir);
  console.log('\n🎨 检查组件文件:');
  componentFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    console.log(`  ✅ ${file}`);
  });
}

// 检查工具文件
const utilsDir = path.resolve(__dirname, '../packages/jinghe-sanjiaoroad-app/src/utils');
if (fs.existsSync(utilsDir)) {
  const utilFiles = fs.readdirSync(utilsDir);
  console.log('\n🛠️ 检查工具文件:');
  utilFiles.forEach(file => {
    const filePath = path.join(utilsDir, file);
    console.log(`  ✅ ${file}`);
  });
}

console.log('\n✅ 框架结构检查完成!');
console.log('\n📝 下一步建议:');
console.log('  1. 运行 pnpm install 安装依赖');
console.log('  2. 运行 pnpm build 构建所有包');
console.log('  3. 运行 pnpm --filter @jinghe-sanjiaoroad-app/app dev 开发一体化包');
console.log('  4. 运行 pnpm --filter @jinghe-sanjiaoroad-app/app build 构建一体化包');
console.log('  5. 打开 examples/simple/index.html 测试基础功能');
console.log('\n🎯 一体化包优势:');
console.log('  ✅ 只需安装 @jinghe-sanjiaoroad-app/app 一个依赖');
console.log('  ✅ 包含所有功能：HTTP、状态管理、路由、组件、工具');
console.log('  ✅ 统一的版本管理和发布');
console.log('  ✅ 简化使用和配置');
console.log('  ✅ 类型安全的 TypeScript 支持');
