// esBeginner.ts
import { pack, wordsFromText } from "@/data/content/types";
import { numbersBeginner } from "@/data/shared/numbers";

export const esBeginner = pack({
  words: wordsFromText(
    "ritmo enfoque teclado progreso calma control practica lectura palabra linea manos clara estable corto diario preciso repetir meta pausa simple limpio rapido suave base pulso confianza guia avance orden medir inicio ayuda tiempo mejora rutina memoria estudio escribir preciso forma gesto reflejo practica diaria control visual lectura fluida escritura simple ritmo estable enfoque claro manos relajadas palabra facil linea limpia progreso constante practica guiada lectura clara escritura segura control basico avance lento mejora continua rutina simple repeticion controlada memoria muscular escritura fluida practica constante enfoque activo lectura estable escritura limpia progreso medido calma mental control preciso ritmo constante repeticion diaria avance seguro aprendizaje simple control continuo escritura basica lectura sencilla progreso claro practica estructurada memoria activa ritmo natural control consciente"
  ),

  sentences: [
    "Una sesion tranquila ayuda a mantener la precision mientras sube la velocidad.",
    "La linea estable hace que los ojos sigan el texto con menos esfuerzo.",
    "Practicar un poco cada dia suele dar mejores resultados que correr una sola vez.",
    "La confianza mejora cuando el texto es claro y la interfaz no distrae.",
    "Un buen habito empieza con lectura limpia y pulsaciones seguras.",
    "Primero llega la exactitud y luego aparece la velocidad.",
    "Un ritmo claro ayuda a que las manos se muevan con menos tension.",
    "La practica simple y repetida crea una base mas fuerte.",

    "Leer con calma permite escribir con mayor precision.",
    "Las manos trabajan mejor cuando el ritmo es constante.",
    "Una practica corta pero diaria crea mejores resultados.",
    "El enfoque claro reduce errores durante la escritura.",
    "Un texto limpio ayuda a mantener la atencion.",
    "La repeticion mejora el control del teclado.",
    "El progreso aparece con practica constante.",
    "La escritura mejora con cada intento.",

    "Un ambiente tranquilo ayuda a concentrarse mejor.",
    "La lectura clara hace que escribir sea mas facil.",
    "El control mejora con practica diaria.",
    "La velocidad llega con el tiempo.",
    "Un inicio lento ayuda a evitar errores.",
    "La confianza crece con cada sesion.",
    "La practica guiada facilita el aprendizaje.",
    "El ritmo estable reduce la tension.",

    "Las manos se adaptan con la repeticion.",
    "Un objetivo claro ayuda a mejorar.",
    "El progreso constante mantiene la motivacion.",
    "La practica simple crea buenos habitos.",
    "La escritura fluida llega con el tiempo.",
    "El control basico es importante al inicio.",
    "La lectura ayuda a anticipar palabras.",
    "La precision mejora la velocidad.",

    "Un buen ritmo evita errores innecesarios.",
    "La calma ayuda a mantener el control.",
    "La practica constante mejora la memoria muscular.",
    "El avance diario construye confianza.",
    "La escritura clara es mas facil de mantener.",
    "El enfoque reduce distracciones.",
    "La practica regular mejora el resultado.",
    "El aprendizaje es progresivo.",

    "Un texto sencillo ayuda a empezar mejor.",
    "La repeticion hace el movimiento natural.",
    "El progreso se nota con el tiempo.",
    "La practica diaria fortalece habilidades.",
    "La lectura estable mejora la escritura.",
    "El control aumenta con experiencia.",
    "La confianza crece poco a poco.",
    "El ritmo constante mejora la precision."
  ],

  quotes: [
    "La constancia vale mas que una carrera desordenada.",
    "Escribir mejor empieza por repetir con calma.",
    "La precision crea la velocidad que luego parece facil.",
    "Una interfaz tranquila ayuda a practicar con confianza.",
    "Pequenos pasos crean grandes mejoras.",
    "La practica diaria hace la diferencia.",
    "La calma mejora el control.",
    "La repeticion construye habilidad.",
    "El progreso es resultado de la constancia.",
    "La lectura clara facilita la escritura.",
    "La practica sencilla es poderosa.",
    "El ritmo estable mejora el resultado.",
    "La confianza nace de la repeticion.",
    "La precision es la base de todo.",
    "El enfoque mejora el aprendizaje.",
    "La practica constante crea habitos."
  ],

  punctuation: [
    "Calma, lectura, control. Escribe, revisa y repite.",
    "Respira; corrige; sigue. El ritmo mejora con orden.",
    "Texto claro, practica limpia, avance constante.",
    "Lee bien, escribe mejor, vuelve a empezar.",
    "Calma, ritmo, control. Practica y mejora.",
    "Lee, escribe, repite. Mejora constante.",
    "Ritmo, precision, avance. Sigue practicando.",
    "Control, enfoque, mejora. Paso a paso.",
    "Lee claro; escribe limpio; repite seguro.",
    "Practica diaria, mejora visible, resultado estable.",
    "Calma mental, manos firmes, escritura clara.",
    "Repite, mejora, avanza. Siempre constante.",
    "Texto limpio, mente clara, mejor resultado.",
    "Practica simple, progreso seguro, confianza.",
    "Lee bien, escribe mejor, repite siempre.",
    "Controla el ritmo; mejora la precision."
  ],

  numbers: numbersBeginner,

  code: [
    "const pasos = sesiones.length;",
    "if (precision > 95) return 'listo';",
    "let ritmo = palabras / minutos;",
    "const modo = actual === 'time';",

    "const total = sesiones.reduce((a, b) => a + b, 0);",
    "if (ritmo > 40) avanzar();",
    "const errores = lista.filter((e) => e > 0);",
    "return historial.length;",

    "const promedio = total / sesiones.length;",
    "if (promedio > 50) nivel++;",
    "const datos = sesiones.map((s) => s.velocidad);",
    "return datos.slice(-5);",

    "const activo = modo === 'practice';",
    "if (activo) iniciar();",
    "const valor = calcular(ritmo, precision);",
    "return valor;",

    "const listaNueva = datos.filter((d) => d > 0);",
    "if (listaNueva.length > 3) continuar();",
    "const maximo = Math.max(...datos);",
    "return maximo;",

    "const estado = precision > 90 ? 'bien' : 'mejorar';",
    "if (estado === 'bien') siguiente();"
  ]
});