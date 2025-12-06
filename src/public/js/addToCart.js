document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btn-add")) return;
  const pid = e.target.getAttribute("data-pid");

  let cid = localStorage.getItem("cid") || "";
  const input = prompt("ingresa el id del carrito:", cid);
  if (!input) return;
  cid = input.trim();
  localStorage.setItem("cid", cid);

  try {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 })
    });
    const data = await res.json();
    if (!res.ok || data.status === "error") {
      alert("no se pudo agregar: " + (data.message || res.status));
      return;
    }
    alert("agregado al carrito " + cid);
  } catch (err) {
    alert("error: " + err.message);
  }
});

