const socket=io();

const divProductos=document.getElementById("productos");


socket.on("listaProductos", (productos) => {

  const ul = document.createElement("ul");

  productos.forEach((p) => {

    const li = document.createElement("li");

    li.innerHTML = `<strong>${p.id}</strong> - ${p.title}`;

    ul.appendChild(li);

  });

 
  divProductos.innerHTML = "";

  divProductos.appendChild(ul);

});
