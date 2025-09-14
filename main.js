const baseURL = "https://68bf72859c70953d96ef9468.mockapi.io/autos"; 
const form = document.getElementById("auto-form");
const autosContainer = document.getElementById("autos-container");

function obtenerAutos() {
    axios.get(baseURL)
        .then(res => {
            autosContainer.innerHTML = ""; 
            res.data.forEach(auto => {
                autosContainer.innerHTML += `
                    <div class="auto-card">
                        <h3>${auto.marca} ${auto.modelo}</h3>
                        <p><strong>Año:</strong> ${auto.anio}</p>
                        <p><strong>Precio:</strong> $${auto.precio}</p>
                        <p><strong>Color:</strong> ${auto.color}</p>
                        <button onclick="editarAuto(${auto.id})" class="editar">Editar</button>
                        <button onclick="eliminarAuto(${auto.id})" class="eliminar">Eliminar</button>
                    </div>
                `;
            });
        })
        .catch(err => console.error(err));
}

//Eliminar auto
function eliminarAuto(id) {
    axios.delete(`${baseURL}/${id}`)
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Auto eliminado",
                timer: 1500,
                showConfirmButton: false
            });
            obtenerAutos();
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el auto"
            });
        });
}

// Editar auto, cargar datos en el formulario
function editarAuto(id) {
    axios.get(`${baseURL}/${id}`)
        .then(res => {
            const auto = res.data;
            document.getElementById("auto-id").value = auto.id;
            document.getElementById("marca").value = auto.marca;
            document.getElementById("modelo").value = auto.modelo;
            document.getElementById("anio").value = auto.anio;
            document.getElementById("precio").value = auto.precio;
            document.getElementById("color").value = auto.color;

            document.getElementById("cancelar-edicion").classList.remove("hidden");
        })
        .catch(err => console.error(err));
}

//Guardar auto
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("auto-id").value;
    const auto = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        anio: document.getElementById("anio").value,
        precio: document.getElementById("precio").value,
        color: document.getElementById("color").value
    };

    if (id) {
        axios.put(`${baseURL}/${id}`, auto)
            .then(() => {
                Swal.fire({ icon: "success", title: "Auto actualizado", timer: 1500, showConfirmButton: false });
                form.reset();
                document.getElementById("auto-id").value = "";
                document.getElementById("cancelar-edicion").classList.add("hidden");
                obtenerAutos();
            })
            .catch(err => console.error(err));
    } else {
        axios.post(baseURL, auto)
            .then(() => {
                Swal.fire({ icon: "success", title: "Auto agregado", timer: 1500, showConfirmButton: false });
                form.reset();
                obtenerAutos();
            })
            .catch(err => console.error(err));
    }
});


document.getElementById("cancelar-edicion").addEventListener("click", () => {
    form.reset();
    document.getElementById("auto-id").value = "";
    document.getElementById("cancelar-edicion").classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", obtenerAutos);
