const d = document,
  $table = d.querySelector(".table"),
  $form = d.querySelector(".main-form"),
  $title = d.querySelector(".title-container"),
  $template = d.getElementById("form-template").content,
  $fragment = d.createDocumentFragment();

  axios.get("http://localhost:3000/equipos")

  .then((res) => {
  console.log(res)
    let JSONdata = res.data;
  console.log(JSONdata);
    JSONdata.forEach(element => {
      $template.querySelector(".equipoTemplate").textContent = element.equipo;
      $template.querySelector(".coloresTemplate").textContent = element.colores;
      $template.querySelector(".fundacionTemplate").textContent = element.fundacion;
      $template.querySelector(".origenTemplate").textContent = element.origen;
      $template.querySelector(".edit").dataset.id = element.id;
      $template.querySelector(".edit").dataset.equipoTemplate = element.equipo;
      $template.querySelector(".edit").dataset.coloresTemplate = element.colores;
      $template.querySelector(".edit").dataset.fundacionTemplate = element.fundacion;
      $template.querySelector(".edit").dataset.origenTemplate = element.origen;
      $template.querySelector(".delete").dataset.id = element.id;
  
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
    })  
  
  .catch((err)=>{
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    })  
  
  .finally()



    d.addEventListener("submit", async (e) => {
    if (e.target === $form) {
        e.preventDefault();

    if (!e.target.id.value) {
      //en caso de que el campo id esté vacio (es decir aún no está incluído el elemento que queremos crear en la base de datos)
      //con el método POST logramos incluir el elemento en la base de dato.
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              equipo: e.target.equipo.value,
              colores: e.target.colores.value,
              fundacion: e.target.fundacion.value,
              origen: e.target.origen.value,
            }),
          },
        res = await axios("http://localhost:3000/equipos", options);
        json = await res.data;

      location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
      }
    } else {
      //PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              equipo: e.target.equipo.value,
              colores: e.target.colores.value,
              fundacion: e.target.fundacion.value,
              origen: e.target.origen.value,
            }),
          },
        res = await axios(`http://localhost:3000/equipos/${e.target.id.value}`,options);
        json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
      }
    }
  }
});

     d.addEventListener("click", async e => {
      if(e.target.matches(".edit")) {
         $title.textContent = "Editar info de los equipos";
         $form.equipo.value = e.target.dataset.equipoTemplate;
         $form.colores.value = e.target.dataset.coloresTemplate;
         $form.fundacion.value = e.target.dataset.fundacionTemplate;
         $form.origen.value = e.target.dataset.origenTemplate;
         $form.id.value = e.target.dataset.id;
          }

  if(e.target.matches(".delete")) {
    let isDelete = confirm(`¿Estás seguro de eliminar este club con id ${e.target.dataset.id} de la lista ?`);
    if (isDelete) {
      //Estructura para eliminar el elemento según el id del elemento
      try {
        let options = {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          res = await axios(`http://localhost:3000/equipos/${e.target.dataset.id}`,options);
          json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
      }
    }
  }
});


