MAIN_MODULE=core.js
SUB_MODULES=draw.js shape.js rand.js util.js events.js color.js
LOCATIONS=$(patsubst %, src/%, $(MAIN_MODULE) $(SUB_MODULES))

TARGETS=bin/vis.js bin/vis.min.js
FLAGS=--screw-ie8 -e

.PHONY: all clear

all: clear $(TARGETS)

clear:
	rm -f $(TARGETS)

bin/vis.js:
	uglifyjs $(LOCATIONS) -o bin/vis.js $(FLAGS) -b --comments

bin/vis.min.js:
	uglifyjs $(LOCATIONS) -o bin/vis.min.js $(FLAGS) --source-map bin/vis.min.map