# castle assemble

## concept

* see an previw image of a castle
* create a 3D medieval castle by assembling pieces together (walls, towers, windows, doors, stairs, etc.), making it resemble the one you've seen before
* interact with the final geometry
    * game places a slingshot and a target and the player must destroy the target?
    * lemmings-like? make a horde of guys reach a destination



## survey URLs

http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/

http://threejs.org/
http://evanw.github.io/csg.js/
https://github.com/chandlerprall/ThreeCSG

https://github.com/chandlerprall/Physijs
https://github.com/kripken/ammo.js/

http://openjscad.org/
https://github.com/Spiritdude/OpenJSCAD.org

http://joostn.github.io/OpenJsCad/
https://github.com/joostn/OpenJsCad

https://github.com/evanw/lightgl.js

http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/

http://stackoverflow.com/questions/13624124/online-webgl-glsl-shader-editor

http://greweb.me/2013/02/glsl-js-a-javascript-glsl-library-dry-efficient/
https://github.com/gre/glsl.js


## Workflow:

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

create logic for destroying stuff (divide each breakable mesh into precomputed mesh fragments)
