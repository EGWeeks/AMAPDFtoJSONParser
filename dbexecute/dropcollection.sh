# executable command to drop hosted collection - documents
mongo $1 -u $2 -p $3 --eval "db.documents.drop()"