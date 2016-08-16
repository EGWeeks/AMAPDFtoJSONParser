# show positional parameter 0,1,2
# also known as command line arguments
# is there a difference?

# should show path to something.sh
echo $0

#should show DB_USER
echo $1

#should show DB_PW
echo $2

# executable command to restore hosted database
mongorestore -h ds153815.mlab.com:53815 -d motocross -u $1 -p $2 dump/motocross/documents.bson