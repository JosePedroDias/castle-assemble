function main(params) {
    var r =  3,
        h =  3,
        d =  0.2;
        
    return [
        //rotate_extrude(translate([4,0,0],circle({r: 1, fn: 30, center: true})))
        rotate_extrude(
            {fn:32}, // steps
            polygon({points:[
                [r-d, 0],
                [r-d, h],
                [r,   h],
                [r,   0]
            ]})
        )
    ];
}
