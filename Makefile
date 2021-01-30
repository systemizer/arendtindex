clean:
	rm -rf build

preprocess:
	mkdir build
	python ./scripts/preprocess.py


build: clean preprocess
	cp build/human-condition.json ./frontend/src/data/human-condition.json
	cd frontend && yarn build

index:
	curl -H "Content-Type: application/json" -XPOST "localhost:9200/human-condition/_bulk?pretty&refresh" --data-binary "@./build/human-condition.json"

dev:
	cd frontend && yarn start
