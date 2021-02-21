###
 # @Author: zk
 # @Date: 2021-02-20 13:37:06
 # @LastEditors: zk
 # @LastEditTime: 2021-02-21 15:40:15
 # @description: 
image_version=`date +%Y%m%d%H%M`;
echo $image_version;
# cd vueServe
# git pull --rebase origin master;
docker stop ourbim_web_system || true \;
docker rm ourbim_web_system || true \;
docker build  -t ourbim/system .;
docker images;
docker run -p 7012:80 -d --name ourbim_web_system -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/ourbim-web-system/dist:/usr/share/nginx/html -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/ourbim-web-system/nginx.conf:/etc/nginx/nginx.conf ourbim/system;
