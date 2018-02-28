//**********************************************************************************************
//VARIABLES DE CONTROL
//**********************************************************************************************
var formContainer = null;
var nota = 0.0;

var preguntasSelect = [];
var respuestasSelect = [];
var valorRespuestaSelect = [];

var preguntasText = [];
var respuestasText = [];

var preguntasCheckBox = [];
var respuestasCheckBox = [];
var valorRespuestasCheckBox = [];

var preguntasRadio = [];
var respuestasRadio = [];
var valorRespuestaRadio = [];

var preguntasSelectMultiple = [];
var respuestasSelectMultiple = [];
var valorRespuestasSelectMultiple = [];

/* ---------------------------- REFACTORIZACION DICCIONARIO FUTURA ----------------------------
	
	var dict = {
		"select0" : {
			"indice" : 0;
			"respuestas" : "perro";
			"explicacion" : "<explanation>";
		}
		"checkbox0" :{
			"indice" : 4;
			"respuestas" : [0,2];
			"explicacion" : "<explanation>";
		}
	}
*/ 


//**********************************************************************************************
//AL CARGAR LA PAGINA
//**********************************************************************************************
window.onload = function(){ 
	//CORREGIR al apretar el botón
	formContainer=document.getElementById('myform');
	formContainer.onsubmit=function(){
		inicializar();
		if (comprobar()){
			document.getElementById('myform').style.display="none";
			document.getElementById('headMenu').focus();
			presentarNota();
			dibujarSeparador('resultadosDiv');
			corregirSelect();
			corregirText();
			corregirCheckBox();
			corregirRadio();
			corregirSelectMultiple();
			actualizarNota();
	 	}
	 	return false;
	}

	//LEER XML de xml/preguntas.xml
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};
	xhttp.open("GET", "xml/preguntas.xml", true);
	xhttp.send();
}



// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
	var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
	var tipo = "";
	var numeroCajaTexto = 0;
	for (i = 0; i<10; i++) {
		tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
		switch(tipo) {
			case "select":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirOpcionesSelect(i, xmlDoc);
				preguntasSelect.push(i);
				respuestasSelect.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				valorRespuestaSelect.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[respuestasSelect[i]].innerHTML);
				break;
			case "text":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCajaText(numeroCajaTexto, xmlDoc);
				numeroCajaTexto++;
				preguntasText.push(i);
				respuestasText.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				break;
			case "checkbox":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCheckBox(i, xmlDoc);
				preguntasCheckBox.push(i);
				agregarRespuestas(i, xmlDoc, respuestasCheckBox, valorRespuestasCheckBox);
				break;
			case "radio":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirRadioButton(i, xmlDoc);
				preguntasRadio.push(i);
				agregarRespuestasRadio(i, xmlDoc, respuestasRadio, valorRespuestaRadio);
				break;
			case "select multiple":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirSelectMultiple(i, xmlDoc);
				preguntasSelectMultiple.push(i);
				agregarRespuestas(i, xmlDoc, respuestasSelectMultiple, valorRespuestasSelectMultiple);
				break;
		}
	}
	imprimirEspacios(3);
	imprimirBotonCorregir();
	imprimirEspacios(2);
}
 
//**********************************************************************************************
//IMPRIMIR TITULOS Y OPCIONES EN EL FORMULARIO 
//**********************************************************************************************
function imprimirTituloPregunta(i, xmlDoc){
	//se le pasa una pregunta del xml y busca su atributo title y lo plasma en un <h3> en el html
	var tituloPregunta = document.createElement("h3");
	tituloPregunta.innerHTML=xmlDoc.getElementsByTagName("title")[i].innerHTML;
	document.getElementById('pregunta'+i).appendChild(tituloPregunta);
}

function imprimirOpcionesSelect(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var select = document.createElement("select");
	select.id = "select"+i;
	document.getElementById('pregunta'+i).appendChild(select);
	for (j = 0; j < numOpciones; j++) { 
		var option = document.createElement("option");
		option.text = opt[j].innerHTML;
		option.value = j ;
		select.options.add(option);
	}  
}

function imprimirCajaText(numeroCajaTexto, xmlDoc) {
	var cajaTexto = document.createElement("input");
	cajaTexto.type = "number";
	cajaTexto.id = "cajaTexto" + numeroCajaTexto;
	document.getElementById('pregunta'+i).appendChild(cajaTexto);
}


function imprimirCheckBox(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var label = document.createElement("label");
		var input = document.createElement("input");
		label.innerHTML=opt[j].innerHTML;
		input.type="checkbox";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(label);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
	}
}

function imprimirRadioButton(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var input = document.createElement("input");
		var answerTitle = opt[j].innerHTML;
		var span = document.createElement("span");
		span.innerHTML = answerTitle;
		input.type="radio";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(span);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
	}	
}

function imprimirSelectMultiple(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var selectMultiple = document.createElement("select");
	selectMultiple.multiple="true";
	for (j = 0; j < numOpciones; j++) {
		var answerTitle = opt[j].innerHTML;
		var option = document.createElement("option");
		option.innerHTML = answerTitle;
		selectMultiple.appendChild(option);
		}
	document.getElementById('pregunta'+i).appendChild(selectMultiple);
}

function imprimirEspacios(numeroEspacios) {
	for (i=0; i<numeroEspacios; i++) {
		var espacio = document.createElement("br");
		formContainer.appendChild(espacio);
	}
}

function imprimirBotonCorregir() {
	var botonCorregir = document.createElement("input");
	botonCorregir.id = "botonCorregir";
	botonCorregir.type = "submit";
	botonCorregir.value = "Corregir";
	formContainer.appendChild(botonCorregir);
}

//**********************************************************************************************
//CORREGIR LAS PREGUNTAS Y AÑADIR RESULTADOS Y RESPUESTAS CORRECTAS
//**********************************************************************************************
function corregirSelect() {
  for (i = 0; i<preguntasSelect.length; i++) {
  	var sel = document.getElementById("pregunta"+preguntasSelect[i]).getElementsByTagName("select")[0];
  	var respuesta = respuestasSelect[i];
  	if (sel.selectedIndex==respuesta) { 
  		puntos = 1;
  		darRespuestaCorrectaHtml("P" +preguntasSelect[i]+": Correcto", " +"+puntos+" punto");
  		nota += puntos;
  	}
  	else {
  		darRespuestaIncorrectaHtml("P" +preguntasSelect[i]+ ": Incorrecto");
  		darRespuestaHtml("La respuesta correcta es: "+valorRespuestaSelect[i]);
  	}
  	dibujarSeparador('resultadosDiv');
  }
}

function corregirText() {
	for (i = 0; i<preguntasText.length; i++) {
		var input = document.getElementById("pregunta"+preguntasText[i]).getElementsByTagName("input")[0];
		var respuesta = respuestasText[i];
		if (input.value == respuesta){
			puntos = 1;
			darRespuestaCorrectaHtml("P" +preguntasText[i]+": Correcto", " +"+puntos+" punto");
			nota += puntos;
		} 
		else {
			darRespuestaIncorrectaHtml("P" +preguntasText[i] + ": Incorrecto");
			darRespuestaHtml("La respuesta correcta es: "+respuestasText[i]);
		}
		dibujarSeparador('resultadosDiv');
	}
}

function corregirCheckBox(){
	for (i = 0; i<preguntasCheckBox.length; i++) {
		var inputs = document.getElementById("pregunta"+preguntasCheckBox[i]).getElementsByTagName("input");
	 	var bandera = 0; 
	 	var hayFallo = false;
	  	for (j = 0; j < inputs.length; j++){
	  		var encontrado = false;
		  	if (inputs[j].checked) { 
		  		bandera = 1;
		  		for (k = 0; k < respuestasCheckBox[i].length; k++){
		  			if(j == respuestasCheckBox[i][k])	{
		  				puntos = 1.0/respuestasCheckBox[i].length;
		  				nota += puntos;
		  				darRespuestaCorrectaHtml("P"+preguntasCheckBox[i]+" opcion "+j+": correcta", " +"+puntos.toFixed(2)+" puntos");
		  				encontrado = true;
		  				break;
		  			} 
		  		}
		  		if (!encontrado){
		  			hayFallo = true;
		  			puntos = 1.0/respuestasCheckBox[i].length;
		  			nota -= puntos;
		  			darRespuestaIncorrectaHtml("P"+preguntasCheckBox[i]+" opcion "+j+": incorrecta", " -"+puntos.toFixed(2)+" puntos");
		  		}
		  	}	
	  	}
	  	if (hayFallo) {
	  		if (valorRespuestasCheckBox[i].length == 1){
	  			darRespuestaHtml("La respuesta correcta es: " + valorRespuestasCheckBox[i]);
	  		} else{
	  			darRespuestaHtml("Las respuestas correctas son: " + valorRespuestasCheckBox[i].join(', '));
	  		}
	  	}
	  	if (bandera == 0){
			darRespuestaHtml("P"+preguntasCheckBox[i]+": No has marcado ninguna respuesta");
		}
		dibujarSeparador('resultadosDiv');
	}
}

function corregirRadio() {
	for (i = 0; i<preguntasRadio.length; i++) {
		var preguntaRadio = document.getElementById('pregunta'+preguntasRadio[i]);
		var bandera = 0;
		for (j = 0; j<preguntaRadio.getElementsByTagName('input').length; j++) {
			if (preguntaRadio.getElementsByTagName('input')[j].checked){
				bandera = 1;
				if (j == respuestasRadio[i]){
					puntos = 1;
					nota += puntos;
		    		darRespuestaCorrectaHtml("P"+preguntasRadio[i]+" opcion "+j+": correcta", " +"+puntos+" punto");	
				} else{
					puntos = 1;
					nota -= puntos;
					darRespuestaIncorrectaHtml("P"+preguntasRadio[i]+" opcion "+j+": incorrecta", " -"+puntos+" punto");
					darRespuestaHtml("La respuesta correcta es: "+valorRespuestaRadio[i]);
				}	
			} 				
		}
		if (bandera == 0){
			darRespuestaHtml("P"+preguntasRadio[i]+": No has marcado ninguna respuesta");
		}
		dibujarSeparador('resultadosDiv');
	}
}

function corregirSelectMultiple() {
	for (i = 0; i<preguntasSelectMultiple.length; i++) {
	  	var sel = document.getElementById("pregunta"+preguntasSelectMultiple[i]).getElementsByTagName("select")[0];
	  	var bandera = 0;
	  	var hayFallo = false; 
	  	for (j = 0; j < sel.length; j++){
	  		var encontrado = false;
		  	if (sel[j].selected) { 
		  		bandera = 1;
		  		for (k = 0; k < respuestasSelectMultiple[i].length; k++){
		  			if(j == respuestasSelectMultiple[i][k])	{
		  				puntos = 1.0/respuestasSelectMultiple[i].length;
		  				nota += puntos;
		  				darRespuestaCorrectaHtml("P"+preguntasSelectMultiple[i]+" opcion "+j+": correcta", " +"+puntos.toFixed(2)+" puntos");
		  				encontrado = true;
		  				break;
		  			} 
		  		}
		  		if (!encontrado){
		  			hayFallo = true;
		  			puntos = 1.0/respuestasSelectMultiple[i].length;
		  			nota -= puntos;
		  			darRespuestaIncorrectaHtml("P"+preguntasSelectMultiple[i]+" opcion "+j+": incorrecta", " -"+puntos.toFixed(2)+" puntos");
		  		}
		  	}	
	  	}
	  	if (hayFallo) {
	  		if (valorRespuestasSelectMultiple[i].length == 1){
	  			darRespuestaHtml("La respuesta correcta es: " + valorRespuestasSelectMultiple[i]);
	  		} else{
	  			darRespuestaHtml("Las respuestas correctas son: " + valorRespuestasSelectMultiple[i].join(', '));
	  		}
	  	}
	  	if (bandera == 0){
			darRespuestaHtml("P"+preguntasSelectMultiple[i]+": No has marcado ninguna respuesta");
		}
		dibujarSeparador('resultadosDiv');
	}
}

//**********************************************************************************************
//UTILIDADES Y AUXILIARES
//**********************************************************************************************
function agregarRespuestas(i, xmlDoc, arrayRespuestas, arrayValoresRespuestas) {
	var respuestasPregunta = [];
	var valorRespuestasPregunta = [];
	for (j = 0; j < xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer").length; j++) {
		respuestasPregunta.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML));
	}
	for (j = 0; j < respuestasPregunta.length; j++){
		valorRespuestasPregunta.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[respuestasPregunta[j]].innerHTML);
	}
	arrayRespuestas.push(respuestasPregunta);
	arrayValoresRespuestas.push(valorRespuestasPregunta);
}

function agregarRespuestasRadio(i, xmlDoc, arrayRespuestas, arrayValoresRespuestas) {
	arrayRespuestas.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
	arrayValoresRespuestas.push(xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option')[arrayRespuestas[arrayRespuestas.length - 1]].innerHTML);
}

function crearDivPregunta(i) {
	var div = document.createElement('div');
	div.id = "pregunta"+i;
	formContainer.appendChild(div);
}

function inicializar(){
	document.getElementById('resultadosDiv').innerHTML = "";
	nota=0.0;
}

function agregarIconoCorreccion(valoracion) {
	if (valoracion=="v") {
		var icon = document.createElement("img");
		icon.src="img/correcto.png";
		document.getElementById('resultadosDiv').appendChild(icon);
	} else {
		var icon = document.createElement("img");
		icon.src="img/incorrecto.png";
		document.getElementById('resultadosDiv').appendChild(icon);
	}
}

function darRespuestaHtml(r){
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);
	var br = document.createElement("br");
	document.getElementById('resultadosDiv').appendChild(p);
	document.getElementById('resultadosDiv').appendChild(br);
}

function darRespuestaCorrectaHtml(r, puntuacion) {
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);

	var puntos = document.createElement("span");
	var puntosNode = document.createTextNode(puntuacion);
	puntos.appendChild(puntosNode);
	puntos.className = "correcto";

	var icon = document.createElement("img");
	icon.src = "img/correcto.png";

	var br = document.createElement("br");

	document.getElementById('resultadosDiv').appendChild(p);
	document.getElementById('resultadosDiv').appendChild(icon);
	document.getElementById('resultadosDiv').appendChild(puntos);
	document.getElementById('resultadosDiv').appendChild(br);
}

function darRespuestaIncorrectaHtml(r, puntuacion){
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);

	var puntos = document.createElement("span");
	var puntosNode = document.createTextNode(puntuacion);
	puntos.appendChild(puntosNode);
	puntos.className = "incorrecto";

	var icon = document.createElement("img");
	icon.src = "img/incorrecto.png";

	var br = document.createElement("br");

	document.getElementById('resultadosDiv').appendChild(p);
	document.getElementById('resultadosDiv').appendChild(icon);
	if (puntuacion != null) {
		document.getElementById('resultadosDiv').appendChild(puntos);
	}
	document.getElementById('resultadosDiv').appendChild(br);
}

function presentarNota(){
	var p = document.createElement("span");
	var node = document.createTextNode("");
	p.appendChild(node);
	p.id = "nota";
	var br = document.createElement("br");
	document.getElementById('resultadosDiv').appendChild(p);
	document.getElementById('resultadosDiv').appendChild(br);
}

function actualizarNota() {
	document.getElementById("nota").textContent="Tu nota es: "+nota.toFixed(2)+" puntos sobre 10";
	if (nota >=5) {
		document.getElementById("nota").style.color = "#d73e31";
	}
}

function dibujarSeparador(divName) {
	var p = document.createElement("p");
	p.className = "separador";
	document.getElementById(divName).appendChild(p);
}

//funcion para hacer que el select multiple se pueda aplicar sin la tecla Ctrl
window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

function comprobar(){
	for (i = 0; i < preguntasText.length; i++){
		var input = document.getElementById("pregunta"+preguntasText[i]).getElementsByTagName("input")[0];
		if (input.value=="") {
			input.focus();
			alert("Escribe solo numeros para responder "+preguntasText[i]);
			return false;
		}
	}
	return true;
}

/*
// POSIBLES REFACTORIZACIONES FUTURAS
//
// Convertir todos los arrays en un diccionario
// Añadir cronometro para el examen
*/