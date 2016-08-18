# show positional parameter $0, $1, $2
# also known as command line arguments
# is there a difference?

# $ sh ./dbexcute/restoredb.sh DB_USER DB_PW
# =
# $ sh $0 $1 $2

# show path to path/to/executables.sh
echo 'positional parameter $0 : Path to this file - ' $0

# show DB_HOST
echo 'positional parameter $1 : Database Host - ' $1

# show DB_USER
echo 'positional parameter $2 : Database Username - '$2

# show DB_PW
echo 'positional parameter $3 : Database Password'

# executable command to restore hosted database
mongoimport -h $1 -d motocross -c documents -u $2 -p $3 --type json --file laptimes/allmoto.json 
