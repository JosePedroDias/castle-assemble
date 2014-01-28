default: minify



minify: bundle
	@uglifyjs build/bundle.js > build/bundle.min.js
	@uglifyjs build/bundle.js > build/bundle-all.min.js



bundle:
	@cat external/three.js           > build/bundle.js
	@cat external/OBJLoader.js      >> build/bundle.js
	@cat external/STLLoader.js      >> build/bundle.js
	@cat external/OrbitControls.js  >> build/bundle.js

	#@cat external/ammo.js           >> build/bundle.js
	#@cat external/physi.js          >> build/bundle.js
	#@cat external/physijs_worker.js >> build/bundle.js

	#@cat external/csg.js            >> build/bundle.js
	#@cat external/ThreeCSG.js       >> build/bundle.js

	@cp build/bundle.js build/bundle-all.js

	@cat src/ajax.js                >> build/bundle-all.js
	@cat src/main.js                >> build/bundle-all.js



fetchExternals:
	# THREE.js
	@wget https://raw2.github.com/mrdoob/three.js/master/build/three.js                        -O external/three.js
	#@wget https://raw2.github.com/mrdoob/three.js/master/examples/js/loaders/OBJLoader.js      -O external/OBJLoader.js
	@wget https://raw2.github.com/mrdoob/three.js/master/examples/js/loaders/STLLoader.js      -O external/STLLoader.js
	@wget https://raw2.github.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js -O external/OrbitControls.js

	# AMMO.js
	@wget https://raw2.github.com/kripken/ammo.js/master/builds/ammo.js          -O external/ammo.js

	# PHYSI.js (three.js + ammo.js)
	@wget https://raw2.github.com/chandlerprall/Physijs/master/physi.js          -O external/physi.js
	@wget https://raw2.github.com/chandlerprall/Physijs/master/physijs_worker.js -O external/physijs_worker.js

	# CSG.js http://evanw.github.io/csg.js/
	@wget https://raw2.github.com/evanw/csg.js/master/csg.js                      -O external/csg.js

	# ThreeCSG (three.js + CSG.js)
	@wget https://raw2.github.com/chandlerprall/ThreeCSG/master/ThreeCSG.js       -O external/ThreeCSG.js



