function main(params) {
    var w =  2,
        h =  3,
        d =  0.2;
        
    return [
        linear_extrude(
            {height: h},
            polygon({points:[
                [w, 0],
                [w, d],
                [0, d],
                [0, 0]
            ]})
        )
    ];
}
