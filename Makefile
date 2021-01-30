clean:
	rm -rf build

preprocess:
	mkdir -p build
	python ./scripts/preprocess.py


build: clean preprocess
	cp build/human-condition.json ./frontend/src/data/human-condition.json

deploy:
	cd frontend && yarn build
	./deploy-to-s3

index:
	curl -H "Content-Type: application/json" -XPOST "localhost:9200/human-condition/_bulk?pretty&refresh" --data-binary "@./build/human-condition.json"

dev:
	cd frontend && yarn start
