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
        debug:   true,
        model:   'round-wall' // wall, round-wall
    };



    init();

    setTimeout(
        function() {
            render();
        },
        1000
    );

    render();



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



        // model
        var loader = new THREE.STLLoader();
        loader.addEventListener('load', function (ev) {
            var geo = ev.content;
            var mat = new THREE.MeshPhongMaterial({
                ambient:   MAT_COLOR,
                color:     MAT_COLOR,
                specular:  MAT_SPEC,
                shininess: MAT_SHINE
            });
            model = new THREE.Mesh(geo, mat);

            //mesh.position.set(x, y, z);
            model.rotation.set(-Math.PI/2, 0, 0);
            //mesh.scale.set(s, s, s);
            //geo.computeFaceNormals();
            
            if (state.shadows) {
                model.castShadow = true;
                model.receiveShadow = true;
            }

            scene.add(model);

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
        } );
        
        loader.load('models/' + state.model + '.stl');
        //loader.load('jscad/' + state.model + '.stl');
        


        // lights
        scene.add( new THREE.AmbientLight(0x777777) );

        addShadowedLight(1,   1,  1, 0xFFFFFF, 1.35);
        addShadowedLight(0.5, 1, -1, 0xFFAA00, 1);



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
        requestAnimationFrame( animate );
        render();
    }



    function render() {
        if (state.animate) {
            var timer = Date.now() * 0.0005;
            camera.position.x = Math.cos(timer) * 3;
            camera.position.z = Math.sin(timer) * 3;
            camera.lookAt(cameraTarget);
        }

        renderer.render(scene, camera);
    }


//})();