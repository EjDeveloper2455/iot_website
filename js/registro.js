
const formulario = document.getElementById('myForm');

formulario.addEventListener('submit', function (event) {
  event.preventDefault();
  const anio = document.getElementById('anio').value;
  const graduados = document.getElementById('graduados').value;
  const retirados = document.getElementById('retirados').value;
  const matriculados = document.getElementById('matriculados').value;

  const campus = document.getElementById('campus').value;
  const carrera = document.getElementById('carrera').value;
  const periodo = document.getElementById('periodo').value;
  const datos = {
    'anio': anio,
    'campus': campus,
    'carrera': carrera,
    'periodo': periodo,
    'matriculados': matriculados,
    'retirados': retirados,
    'graduados': graduados,
    'id': -1
  }
  verificar(datos);
  //guardar(JSON.stringify(datos));
});

const verificar = (datos) => {
  const url = 'http://127.0.0.1:8080/verificar/';

  const postData = {
    "campus": datos.campus,
    "carrera": datos.carrera,
    "anio": datos.anio,
    "periodo": datos.periodo,
  };

  console.log(postData);

  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  };

  fetch(url, fetchConfig)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error de red - Código: ${response.status}`);
      }

      return response.text();
    })
    .then(data => {
      if (data !== "-1") {
        var resultado = window.confirm("Ya existe un registro con estos datos ¿Deseas remplazar los valores?");

        if (resultado) {
          datos.id = data;
          guardar(JSON.stringify(datos));
        } else {
          alert("Acción cancelada");
        }
      }else{
        guardar(JSON.stringify(datos));
      }
    })
    .catch(error => {
      console.error('Error en la solicitud Fetch:', error.message);
    });
}

const guardar = (datos) => {
  const url = 'http://34.125.241.7:8080/mqtt/';

  const postData = {
    "topic": 'IOTPF',
    "payload": datos,
  };

  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  };

  fetch(url, fetchConfig)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error de red - Código: ${response.status}`);
      }

      return response.text();
    })
    .then(data => {
      alert('Se ha guardados correctamente');
      for (let i = 0; i < formulario.elements.length; i++) {
        if (formulario.elements[i].type == "number") {
          formulario.elements[i].value = "";
        }
        if (formulario.elements[i].type !== "number" && formulario.elements[i].type !== "button") {
          formulario.elements[i].value = "1";
        }
      }
    })
    .catch(error => {
      console.error('Error en la solicitud Fetch:', error.message);
    });
};