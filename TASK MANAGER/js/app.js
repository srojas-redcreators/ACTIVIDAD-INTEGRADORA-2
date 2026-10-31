console.log("Archivo app.js cargado");

//CAPTURAR LOS ELEMENTOS DEL HTML

const titulo = document.getElementById("titulo");
const prioridad = document.getElementById("prioridad");
const boton = document.getElementById("agregar");
const resultado = document.getElementById("resultado");
const contenedor = document.getElementById("contenedor-tareas");

//ARREGLO PARA GUARDAR LAS TAREAS

let tareas = [];

//VARIABLE PARA SABER SI ESTAMOS EDITANDO UNA TAREA

let tareaEditar = null;

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

        //ACTUALIZAR LOS DATOS EN LA PANTALLA

        tareaEditar.nombreTarea.textContent = tareaEditar.titulo;
        tareaEditar.prioridadTarea.textContent = "Prioridad: " + tareaEditar.prioridad;

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

        //CREAR ELEMENTOS HTML

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-tarea";

        const nombreTarea = document.createElement("h3");
        nombreTarea.textContent = tarea.titulo;

        //GUARDAR LOS ELEMENTOS HTML
        const prioridadTarea = document.createElement("p");
        prioridadTarea.textContent = "Prioridad: " + tarea.prioridad;
        tarea.nombreTarea = nombreTarea;
        tarea.prioridadTarea = prioridadTarea;
        
        const botonCompletar = document.createElement("button");
        botonCompletar.textContent = "Completar tarea";
        
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar tarea";
        botonEliminar.className = "boton-eliminar";
        
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar tarea";
        botonEditar.className = "boton-editar";
        
        
        //EVENTO DEL BOTON EDITAR

        botonEditar.addEventListener("click", function() {

            //COLOCAR LOS DATOS EN EL FORMULARIO

            titulo.value = tarea.titulo;
            prioridad.value = tarea.prioridad;

            //INDICAR QUE TAREA ESTAMOS EDITANDO

            tareaEditar = tarea;

            //CAMBIAR EL TEXTO DEL BOTON PRINCIPAL

            boton.textContent = "Guardar cambios";

            resultado.textContent = "Modifica los datos y guarda los cambios.";
            resultado.style.color = "blue";

        });

        //EVENTO DEL BOTON COMPLETAR

        botonCompletar.addEventListener("click", function() {

            if (tarea.completada === false) {

                tarea.completada = true;

                nombreTarea.style.textDecoration = "line-through";
                nombreTarea.style.color = "green";

                botonCompletar.textContent = "Marcar pendiente";

            } else {

                tarea.completada = false;

                nombreTarea.style.textDecoration = "none";
                nombreTarea.style.color = "";

                botonCompletar.textContent = "Completar tarea";

            }

            console.table(tareas);

        });

        //EVENTO DEL BOTON ELIMINAR

        botonEliminar.addEventListener("click", function() {

            //BUSCAR LA POSICION DE LA TAREA EN EL ARREGLO

            let posicion = tareas.indexOf(tarea);

            //ELIMINAR LA TAREA DEL ARREGLO

            if (posicion !== -1) {

                tareas.splice(posicion, 1);

            }

            //ELIMINAR LA TARJETA DE LA PANTALLA

            tarjeta.remove();
            
            //CANCELAR LA EDICION SI SE ELIMINA ESA TAREA

            if (tareaEditar === tarea) {

                tareaEditar = null;

                titulo.value = "";
                prioridad.value = "Alta";

                boton.textContent = "Agregar tarea";

            }

            //MOSTRAR MENSAJE SI NO QUEDAN TAREAS

            if (tareas.length === 0) {

                contenedor.innerHTML = "Todavía no hay tareas para mostrar.";

            }

            resultado.textContent = "Tarea eliminada correctamente.";
            resultado.style.color = "green";

            console.table(tareas);

        });



        //MOSTRAR LA TAREA EN PANTALLA

        tarjeta.appendChild(nombreTarea);
        tarjeta.appendChild(prioridadTarea);
        tarjeta.appendChild(botonCompletar);
        tarjeta.appendChild(botonEditar);
        tarjeta.appendChild(botonEliminar);
        

        //ELIMINAR EL MENSAJE INICIAL

        if (tareas.length === 1) {
            contenedor.innerHTML = "";
        }

        contenedor.appendChild(tarjeta);

        //MOSTRAR MENSAJE DE CONFIRMACION

        resultado.textContent = "Tarea agregada correctamente.";
        resultado.style.color = "green";

        //LIMPIAR EL CAMPO DEL TITULO

        titulo.value = "";

        console.table(tareas);

    }

});
