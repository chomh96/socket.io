var exec = require('child_process').exec;

// LOG
var logger = require('../config/log');

var command;  // 명령어 변수

var capacity;
var cur_capacity;
var memory;
var cur_memory;

module.exports = async function() {

    // 서버 총 용량
    function capacityCommand(cmd) {
        return new Promise(function(resolve, reject) {
            exec(cmd, function(error, stdout, stderr) {
                if(error)
                  logger.error(error);
                stdout = Number(stdout.split("\n")[0]).toFixed(2);
                resolve(stdout ? stdout : stderr);
            });
        });
    }

    // 서버 현재 사용 용량
    function cur_capacityCommand(cmd) {
        return new Promise(function(resolve, reject) {
            exec(cmd, function(error, stdout, stderr) {
                if(error)
                  logger.error(error);
                stdout = Number(stdout.split("\n")[0]).toFixed(2);
                resolve(stdout ? stdout : stderr);
            });
        });
    }

    // 메모리 용량 계산
    function memoryCommand(cmd) {
        return new Promise(function(resolve, reject) {
            exec(cmd, function(error, stdout, stderr) {
                if(error)
                  logger.error(error);
                // 전체 메모리 용량
                memory = (Number(stdout.split('kB')[0].split(':')[1].trim())/1024).toFixed(2);
                // 사용중인 메모리 용량
                cur_memory = (Number(memory) - Number(stdout.split('kB')[1].split(':')[1].trim())/1024).toFixed(2);

                resolve(stdout ? stdout : stderr);
            });
        });
    }

    capacity = await capacityCommand("df -P | grep -v ^Filesystem | awk '{sum += $2} END { print sum/1024/1024}'");
    cur_capacity = await cur_capacityCommand("df -P | grep -v ^Filesystem | awk '{sum += $3} END { print sum/1024/1024}'");
    await memoryCommand("cat /proc/meminfo");

    var result = new Object({});

    result.capacity = capacity;
    result.cur_capacity = cur_capacity;
    result.memory = memory;
    result.cur_memory = cur_memory;

    result = JSON.stringify(result);

    return new Promise(function(resolve, reject){
        resolve(result);
    });
};
