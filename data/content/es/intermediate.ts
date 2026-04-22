// esIntermediate.ts
import { pack, wordsFromText } from "@/data/content/types";
import { numbersIntermediate } from "@/data/shared/numbers";

export const esIntermediate = pack({
  words: wordsFromText(
    "disciplina medicion agilidad seguimiento claridad respuesta consistencia objetivo impulso patron visual recuperacion teclado soporte controlable confianza usuario historial sesion analisis postura indicador mejora duradera entrenamiento comparacion enfoque realista retroalimentacion recorrido practica guiada ritmo constante retencion progreso fiable estabilidad control ritmo lectura escritura precision equilibrio mejora continua evaluacion resultado repeticion adaptacion sistema flujo eficiencia enfoque activo respuesta rapida control preciso observacion detallada rendimiento sostenido ajuste gradual estructura clara progreso medible experiencia fluida repeticion estable analisis continuo mejora constante entrenamiento regular adaptacion progresiva control dinamico equilibrio mental ritmo sostenido practica estructurada rendimiento estable flujo continuo mejora gradual control consciente enfoque sostenido observacion constante precision mantenida resultado confiable aprendizaje continuo"
  ),

  sentences: [
    "Cuando el texto no cambia de forma brusca, el ritmo de escritura se siente mucho mas natural.",
    "La practica intermedia necesita variedad suficiente para que cada sesion siga pareciendo util y humana.",
    "Un buen producto muestra el resultado al instante para que el usuario sepa que termino de verdad.",
    "La mejora se vuelve motivadora cuando las metricas parecen honestas y el reinicio es inmediato.",
    "Un carril de lectura limpio ayuda a sostener sesiones mas largas sin fatiga innecesaria.",
    "Los usuarios vuelven cuando la experiencia combina orden, velocidad y confianza.",
    "Una buena herramienta permite repetir sin sentir que todo el proceso empieza de cero.",
    "El contenido variado evita que la practica se vuelva mecanica demasiado pronto.",

    "El ritmo constante permite que los errores disminuyan de forma natural con el tiempo.",
    "Una interfaz clara ayuda a que el usuario mantenga la concentracion durante toda la sesion.",
    "El progreso real aparece cuando la practica se vuelve regular y estructurada.",
    "Un sistema confiable mantiene la motivacion incluso en sesiones largas.",
    "La lectura estable permite anticipar mejor cada palabra durante la escritura.",
    "Cuando la retroalimentacion es inmediata, el aprendizaje se vuelve mas efectivo.",
    "El equilibrio entre velocidad y precision es clave en niveles intermedios.",
    "La repeticion consciente ayuda a consolidar los movimientos del teclado.",

    "Un buen flujo de trabajo evita interrupciones innecesarias durante la practica.",
    "El usuario mejora mas rapido cuando entiende sus errores con claridad.",
    "Una practica guiada permite avanzar sin perder el enfoque.",
    "El analisis de resultados ayuda a tomar decisiones mas precisas.",
    "La consistencia diaria genera una mejora sostenida en el tiempo.",
    "Un entorno limpio facilita la concentracion prolongada.",
    "La claridad visual reduce el esfuerzo cognitivo del usuario.",
    "El entrenamiento progresivo permite enfrentar textos mas complejos.",

    "La estabilidad en la lectura fortalece la confianza al escribir.",
    "Una experiencia fluida hace que el usuario quiera repetir la sesion.",
    "El control del ritmo ayuda a mantener la precision en textos largos.",
    "La mejora constante depende de una practica equilibrada.",
    "El seguimiento de metricas permite observar avances reales.",
    "La adaptacion gradual evita la frustracion durante el aprendizaje.",
    "El enfoque activo mejora la retencion de habilidades.",
    "El control consciente reduce errores repetitivos.",

    "Una estructura clara facilita la comprension del ejercicio.",
    "El rendimiento estable es resultado de practica disciplinada.",
    "La observacion detallada mejora la calidad del entrenamiento.",
    "El ajuste continuo permite mantener el progreso activo.",
    "La experiencia mejora cuando el sistema es predecible.",
    "El usuario se adapta mejor cuando el cambio es gradual.",
    "La precision mantenida refuerza la confianza.",
    "El aprendizaje continuo construye una base solida.",

    "El flujo constante reduce la necesidad de correcciones.",
    "El progreso medible mantiene la motivacion alta.",
    "La practica estructurada mejora el rendimiento general.",
    "El equilibrio mental influye en la calidad del resultado.",
    "La lectura anticipada mejora la velocidad de escritura.",
    "El sistema debe responder sin retrasos para ser efectivo.",
    "La mejora gradual es mas estable que los avances bruscos.",
    "La repeticion estable fortalece la memoria muscular."
  ],

  quotes: [
    "La velocidad nace mejor cuando la lectura mantiene un ritmo claro.",
    "Un buen entrenamiento debe sentirse directo, limpio y confiable.",
    "Cada repeticion tranquila construye una mejora que luego se nota.",
    "La practica estable vuelve mas fiable la velocidad.",
    "La consistencia es mas importante que la intensidad ocasional.",
    "Un sistema claro genera confianza en el usuario.",
    "El progreso real se construye paso a paso.",
    "La precision es la base de la velocidad sostenible.",
    "El control es clave para mejorar con estabilidad.",
    "La practica guiada acelera el aprendizaje.",
    "La repeticion consciente crea habitos duraderos.",
    "La claridad reduce el esfuerzo innecesario.",
    "El ritmo estable mejora el rendimiento.",
    "La confianza crece con resultados fiables.",
    "El enfoque constante genera mejores resultados.",
    "El aprendizaje continuo fortalece la habilidad."
  ],

  punctuation: [
    "Texto estable, metricas honestas, reinicio rapido: asi se construye confianza.",
    "Lee bien; escribe mejor; termina claro. Esa secuencia motiva a repetir.",
    "Control, claridad y constancia forman una practica util.",
    "Ritmo, lectura y medida: una buena base para avanzar.",
    "Practica, analiza, mejora: ese es el ciclo correcto.",
    "Lee con calma; escribe con precision; revisa con atencion.",
    "Ritmo constante, mente clara, resultado fiable.",
    "Observa errores; corrige; repite; mejora.",
    "Claridad, control y enfoque: pilares del progreso.",
    "Practica diaria, mejora continua, resultado visible.",
    "Equilibrio, precision, velocidad: todo cuenta.",
    "Analiza, ajusta, repite: asi se mejora.",
    "Lectura clara, escritura fluida, resultado estable.",
    "Controla el ritmo; mantén la precision; avanza.",
    "Constancia, disciplina, progreso: una secuencia efectiva.",
    "Practica guiada, mejora real, resultado confiable."
  ],

  numbers: numbersIntermediate,

  code: [
    "const mejora = historial.filter((item) => item.accuracy > 95);",
    "for (const tecla of teclasDebiles) practicar(tecla);",
    "const resumen = sesiones.map((item) => item.metrics.netWpm);",
    "return historial.slice(-5).map((sesion) => sesion.mode);",

    "const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;",
    "if (consistencia > 80) activarModoAdaptativo();",
    "const errores = reporte.filter((e) => e.count > 2);",
    "return sesiones.filter((s) => s.completed).length;",

    "const flujo = datos.map((d) => d.velocidad);",
    "if (precision > 95) avanzarNivel();",
    "const historialReciente = historial.slice(-10);",
    "return historialReciente.map((h) => h.metrics.accuracy);",

    "const maximo = Math.max(...valores);",
    "if (maximo > objetivo) subirNivel();",
    "const tendencias = datos.map((d) => d.delta);",
    "return tendencias.filter((t) => t > 0);",

    "const estado = precision > 90 ? 'estable' : 'mejorar';",
    "if (modo === 'practica') iniciarSesion();",
    "const agrupado = lista.reduce((acc, item) => ({ ...acc, [item.tipo]: 1 }), {});",

    "return resultados.slice(-3);",
    "const activo = filtros.includes('numeros');",
    "if (activo) ejecutar();",

    "const rango = { min: Math.min(...valores), max: Math.max(...valores) };",
    "return rango;",
    "const analisis = sesiones.map((s) => s.rendimiento);",
    "if (analisis.length > 5) generarReporte();"
  ]
});