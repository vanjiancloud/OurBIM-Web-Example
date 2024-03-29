###
 # @Author: zk
 # @Date: 2021-02-20 13:37:06
 # @LastEditors: zk
 # @LastEditTime: 2021-06-05 18:06:17
 # @description: 
image_version=`date +%Y%m%d%H%M`;
echo $image_version;
# cd vueServe
# git pull --rebase origin master;
docker stop beta_ourbim_web_system || true \;
docker rm beta_ourbim_web_system || true \;
docker build  -t ourbim/beta_system .;
docker images;
docker run -p 7013:80 -d --name beta_ourbim_web_system -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/test-ourbim-web-system/dist:/usr/share/nginx/html -v /mnt/web/docker/container/jenkins/jenkins_home/workspace/test-ourbim-web-system/nginx.conf:/etc/nginx/nginx.conf ourbim/beta_system;
