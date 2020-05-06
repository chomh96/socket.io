#!/bin/bash
FILE="techtree_monitoring"

case "$1" in
	start)
		if [ "$(ps -ef | grep $FILE | grep -v grep | wc -l)" != 0 ] 
		then
			ps -ef | grep $FILE | grep -v grep | awk '{print $2}' |
			while read PID
			do
				echo "$FILE is already running ..."
			done
		
		else
			nohup node ./bin/$FILE >> /dev/null &
			echo "$FILE started ..."
			
		fi
	;;

	stop)
		if [ "$(ps -ef | grep $FILE | grep -v grep | wc -l)" != 0 ] 
		then
			ps -ef | grep $FILE | grep -v grep | awk '{print $2}' |
			while read PID
			do
			      echo "try $FILE stop!!!...."
				echo $PID
				kill -9 $PID
			done

		else
			echo " $FILE  not running...."		
		fi
	;;

	restart)
		if [ "$(ps -ef | grep $FILE | grep -v grep | wc -l)" != 0 ] 
		then

			ps -ef | grep $FILE | grep -v grep | awk '{print $2}' |
			while read PID
			do
			      echo "try $FILE stop...."
					  kill -9 $PID
			done

			echo "$FILE starting ..."
			nohup node ./bin/$FILE /dev/null & 
		else
			echo "$FILE is not running ..."		
		fi

	;;

	*)
		echo "available command is (start|stop|restart)"

	;;

esac
