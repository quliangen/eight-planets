#!/usr/bin/env sh

# 忽略错误
set -e

# 构建
npm run build

# 进入待发布的目录
cd dist

# 清理 .git 解决：Reinitialized existing Git repository
find . -name ".git"
rm -rf ./.git

git init
git add -A
git commit -m 'deploy'

# 部署到 https://quliangen.github.io/eight-planets/
git push -f git@github.com:quliangen/eight-planets.git main:gh-pages

cd -