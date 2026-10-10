function cover(bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640"><rect width="960" height="640" fill="${bg}"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const SEED = {
  sections: [
    {
      id: "identidad",
      name: "Identidad",
      blurb: "Lo que la marca dice de sí misma.",
    },
    {
      id: "proceso",
      name: "Proceso",
      blurb: "Cómo se arma un sistema que parece suelto.",
    },
    {
      id: "piezas",
      name: "Piezas",
      blurb: "Objetos, merch y aplicaciones.",
    },
    {
      id: "notas",
      name: "Notas",
      blurb: "Mirada fotográfica y registros cortos.",
    },
  ],
  posts: [
    {
      id: "adn",
      sectionId: "identidad",
      title: "En nuestro *desorden* nos entendemos",
      excerpt: "El ADN de ZigZag no pide calma. Pide un lugar donde el ruido tenga forma.",
      body: "ZigZag nace de una idea simple: la dispersión es el punto de partida, no un defecto a tapar.\n\nLa marca habla cerca. Mezcla un rojo que ocupa espacio con un ámbar que funciona como señal. El negro y el papel claro ordenan lo demás.\n\nEl resultado tiene que sentirse juvenil, con humor y reconocible aunque la pieza esté torcida.",
      image: cover("#E6E6E6"),
      date: "2026-09-12",
    },
    {
      id: "tagline",
      sectionId: "identidad",
      title: "De la *dispersión* nace nuestro *método*",
      excerpt: "La frase de marca resume el recorrido: primero el salto, después la secuencia.",
      body: "El tagline no promete orden. Promete un método que aparece en el medio del movimiento.\n\nPor eso una palabra puntual va en Avallon, y el resto se lee en Barlow regular o bold. Una destaca, la otra explica.\n\nZigZag puede cambiar de pieza —una nota, una remera, una foto— y seguir diciendo lo mismo.",
      image: cover("#1A1A1A"),
      date: "2026-09-18",
    },
    {
      id: "sistema",
      sectionId: "proceso",
      title: "Un sistema que parece armado a mano",
      excerpt: "Bloques corridos, márgenes irregulares y una grilla que igual se sostiene.",
      body: "Las piezas usan rectángulos rojos y ámbar como si alguien los hubiera apoyado encima de la foto.\n\nEse gesto es el sistema: intervenir, marcar, dejar ver el soporte. La composición puede estar inclinada, pero los colores y la tipografía no se negocian.\n\nCuando una publicación nueva entra al estudio, hereda esa lógica sin copiar un molde rígido.",
      image: cover("#DD2748"),
      date: "2026-09-28",
    },
    {
      id: "tramas",
      sectionId: "proceso",
      title: "Tramas para llenar el silencio",
      excerpt: "Puntos, manchas y cuadrados. Tres formas de ocupar un fondo sin ilustrar de más.",
      body: "La marca tiene cuatro tramas de reserva: una de puntos que se densifica, una de puntos parejos, una de manchas orgánicas y una de módulos rectos.\n\nSirven cuando la foto no alcanza o cuando el objeto necesita fondo. No compiten con el isotipo.\n\nEn la web aparecen como textura de papel y como acento, en dosis corta.",
      image: cover("#F06A80"),
      date: "2026-10-02",
    },
    {
      id: "merch",
      sectionId: "piezas",
      title: "El *merch* que nos *identifica*",
      excerpt: "Cinco objetos genéricos con frases de la marca. Alcanza para entender el tono.",
      body: "La remera, el cuaderno, la gorra, la botella y el tote dicen lo mismo con distinta superficie.\n\nSi parece un desastre, vamos bien. Ideas tengo, orden no tanto. No está perdido, está acá adentro.\n\nSon piezas de la marca: el objeto lleva la frase y el color, y se reconoce sin explicación.",
      image: cover("#FBB021"),
      date: "2026-10-06",
    },
    {
      id: "foto",
      sectionId: "notas",
      title: "Espontánea, digital y memeable",
      excerpt: "La foto de ZigZag parece tomada en el momento y después intervenida con la marca.",
      body: "El tratamiento fotográfico mezcla tres modos: la foto espontánea, la intervención con bloques de color y una estética digital que puede ser un meme.\n\nLas personas están en grupo, riendo, en un super, con el celular. Nada de campaña distante.\n\nUna publicación del estudio puede subir esa foto desde el panel y quedar en su sección.",
      image: cover("#A61E35"),
      date: "2026-10-09",
    },
  ],
};
