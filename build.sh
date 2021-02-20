docker stop ourbim_web_system || true
###
 # @Author: zk
 # @Date: 2021-02-20 13:37:06
 # @LastEditors: zk
 # @LastEditTime: 2021-02-20 14:15:15
 # @description: 
### 
image_version=`date +%Y%m%d%H%M`;
echo $image_version;
# cd vueServe
# git pull --rebase origin master;
docker stop ourbim_web_system || true \;
docker rm ourbim_web_system || true \;
cd /mnt/web/docker/container/jenkins/jenkins_home/workspace/ourbim_web_system \;
docker build  -t ourbim/system .;
docker images;
docker run -p 7012:80 -d --name ourbim_web_system -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/ourbim_web_system/dist:/usr/share/nginx/html -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/ourbim_web_system/nginx.conf:/etc/nginx/nginx.conf ourbim/system;
# -v ~/docker-data/house-web/appsettings.json:/app/appsettings.json -v ~/docker-data/house-web/NLogFile/:/app/NLogFile   --restart=always
docker logs ourbim_web_system;
