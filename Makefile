MODULES=core.js draw.js rand.js shape.js util.js
LOCATIONS=$(patsubst %, src/%, $(MODULES))

TARGETS=bin/vis.js bin/vis.min.js
FLAGS=--screw-ie8 -e

.PHONY: all clear

all: clear $(TARGETS)

clear:
	rm -f $(TARGETS)

bin/vis.js:
	uglifyjs $(LOCATIONS) -o bin/vis.js $(FLAGS) -b 

bin/vis.min.js:
	uglifyjs $(LOCATIONS) -o bin/vis.min.js $(FLAGS) --source-map bin/vis.min.map