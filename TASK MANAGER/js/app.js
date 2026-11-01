console.log("Archivo app.js cargado");

//CAPTURAR LOS ELEMENTOS DEL HTML

const titulo = document.getElementById("titulo");
const prioridad = document.getElementById("prioridad");
const boton = document.getElementById("agregar");
const resultado = document.getElementById("resultado");
const contenedor = document.getElementById("contenedor-tareas");
const total = document.getElementById("total");
const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");
const estado = document.getElementById("estado");
const buscar = document.getElementById("buscar");
const ordenar = document.getElementById("ordenar");


//ARREGLO PARA GUARDAR LAS TAREAS

let tareas = [];

//VARIABLE PARA SABER SI ESTAMOS EDITANDO UNA TAREA

let tareaEditar = null;

//FUNCION PARA GUARDAR LAS TAREAS EN LOCALSTORAGE

function guardarTareas(){

    let tareasGuardar = [];

    for (let i = 0; i < tareas.length; i++){

        let datos = {
            titulo: tareas[i].titulo,
            prioridad: tareas[i].prioridad,
            completada: tareas[i].completada,
            fecha: tareas[i].fecha
        };

        tareasGuardar.push(datos);

    }

    localStorage.setItem("tareas", JSON.stringify(tareasGuardar));

}


 //FUNCION PARA RECUPERAR LAS TAREAS GUARDADAS

function cargarTareas(){

    //OBTENER LOS DATOS DE LOCALSTORAGE

    let datosGuardados = localStorage.getItem("tareas");

    //COMPROBAR SI EXISTEN TAREAS GUARDADAS

    if (datosGuardados !== null) {

        //CONVERTIR EL TEXTO EN UN ARREGLO

        tareas = JSON.parse(datosGuardados);

        //RECONSTRUIR LAS TARJETAS

        for (let i = 0; i < tareas.length; i++) {

            crearTarjeta(tareas[i]);

        }

    }

    //ACTUALIZAR LAS ESTADISTICAS Y LA LISTA

    actualizarEstadisticas();
    mostrarTareas();

}

//FUNCION PARA OBTENER TAREAS DESDE LA API

async function obtenerTareasAPI(){

    try {

        //CONSULTAR LA API

        const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos");

        //COMPROBAR SI LA RESPUESTA ES CORRECTA

        if (respuesta.ok === false){

            throw new Error("No se pudieron obtener las tareas.");

        }

        //CONVERTIR LA RESPUESTA EN DATOS DE JAVASCRIPT

        const datos = await respuesta.json();

        
        //COMPROBAR SI YA EXISTEN TAREAS GUARDADAS

        let datosGuardados = localStorage.getItem("tareas");

        if (datosGuardados === null) {

            //RECORRER LAS TAREAS DE LA API

            for (let i = 0; i < datos.length; i++) {

                //CREAR UN OBJETO CON NUESTRA ESTRUCTURA

                let tarea = {
                    titulo: datos[i].title,
                    prioridad: "Media",
                    completada: datos[i].completed,
                    fecha: new Date()
                };

                //AGREGAR LA TAREA AL ARREGLO

                tareas.push(tarea);

                //CREAR SU TARJETA HTML

                crearTarjeta(tarea);

            }

            //GUARDAR LAS TAREAS IMPORTADAS

            guardarTareas();

            //ACTUALIZAR LA PANTALLA

            notificarCambioTareas();
            mostrarTareas();

            resultado.textContent = "Tareas iniciales cargadas correctamente.";
            resultado.style.color = "green";

        } else {

            console.log("Ya existen tareas guardadas. No se importarán duplicados.");

        }


    } catch (error){

        //MOSTRAR UN MENSAJE SI OCURRE UN ERROR

        resultado.textContent = "No se pudieron cargar las tareas de internet. Puedes seguir utilizando tus tareas guardadas.";
        resultado.style.color = "red";

        console.log(error);

    }

}



//FUNCION PARA ACTUALIZAR LAS ESTADISTICAS

function actualizarEstadisticas(){

    let cantidadPendientes = 0;
    let cantidadCompletadas = 0;

    // RECORRER EL ARREGLO DE TAREAS

    for (let i = 0; i < tareas.length; i++){

        if (tareas[i].completada === true){

            cantidadCompletadas++;

        } else {

            cantidadPendientes++;

        }

    }

    // MOSTRAR LOS RESULTADOS EN EL HTML

    total.textContent = tareas.length;
    pendientes.textContent = cantidadPendientes;
    completadas.textContent = cantidadCompletadas;

}


//EVENTO PERSONALIZADO PARA ACTUALIZAR LAS ESTADISTICAS

    document.addEventListener("tareasActualizadas", function(){

        actualizarEstadisticas();

});


//FUNCION PARA AVISAR QUE LAS TAREAS CAMBIARON

function notificarCambioTareas(){

    const evento = new CustomEvent("tareasActualizadas");

    document.dispatchEvent(evento);

}


//FUNCION PARA MOSTRAR Y BUSCAR LAS TAREAS SEGUN EL ESTADO

function mostrarTareas(){

    //LIMPIAR EL CONTENEDOR

    contenedor.innerHTML = "";

    let tareasFiltradas = [];

    //FILTRAR POR ESTADO

    if (estado.value === "Pendientes"){

        tareasFiltradas = tareas.filter(function(tarea){
            return tarea.completada === false;
        });

    } else if (estado.value === "Completadas"){

        tareasFiltradas = tareas.filter(function(tarea){
            return tarea.completada === true;
        });

    } else{

        tareasFiltradas = tareas;

    }

    // BUSCAR TAREAS POR TITULO

    if (buscar.value.trim() !== ""){

        tareasFiltradas = tareasFiltradas.filter(function(tarea){

            return tarea.titulo.toLowerCase().includes(buscar.value.trim().toLowerCase());

        });

    }
    
    // ORDENAR LAS TAREAS
    
    // CREAR UNA COPIA DEL ARREGLO PARA ORDENAR

    tareasFiltradas = tareasFiltradas.slice();

    if(ordenar.value === "prioridad"){

    //ORDENAR POR PRIORIDAD: ALTA, MEDIA Y BAJA

        tareasFiltradas.sort(function(a, b){

        let prioridadA = 0;
        let prioridadB = 0;

        if (a.prioridad === "Alta"){
            prioridadA = 3;
        } else if (a.prioridad === "Media"){
            prioridadA = 2;
        } else {
            prioridadA = 1;
        }

        if (b.prioridad === "Alta"){
            prioridadB = 3;
        } else if (b.prioridad === "Media"){
            prioridadB = 2;
        } else {
            prioridadB = 1;
        }

        return prioridadB - prioridadA;

    });

} else {

    //ORDENAR POR FECHA DE CREACION: MAS RECIENTES PRIMERO

    tareasFiltradas.sort(function(a, b){

        return new Date(b.fecha) - new Date(a.fecha);

    });

}

    //MOSTRAR LAS TAREAS

    for (let i = 0; i < tareasFiltradas.length; i++){

        contenedor.appendChild(tareasFiltradas[i].tarjeta);

    }

    //MENSAJE SI NO HAY RESULTADOS

    if(tareasFiltradas.length === 0){

        contenedor.textContent = "No hay tareas para mostrar.";

    }

}


function crearTarjeta(tarea) {

    //CREAR ELEMENTOS HTML

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-tarea";

    tarea.tarjeta = tarjeta;

    const nombreTarea = document.createElement("h3");
    nombreTarea.textContent = tarea.titulo;

    const prioridadTarea = document.createElement("p");
    prioridadTarea.textContent = "Prioridad: " + tarea.prioridad;

    tarea.nombreTarea = nombreTarea;
    tarea.prioridadTarea = prioridadTarea;

    //CREAR BOTONES

    const botonCompletar = document.createElement("button");
    botonCompletar.textContent = "Completar tarea";

    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar tarea";
    botonEditar.className = "boton-editar";

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar tarea";
    botonEliminar.className = "boton-eliminar";

    //MOSTRAR EL ESTADO DE LA TAREA

    if (tarea.completada === true) {

        nombreTarea.style.textDecoration = "line-through";
        nombreTarea.style.color = "green";
        botonCompletar.textContent = "Marcar pendiente";

    }

    //EVENTO DEL BOTON EDITAR

    botonEditar.addEventListener("click", function() {

        titulo.value = tarea.titulo;
        prioridad.value = tarea.prioridad;

        tareaEditar = tarea;

        boton.textContent = "Guardar cambios";

        resultado.textContent = "Modifica los datos y guarda los cambios.";
        resultado.style.color = "blue";

    });

    //EVENTO DEL BOTON COMPLETAR

    botonCompletar.addEventListener("click", function(){

        if (tarea.completada === false) {

            tarea.completada = true;

            nombreTarea.style.textDecoration = "line-through";
            nombreTarea.style.color = "green";

            botonCompletar.textContent = "Marcar pendiente";

        } else{

            tarea.completada = false;

            nombreTarea.style.textDecoration = "none";
            nombreTarea.style.color = "";

            botonCompletar.textContent = "Completar tarea";

        }

        guardarTareas();
        notificarCambioTareas();
        mostrarTareas();

        console.table(tareas);

    });

    //EVENTO DEL BOTON ELIMINAR

    botonEliminar.addEventListener("click", function(){

        let posicion = tareas.indexOf(tarea);

        if (posicion !== -1) {

            tareas.splice(posicion, 1);

        }

        guardarTareas();
        notificarCambioTareas();

        tarjeta.remove();

        if (tareaEditar === tarea) {

            tareaEditar = null;

            titulo.value = "";
            prioridad.value = "Alta";

            boton.textContent = "Agregar tarea";

        }

        resultado.textContent = "Tarea eliminada correctamente.";
        resultado.style.color = "green";

        mostrarTareas();

        console.table(tareas);

    });

    // AGREGAR ELEMENTOS A LA TARJETA

    tarjeta.appendChild(nombreTarea);
    tarjeta.appendChild(prioridadTarea);
    tarjeta.appendChild(botonCompletar);
    tarjeta.appendChild(botonEditar);
    tarjeta.appendChild(botonEliminar);

}


//BOTON AGREGAR

boton.addEventListener("click", function(){

    resultado.innerHTML = "";

    //VALIDAR QUE EL TITULO NO ESTE VACIO

    if (titulo.value.trim() === ""){

        resultado.textContent = "Debes escribir el título de la tarea.";
        resultado.style.color = "red";

    } else if (tareaEditar !== null){

        //MODIFICAR LOS DATOS DE LA TAREA

        tareaEditar.titulo = titulo.value.trim();
        tareaEditar.prioridad = prioridad.value;
        guardarTareas();
        notificarCambioTareas();


        //ACTUALIZAR LOS DATOS EN LA PANTALLA

        tareaEditar.nombreTarea.textContent = tareaEditar.titulo;
        tareaEditar.prioridadTarea.textContent = "Prioridad: " + tareaEditar.prioridad;
        mostrarTareas();

        //LIMPIAR EL FORMULARIO

        titulo.value = "";
        prioridad.value = "Alta";

        boton.textContent = "Agregar tarea";

        tareaEditar = null;

        resultado.textContent = "Tarea editada correctamente.";
        resultado.style.color = "green";

        console.table(tareas); 
    
    } else{

        //CREAR UN OBJETO CON LOS DATOS DE LA TAREA

        let tarea = {
            titulo: titulo.value.trim(),
            prioridad: prioridad.value,
            completada: false,
            fecha: new Date()
        };

        //AGREGAR LA TAREA AL ARREGLO

        tareas.push(tarea);
        guardarTareas();
        notificarCambioTareas();

        //CREAR LA TARJETA DE LA NUEVA TAREA

        crearTarjeta(tarea);

        //ACTUALIZAR LAS TAREAS EN PANTALLA

        mostrarTareas();

        //MOSTRAR MENSAJE DE CONFIRMACION

        resultado.textContent = "Tarea agregada correctamente.";
        resultado.style.color = "green";

        //LIMPIAR EL CAMPO DEL TITULO

        titulo.value = "";

        console.table(tareas);

    }

});

//EVENTO PARA FILTRAR LAS TAREAS
estado.addEventListener("change", function(){

    mostrarTareas();

});


//EVENTO PARA BUSCAR TAREAS EN TIEMPO REAL

buscar.addEventListener("input", function(){

    mostrarTareas();

});


//EVENTO PARA ORDENAR LAS TAREAS

ordenar.addEventListener("change", function(){

    mostrarTareas();

});


//CARGAR LAS TAREAS GUARDADAS AL INICIAR LA PAGINA

cargarTareas();


//CONSULTAR LAS TAREAS DE LA API

obtenerTareasAPI();





