const mongoose = require("mongoose");
const { productsModel } = require("./src/dao/models/productsModel.js");
const { cartsModel } = require("./src/dao/models/cartsModel.js");

const seed = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://cursobackend1:cursobackend1@cluster0.fpstjym.mongodb.net/?appName=Cluster0",
      { dbName: "proyectobackend1" }
    );

    console.log("Conexion a MongoDB establecida.");

    const countProducts = await productsModel.countDocuments();

    if (countProducts === 0) {
      await productsModel.insertMany([
        {
          title: "Curauña",
          description: "Preparado liquido de uso externo formulado para tratar hongos en las unas",
          code: "CUR001",
          price: 20000,
          status: true,
          stock: 5,
          category: "preparados",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/product2_wrye1g.webp"
          ]
        },
        {
          title: "Ortesis Polidigital",
          description: "Gel Polimero",
          code: "ORT001",
          price: 5000,
          status: true,
          stock: 4,
          category: "ortopedia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163053/product3_xna4nj.webp"
          ]
        },
        {
          title: "Pasem Freshar",
          description: "Crema hidratante para pies secos, con karite y urea",
          code: "PAS001",
          price: 7000,
          status: true,
          stock: 6,
          category: "cremas",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163056/product6_ae0pak.webp"
          ]
        },
        {
          title: "Crema para pies",
          description: "Crema hidratante intensiva",
          code: "CRE001",
          price: 4500,
          status: true,
          stock: 20,
          category: "cremas",
          thumbnails: [
            "https://upload.wikimedia.org/wikipedia/commons/6/6b/Feet_cream.jpg"
          ]
        },
        {
          title: "Plantilla Ortopedica ConfortGel",
          description: "Plantilla de gel disenada para aliviar la presion y mejorar la postura al caminar",
          code: "PLA001",
          price: 8700,
          status: true,
          stock: 18,
          category: "ortopedia",
          thumbnails: [
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Shoe_insole_gel.jpg"
          ]
        },
        {
          title: "Talco Podologico Antibacteriano 3",
          description: "Talco desodorante con oxido de zinc y acido borico, ideal para mantener los pies secos y prevenir hongos",
          code: "TALC003",
          price: 12400,
          status: true,
          stock: 30,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/talco_podologico_antibacteriano.webp"
          ]
        },
        {
          title: "Talco Podologico Antibacteriano 4",
          description: "Talco desodorante con oxido de zinc y acido borico, ideal para mantener los pies secos y prevenir hongos",
          code: "TALC004",
          price: 12400,
          status: true,
          stock: 30,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/talco_podologico_antibacteriano.webp"
          ]
        },
        {
          title: "Talco Podologico Antibacteriano 2000",
          description: "Talco desodorante con oxido de zinc y acido borico, ideal para mantener los pies secos y prevenir hongos",
          code: "TALC2000",
          price: 12400,
          status: true,
          stock: 30,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/talco_podologico_antibacteriano.webp"
          ]
        },
        {
          title: "Talco Podologico Antibacteriano 3000",
          description: "Talco desodorante con oxido de zinc y acido borico, ideal para mantener los pies secos y prevenir hongos",
          code: "TALC3000",
          price: 12400,
          status: true,
          stock: 30,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/talco_podologico_antibacteriano.webp"
          ]
        },
        {
          title: "Talco Podologico Antibacteriano 4000",
          description: "Talco desodorante con oxido de zinc y acido borico, ideal para mantener los pies secos y prevenir hongos",
          code: "TALC4000",
          price: 12400,
          status: true,
          stock: 30,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/talco_podologico_antibacteriano.webp"
          ]
        },
        {
          title: "Spray Refrescante para Pies",
          description: "Spray con mentol y eucalipto que refresca, desodoriza y alivia la fatiga de los pies luego de largas jornadas",
          code: "SPRAY009",
          price: 16300,
          status: true,
          stock: 28,
          category: "podologia",
          thumbnails: [
            "https://res.cloudinary.com/drzhqvhh9/image/upload/v1754163052/spray_refrescante_pies.webp"
          ]
        }
      ]);

      console.log("Productos iniciales cargados.");
    } else {
      console.log("La coleccion de productos ya contiene datos.");
    }

    const countCarts = await cartsModel.countDocuments();
    if (countCarts === 0) {
      await cartsModel.insertMany([
        { products: [] },
        { products: [] }
      ]);
      console.log("Carritos iniciales cargados.");
    } else {
      console.log("La coleccion de carritos ya contiene datos.");
    }

    await mongoose.disconnect();
    console.log("Proceso de seed finalizado y conexion cerrada.");
  } catch (error) {
    console.error("Error durante el proceso de seed:", error);
  }
};

seed();
