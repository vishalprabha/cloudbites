set -B                  # enable brace expansion
for i in {0..10000}; do
  curl -X POST "https://ElasticSearchEngineAPI" -H "Content-Type: application/json" -H "Authorization: Bearer private-token-xxx" -d @file_names$i.json
  if (( $i % 100 == 0 ))
  then
    echo "Sleep for a minute to ease Elastic search data indexing"
    sleep 60
  fi
done