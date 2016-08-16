# show positional parameter $0, $1, $2
# also known as command line arguments
# is there a difference?

# $ sh ./dbexcute/restoredb.sh DB_USER DB_PW
# =
# $ sh $0 $1 $2

# show path to path/to/executables.sh
echo $0

# show DB_HOST
echo $1

# show DB_USER
echo $2

# show DB_PW
echo $3

# executable command to restore hosted database
mongorestore -h $1 -d motocross -u $2 -p $3 dump/motocross/documents.bson