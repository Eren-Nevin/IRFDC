#! /bin/sh

resource=$1

pid=$(ps aux | grep "python3 app.py $resource$" | awk '{print $2}')
echo $pid
kill $pid

rm ../appData/${resource}_progress.out
