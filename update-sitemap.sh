#!/bin/bash

# 更新sitemap.xml中的日期为当前日期
TODAY=$(date +%Y-%m-%d)
sed -i '' "s/<lastmod>[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}<\/lastmod>/<lastmod>$TODAY<\/lastmod>/g" sitemap.xml

echo "Sitemap已更新，日期设置为: $TODAY"