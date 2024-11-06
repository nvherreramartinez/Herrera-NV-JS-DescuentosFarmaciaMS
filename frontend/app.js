let entrada = prompt("Ingresar medicamento").toLowerCase();

while(entrada != "ESC"){
    switch (entrada) {
        case "Amoxiclina":
            alert("Cuantos miligramos");
            break;
        case "Ibuprofeno":
            alert("Cuantos miligramos");
            break;
        case "Paracetamol":
            alert("Cuantos miligramos");
            break;
        case "Novalgina":
            alert("Cuantos miligramos");
            break;
        default:
            alert("Ingresar medicamento correcto")
            break;
    }
    entrada = prompt ("Ingresar medicamento");
}
