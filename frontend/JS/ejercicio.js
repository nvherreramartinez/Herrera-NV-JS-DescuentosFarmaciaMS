const usuarioCarnet = prompt ('Tenes carnet?');
const edadUsuarioCarnet = parseInt (prompt ('Decime tu edad'));

if(edadUsuarioCarnet >= 18){
    if (usuarioCarnet === 'si'){
        console.log ('Excelente, podes seguir el viaje');
    }else {
        console.log ('Te voy a retener el auto');
    }

}else {
    console.log ('voy a tener que llamar a tus padres');
}

if(edadUsuarioCarnet >= 18 && usuarioCarnet === 'si'){

}else if (edadUsuarioCarnet< 18 && usuarioCarnet === 'si'){
    console.log ("tenes que ser mayor para manejar")
}

