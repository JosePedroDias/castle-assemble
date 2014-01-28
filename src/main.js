// http://threejs.org/examples/misc_controls_trackball.html
// http://threejs.org/examples/#misc_controls_orbit
// http://threejs.org/examples/#webgl_helpers


//(function() {

    // constants
    var MAT_COLOR = 0xAA00AA;
    var MAT_SPEC  = 0x111111;
    var MAT_SHINE = 100;
    var GRD_COLOR = 0x999999;
    var GRD_SPEC  = 0x101010;
    var FOG_COLOR = 0x72645b;

    // globals
    var container, controls, camera, cameraTarget, scene, model, renderer;

    // state
    var state = {
        shadows: false,
        fog:     false,
        ground:  false,
        debug:   true
    };

    var t0, t;



    var shaders = {};
    var shadersToLoad = ['1.glslv', '2.glslf'];

    var delFromArr = function(el, arr) {
        var i = arr.indexOf(el);
        if (i === -1) { throw el + ' not found in ' + JSON.stringify(arr) + '!'; }
        arr.splice(i, 1);
    };

    var onShaderLoaded = function(err, data, url) {
        if (err) { throw err; }

        var name = url.split('/').pop();
        shaders[name] = data;
        delFromArr(name, shadersToLoad);
        console.log(name + ' shader code loaded.');

        if (shadersToLoad.length === 0) {
            console.log('all shaders loaded. starting...');
            init();
        }
    };

    shadersToLoad.forEach(function(name) {
        ajax('shaders/' + name, onShaderLoaded);
    });



    var geos = {};
    var geosToLoad = ['wall.stl', 'round-wall.stl'];



    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        // camera
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50);
        camera.position.set(-5, 20, 5);
        cameraTarget = new THREE.Vector3(0, 0, 1.5);

        scene = new THREE.Scene();
        
        if (state.fog) {
            scene.fog = new THREE.Fog(FOG_COLOR, 20, 50); // clr, near, far
        }

        // controls
        controls = new THREE.OrbitControls(camera);
        controls.addEventListener('change', render);

        //controls.camera.


        var loader = new THREE.STLLoader();
        var onGeoLoaded = function(el, g) {
            geos[el] = g;
            delFromArr(el, geosToLoad);
            console.log('loaded model ' + el);
            if (geosToLoad.length === 0) { init2(); }
        };

        /*var loader = new THREE.OBJLoader();
        var onGeoLoaded = function(el, o) {
            var g = o.children[0].geometry;
            geos[el] = g;
            delFromArr(el, geosToLoad);
            console.log('loaded model ' + el);
            if (geosToLoad.length === 0) { init2(); }
        };*/

        if (geosToLoad.length === 0) {
            init2();
        }
        else {
            geosToLoad.forEach(function(el) {
                loader.load('models/' + el, onGeoLoaded.bind(null, el));
            });
        }
        


        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha:     false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(FOG_COLOR, 1);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.physicallyBasedShading = true;

        if (state.shadows) {
            renderer.shadowMapEnabled = true;
            renderer.shadowMapCullFace = THREE.CullFaceBack;
        }

        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
    }


    function init2() {
        console.log('all models loaded, setting up...');

        // ground
        if (state.ground) {
            var ground = new THREE.Mesh( 
                new THREE.PlaneGeometry(40, 40),
                new THREE.MeshPhongMaterial({
                    ambient:  GRD_COLOR,
                    color:    GRD_COLOR,
                    specular: GRD_SPEC
                })
            );
            ground.rotation.x = -Math.PI/2;
            //ground.position.y = -0.5;
            scene.add(ground);

            if (state.shadows) {
                ground.receiveShadow = true;
            }
        }



        // regular mat
        var mat = new THREE.MeshPhongMaterial({
            ambient:   MAT_COLOR,
            color:     MAT_COLOR,
            specular:  MAT_SPEC,
            shininess: MAT_SHINE
        });



        // glsl
        /*var uniforms = { // 1.glslf
            time:       {type:"f",  value:1.0},
            resolution: {type:"v2", value:new THREE.Vector2()}
        };*/
        /*var uniforms = { // 2.glslf
            time:       {type:"f",  value:1.0},
            resolution: {type:"v2", value:new THREE.Vector2()},
            texture:    {type:"t",  value:THREE.ImageUtils.loadTexture("textures/disturb.jpg")}
        };
        uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;
        window.uniforms = uniforms;

        var mat = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   shaders['1.glslv'],
            fragmentShader: shaders['2.glslf']
        });*/



        model = new THREE.Mesh(
            //new THREE.PlaneGeometry(5, 5, 4, 4),
            //new THREE.CubeGeometry(5, 5, 5, 4, 4, 4),
            //new THREE.SphereGeometry(5, 20, 20),
            //new THREE.CylinderGeometry(2.5, 2.5, 5, 16, 1, false), // radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
            //new THREE.TorusGeometry(4, 1, 16, 32, Math.PI * 2), // radius, tube, radSegs, tubSegs, arc
            geos['round-wall.stl'],
            //geos['wall.stl'],
            mat
        );
        scene.add(model);
            
        if (state.shadows) {
            model.castShadow = true;
            model.receiveShadow = true;
        }

        t0 = new Date().valueOf();

        if (state.debug) {
            var wireframe = new THREE.WireframeHelper(model);
            wireframe.material.depthTest   = false;
            wireframe.material.opacity     = 0.25;
            wireframe.material.transparent = true;
            scene.add(wireframe);

            scene.add( new THREE.BoxHelper(model) );

            var grid = new THREE.GridHelper(20, 1);
            grid.setColors(0x0000ff, 0x808080);
            //grid.position.y = -0.5;
            scene.add(grid);
        }
        
        /*var loader = new THREE.STLLoader();
        loader.addEventListener('loaded', onModelLoaded);
        loader.load('models/' + state.model + '.stl');*/

        /*var loader = new THREE.OBJLoader();
        loader.load('models/' + state.model + '.obj', onModelLoaded);*/
        


        // lights
        scene.add( new THREE.AmbientLight(0x777777) );

        addShadowedLight(1,   1,  1, 0xFFFFFF, 1.35);
        addShadowedLight(0.5, 1, -1, 0xFFAA00, 1);

        animate();
        //render();
    }



    function addShadowedLight(x, y, z, color, intensity) {
        var directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        scene.add(directionalLight);

        if (!state.shadows) { return; }

        directionalLight.castShadow = true;
        // directionalLight.shadowCameraVisible = true;

        var d = 1;
        directionalLight.shadowCameraLeft   = -d;
        directionalLight.shadowCameraRight  =  d;
        directionalLight.shadowCameraTop    =  d;
        directionalLight.shadowCameraBottom = -d;

        directionalLight.shadowCameraNear = 1;
        directionalLight.shadowCameraFar  = 4;

        directionalLight.shadowMapWidth  = 1024;
        directionalLight.shadowMapHeight = 1024;

        directionalLight.shadowBias     = -0.005;
        directionalLight.shadowDarkness =  0.15;
    }



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
    }



    function animate() {
        requestAnimationFrame(animate);
        render();
        //uniforms.time.value = (new Date().valueOf() - t0) * 0.0001;
    }



    function render() {
        renderer.render(scene, camera);
    }


//})();