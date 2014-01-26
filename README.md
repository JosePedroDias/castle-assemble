Workflow:

creating an entity:

	create a parametric shape using openjscad
		see reference:
		https://github.com/Spiritdude/OpenJSCAD.org/wiki/User-Guide
		
	export it to STL
		openjscad wall.js //-of stlb
		mv wall.stl ../models

	assemble STL + shader + transformation + hull

create GLSL shaders
	
	bricks (polar, regular)

	wood

	metal

	rope

	water?

integrate physics engine such as ammo.js

create logic for destroying stuff?

compose entire castles by instancing entities and placing them correctly

