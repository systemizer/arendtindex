
preprocess: build
	python ./scripts/preprocess.py


build:
	mkdir ./build

index:
	curl -H "Content-Type: application/json" -XPOST "localhost:9200/human-condition/_bulk?pretty&refresh" --data-binary "@./build/human-condition.json"
