var fs = require('fs');
var config = require('../config/config');
var request = require('request');

var url = config.IP_URL;  // IP 명단 URL
var access_ip = null;  // IP 명단 목록

var fileWatch;  // 파일 검사 변수

// LOG
var logger = require('../config/log');

module.exports = function(io) {
    // 소켓 연결
    io.on('connection', function (socket) {

        // 허용 IP 목록 가져오기
        request({url: url, method: 'GET'}, function (error, response, body) {

          // IP 파일 유무 Check..
          try {
            access_ip = JSON.parse(body).ip;
            access_ip = access_ip.split("?");

          } catch (e) {
            socket.emit("msg", {data: "Not found IP list file"});
            socket.disconnect();
            logger.info(user_ip+" >> Disconnected! : Not found IP list file");

            return false;
          }



          var user_ip = socket.handshake.address;
          user_ip = user_ip.split(":")[3];
          logger.info(user_ip+" >> Socket connect attempt..");

          var access = false;

          // 허용 IP인지 검색
          for(var i = 0; i < access_ip.length; i++) {
            if(access_ip[i] == user_ip)
              access = true;
          }

          if (access) {
              logger.info(user_ip+" >> Connect!");
              socket.emit("msg", {data: ""});

              var file_link = null;
              socket.on('file_link', function (data) {
                  file_link = data.data;

                  if(fs.existsSync(file_link)){
                      fileWatch = fs.watch(file_link, function(eventType , filename ){

                          fs.readFile(file_link, 'utf8', function(err, data){
                              if(err)
                                logger.error(err);

                              var file = data.split("\n"); // 마지막 문자가 \n 으로인해 마지막 인덱스는 빈 값
                              logger.info(user_ip+" >> Send!");
                              socket.emit("file", {data: file[file.length - 2]});
                          });
                      });
                  }else{
                    socket.emit("msg", {data: "Not found file!"});
                    socket.disconnect();
                    logger.info(user_ip+" >> Not found file!");
                  }
              });

              socket.on('disconnect', function (data) {
                  if(fileWatch)
                      fileWatch.close();
                  logger.info(user_ip+" >> Disconnected!");
              });

              socket.on('error', function (data) {
                  logger.error(data);
                  logger.info(user_ip+" >> Error : " + data);
              });

          }else{
              socket.emit("msg", {data: "ip is not allow"});
              socket.disconnect();
              logger.info(user_ip+" >> Disconnected! : ip is not allow");
          }
        });
    });
};
