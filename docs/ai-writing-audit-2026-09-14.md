# Auditoría editorial: giros artificiales y alternativas

Fecha: 14 de septiembre de 2026. Corpus: copia local de diegodella.ar. No se comparó con el sitio desplegado.

## Resultado

Sí: hay pasajes que conviene reemplazar o recortar porque siguen fórmulas, exageran o resultan intercambiables. El problema principal es la acumulación de recursos: negación y corrección, frases fragmentadas, nuevos nombres para cada concepto y cierres que explican al lector la importancia de lo que acaba de leer. No hace falta eliminar tu voz ni reescribir todas las piezas.

Se revisaron las **42 páginas HTML**, incluidas las **23 piezas del registro editorial** —tesis, seis papers y dieciséis textos restantes—, las **86 tarjetas de Nuggets**, las páginas de presentación y los índices. También se revisaron las versiones Markdown públicas listadas al final, los textos compartidos identificados en JavaScript y la presentación de `site-data.json` y `llms.txt`.

La lista contiene **158 observaciones concretas**: **59 de prioridad alta**, **95 media** y **4 baja**. Una observación puede cubrir un pasaje con varias frases o una repetición en varias ubicaciones. No son 158 pruebas de autoría por IA, ni todas requieren sustituir palabras: algunas requieren quitar una repetición, aclarar una hipótesis o corregir una inconsistencia.

Desglose: 93 de estilo, 37 de argumento, 14 de coherencia interna, 9 de redundancia dentro de una pieza y 5 de duplicación entre piezas. Las filas de duplicación registran cada ubicación a intervenir; no representan ese número de pares independientes.

**Qué significa “AI-ism” aquí:** un juicio editorial sobre prosa que parece producida con una plantilla. No se empleó un detector ni se asignaron probabilidades de autoría. La presencia de una oposición, una tríada o un guion no basta para marcar un pasaje. Se evaluaron su función, frecuencia y contexto. Los reemplazos son propuestas mías basadas en el registro más directo del corpus; no son citas tuyas ni una reconstrucción demostrable de cómo escribirías.

## Por dónde empezaría

1. **Nuggets:** los resúmenes convierten hipótesis en absolutos: “Nobody Will Browse Anymore”, “Funnels Are Dead”, “Nothing survives in between”. Además, hay nombres y cantidades inconsistentes.
2. **Papers 01–04:** limpiar aperturas abstractas y remates; los papers 03 y 04 comparten dos frases completas de cierre.
3. **The Last Scarcity, The Constitutive Arc y la tesis:** separar el registro personal o el modelo propuesto de certezas universales, garantías y afirmaciones de primacía.
4. **After You Post:** conservar sus preguntas y ejemplos; recortar párrafos repetidos y la duplicación inmediata de los cinco finales.
5. **Presentación del sitio:** bajar enumeraciones de especialidades y frases que parecen instrucciones internas de posicionamiento: “inspectable evidence”, “repository-approved”, “authoritative background”.

## Patrones que cruzan el corpus

| Patrón | Qué ocurre aquí | Criterio de edición |
| --- | --- | --- |
| Negación seguida de revelación | “Not X. Y.” aparece tanto para distinguir conceptos como para dar peso a frases comunes. | Conservar cuando X e Y delimitan cosas distintas; formular directamente cuando solo agrega énfasis. |
| Suspense sin referente | “The thing”, “the gap”, “the pattern” demoran el sustantivo concreto. | Nombrar la decisión, pérdida, tarea o relación en la primera frase útil. |
| Profundidad autodeclarada | “Structural”, “genuine”, “the most important” sustituyen a veces el mecanismo o la evidencia. | Explicar qué cambia, para quién y con qué consecuencia. |
| Falsa novedad | “Nobody says”, “almost nobody”, “the only” presentan el argumento como excepcional. | Delimitar la observación propia o quitar la comparación universal. |
| Metáforas tratadas como prueba | Montaña, ola, campo, deuda, piso, arquitectura y dominós se convierten en explicaciones completas. | Mantener la imagen útil y distinguir analogía de evidencia. |
| Final que se comenta a sí mismo | “That is the work”, “That’s the answer”, “You just watched it happen”. | Terminar antes: en la escena, decisión o pregunta concreta. |
| Hipótesis que termina como certeza | Un texto reconoce límites y luego dice que la dirección no puede ser incorrecta. | Mantener en la conclusión el mismo grado de certeza que en el desarrollo. |

Como control de repetición, en los textos extraídos de las 23 páginas editoriales aparecen **“not a” 134 veces en 21 páginas**, **“structural” 81 en 16**, **“nobody” 52 en 14** y **“the thing” 49 en 17**. Son búsquedas literales sin distinguir mayúsculas, con límites de palabra; cuentan títulos, destacados y repeticiones HTML, no solo prosa única. “Not a” también aparece en negaciones normales. Estos números describen recurrencia, no calidad ni procedencia.

## Lo que conviene conservar

| Referencia | Fragmento | Por qué funciona |
| --- | --- | --- |
| [the-last-manual-moment.html](/home/diego/Documents/diegodella/the-last-manual-moment.html:345) | “I built Chango on a Tuesday night.” | Empieza con una acción, un objeto y un momento; no anuncia una revolución. |
| [the-great-contraction.html](/home/diego/Documents/diegodella/the-great-contraction.html:550) | “He kept turning it around looking for the preview button.” | Un detalle observable deja entender la distancia generacional. |
| [the-great-contraction.html](/home/diego/Documents/diegodella/the-great-contraction.html:769) | “He went right back to the iPad.” | Complica la propia tesis en vez de convertir la anécdota en una moraleja perfecta. |
| [the-last-scarcity.html](/home/diego/Documents/diegodella/the-last-scarcity.html:325) | “Made steak sandwiches and a salad for dinner.” | Da textura concreta a la escena. Conservar detalles que ya sean verdaderos; no fabricar otros para sonar humano. |
| [the-rhyme.html](/home/diego/Documents/diegodella/the-rhyme.html:331) | “I moved from agents to swarms when the agents started producing outputs that conflicted with each other” | Relaciona una decisión con un problema específico. |
| [work-roxom.html](/home/diego/Documents/diegodella/work-roxom.html:116) | “A field means one thing in one tool and something else in another.” | Explica una falla operativa sin recurrir a una abstracción. |
| [paper-02.html](/home/diego/Documents/diegodella/paper-02.html:360) | “MMF without PMF is a promise the product cannot keep.” | Contraste útil: distingue una promesa de la capacidad del producto. No eliminar todas las antítesis. |
| [paper-05.html](/home/diego/Documents/diegodella/paper-05.html:472) | “This paper is a structured hypothesis, not a validated playbook.” | La oposición cumple una función real: informa el estatus de la propuesta. |

También conservaría las definiciones necesarias, ejemplos operativos, preguntas de investigación y condiciones de revisión. Un registro académico puede ser sobrio sin convertirse en coloquial; una escena personal puede tener ritmo sin necesitar un remate en cada párrafo.

## Cobertura por página

Todas las filas siguientes corresponden a páginas leídas. “Sin cambios señalados” significa que no encontré un problema relevante de esta clase en su contenido propio; no certifica exactitud legal, técnica o histórica. Los textos comunes añadidos por JavaScript se agrupan al final.

| Página | Observaciones | Prioridad máxima | Lectura editorial |
| --- | ---: | --- | --- |
| [404.html](/home/diego/Documents/diegodella/404.html) | 0 | — | Sin cambios señalados: recuperación clara, sin un problema relevante de estilo propio. |
| [about.html](/home/diego/Documents/diegodella/about.html) | 3 | Media | Mantener hechos y proyectos; quitar instrucciones sobre cómo interpretar el perfil. |
| [ai-media.html](/home/diego/Documents/diegodella/ai-media.html) | 3 | Media | Conservar límites operativos de agentes; quitar caricaturas y reglas internas. |
| [already-decided.html](/home/diego/Documents/diegodella/already-decided.html) | 4 | Alta | La experiencia narrada sostiene el texto; reducir revelaciones y remates compartidos. |
| [archive.html](/home/diego/Documents/diegodella/archive.html) | 1 | Media | La elección por problema es útil; quitar comentario sobre el rediseño. |
| [before-you-delegate.html](/home/diego/Documents/diegodella/before-you-delegate.html) | 4 | Alta | Preguntas prácticas útiles; demasiada universalización y falsa precisión. |
| [concepts.html](/home/diego/Documents/diegodella/concepts.html) | 2 | Media | Glosario útil; algunas definiciones y rótulos usan más jerga de la necesaria. |
| [contact.html](/home/diego/Documents/diegodella/contact.html) | 1 | Baja | Contenido funcional claro; el título admite un ajuste opcional de tono. |
| [developers.html](/home/diego/Documents/diegodella/developers.html) | 0 | — | Sin cambios señalados: terminología técnica justificada por su audiencia. |
| [essays.html](/home/diego/Documents/diegodella/essays.html) | 2 | Media | Explicar qué leer sin metáforas de navegación ni oposiciones innecesarias. |
| [frameworks.html](/home/diego/Documents/diegodella/frameworks.html) | 1 | Media | Presentación breve; evitar que el resumen convierta posibilidades en binarios. |
| [index.html](/home/diego/Documents/diegodella/index.html) | 3 | Media | Reducir el inventario de categorías; los casos comunican mejor la trayectoria. |
| [media-kit.html](/home/diego/Documents/diegodella/media-kit.html) | 2 | Media | La tercera persona es apropiada aquí; simplificar bio y texto de foto. |
| [notes.html](/home/diego/Documents/diegodella/notes.html) | 1 | Media | La metáfora de estantes y compresión dificulta instrucciones simples. |
| [nuggets.html](/home/diego/Documents/diegodella/nuggets.html) | 16 | Alta | Se leyeron las 86 tarjetas; varias exageran o deforman las fuentes. |
| [occlusion-bias.html](/home/diego/Documents/diegodella/occlusion-bias.html) | 5 | Alta | Distinguir el mecanismo propuesto de la convicción del cierre. |
| [origin-gravity.html](/home/diego/Documents/diegodella/origin-gravity.html) | 5 | Alta | Aclarar relación entre autor individual y criterio editorial; quitar cierre duplicado. |
| [paper-01.html](/home/diego/Documents/diegodella/paper-01.html) | 5 | Alta | Apertura genérica y abstracciones donde caben decisiones de producto. |
| [paper-02.html](/home/diego/Documents/diegodella/paper-02.html) | 4 | Alta | Concepto legible; reducir perfección exigida y cierres grandiosos. |
| [paper-03.html](/home/diego/Documents/diegodella/paper-03.html) | 5 | Alta | Metáfora arquitectónica extensa y cierre duplicado con paper-04. |
| [paper-04.html](/home/diego/Documents/diegodella/paper-04.html) | 5 | Alta | Buena descripción de decisiones graduales; sobran inevitabilidad y cierre copiado. |
| [paper-05.html](/home/diego/Documents/diegodella/paper-05.html) | 5 | Alta | Detalles operativos útiles; los resúmenes pierden matices del desarrollo. |
| [paper-06.html](/home/diego/Documents/diegodella/paper-06.html) | 4 | Alta | La explicación de mediación sirve; las frases de mapa y exclusividad la sobreactúan. |
| [privacy.html](/home/diego/Documents/diegodella/privacy.html) | 1 | Baja | Ajuste del título solamente; no se propone cambiar obligaciones o políticas. |
| [series.html](/home/diego/Documents/diegodella/series.html) | 1 | Media | Conservar orden y enlaces; describir temas en vez de autocalificar las rutas. |
| [speaking.html](/home/diego/Documents/diegodella/speaking.html) | 2 | Media | Temas concretos; quitar diferenciación contra una charla genérica. |
| [the-empty-room.html](/home/diego/Documents/diegodella/the-empty-room.html) | 4 | Alta | Pregunta clara; el suspense y la repetición añaden peso artificial. |
| [the-great-contraction.html](/home/diego/Documents/diegodella/the-great-contraction.html) | 5 | Alta | La cámara y el regreso al iPad son el centro; no necesitan explicar todo el mundo. |
| [the-last-human-impression.html](/home/diego/Documents/diegodella/the-last-human-impression.html) | 5 | Alta | Taxonomía útil; bajar la urgencia y las promesas de un futuro resuelto. |
| [the-last-manual-moment.html](/home/diego/Documents/diegodella/the-last-manual-moment.html) | 4 | Alta | Conservar Chango y Lucas; revisar generalizaciones sobre capacidades y cierres. |
| [the-last-scarcity.html](/home/diego/Documents/diegodella/the-last-scarcity.html) | 7 | Alta | Voz personal fuerte mezclada con garantías y escenarios tratados como hechos. |
| [the-proxy-self.html](/home/diego/Documents/diegodella/the-proxy-self.html) | 3 | Alta | La analogía de Severance funciona como analogía; no prueba lo ocurrido en una cuenta. |
| [the-rhyme.html](/home/diego/Documents/diegodella/the-rhyme.html) | 5 | Alta | Conservar fallas que motivaron cambios; separar reconocimiento de patrones y predicción. |
| [the-transition-tax.html](/home/diego/Documents/diegodella/the-transition-tax.html) | 4 | Alta | La clasificación ayuda; revisar metáforas que pasan a afirmar leyes. |
| [the-trust-collapse.html](/home/diego/Documents/diegodella/the-trust-collapse.html) | 4 | Alta | Pregunta válida sobre expectativas; no diagnosticar autoría por tono o velocidad. |
| [thesis.html](/home/diego/Documents/diegodella/thesis.html) | 6 | Alta | Modelo académico: conservar estructura; revisar certeza, repetición y criterios de descarte. |
| [unfinished-arguments.html](/home/diego/Documents/diegodella/unfinished-arguments.html) | 4 | Alta | Convertir certezas en preguntas acordes con una sección de trabajo abierto. |
| [work-posta.html](/home/diego/Documents/diegodella/work-posta.html) | 1 | Baja | Predomina prosa concreta; solo un recorte opcional. |
| [work-roxom.html](/home/diego/Documents/diegodella/work-roxom.html) | 2 | Media | Buenos ejemplos de fallas y responsabilidades; retoques puntuales. |
| [work.html](/home/diego/Documents/diegodella/work.html) | 2 | Media | Los dos casos ya explican la propuesta; no necesitan defensa de posicionamiento. |
| [writing-for-the-filter.html](/home/diego/Documents/diegodella/writing-for-the-filter.html) | 4 | Alta | Dos secciones repiten la explicación; falta distinguir desarrollo de recapitulación. |
| [zmox.html](/home/diego/Documents/diegodella/zmox.html) | 8 | Alta | Alta densidad metafórica, autoridad autodeclarada y problemas de consistencia. |

## Lista de cambios propuestos

**Alta:** corregir antes de una revisión editorial final; afecta credibilidad, consistencia o repite texto de forma importante. **Media:** mejora clara de voz, fluidez o precisión. **Baja:** ajuste opcional.

**Estilo** cubre formulación. **Argumento** señala que sustituir palabras no basta para sostener la afirmación. **Coherencia** señala discrepancias dentro del corpus. **Redundancia** y **Duplicación** indican recortes, no un juicio de procedencia. Los destacados pueden repetir ideas por diseño; se marcan cuando la proximidad o extensión hace que el lector reciba dos veces el mismo cierre o párrafo.

Las citas conservan el texto y la puntuación del archivo, con entidades HTML decodificadas y espacios normalizados. Las referencias señalan la línea donde comienza el bloque que contiene la cita; en HTML minificado puede ser una línea larga. Cuando hay más de una aparición dentro de una página, se muestran todas las ubicaciones detectadas.

### The Continuous Moment of Intent

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E001 · Media · Estilo | “A Strategic Framework for Media Growth in the Age of Fragmented Attention”<br>[403](/home/diego/Documents/diegodella/thesis.html:403) | Subtítulo intercambiable con muchas publicaciones de estrategia; no expresa la propuesta concreta. | How media can build a habit of return across the places people already use. |
| E002 · Media · Estilo | “This section is the honest accounting of intellectual debts and the precise points of departure.”<br>[597](/home/diego/Documents/diegodella/thesis.html:597) | La honestidad se anuncia en vez de mostrarse mediante atribución; quitar el autoelogio. | Here is what ZMOI and CMI borrow from earlier work, and where I propose extending it. |
| E003 · Alta · Argumento | “One experiment answers that.”<br>[980](/home/diego/Documents/diegodella/thesis.html:980) | El cierre convierte una prueba inicial en respuesta definitiva, aunque se propone comparar solo dos eventos. | This comparison would provide an initial test of the claim. |
| E004 · Alta · Coherencia | “If a prediction fails, the response is not to abandon the framework but to diagnose which layer is underperforming, adjust, and retest.”<br>[916](/home/diego/Documents/diegodella/thesis.html:916) | Promete kill criteria pero cada resultado adverso se atribuye a la implementación. Separar diagnóstico operativo de evidencia contra la hipótesis. | A failed prediction should prompt a review of both the implementation and the claim. Retesting should not rule out revising or rejecting the framework. |
| E005 · Alta · Argumento | “and category leadership follows.”<br>[1129](/home/diego/Documents/diegodella/thesis.html:1129) | Promesa de resultado que excede el carácter propuesto del modelo. | Sustained presence before opinions form is the growth hypothesis CMI asks media teams to test. [Reemplaza la oración completa de One-line thesis.] |
| E006 · Media · Redundancia | “CMI is not a content strategy; it is a presence architecture.”<br>[555](/home/diego/Documents/diegodella/thesis.html:555) | La misma oposición vuelve en los destacados y en la conclusión. Definir una vez; después usar el término sin reintroducirlo. | CMI organizes repeated encounters with an editorial perspective across the channels a reader uses. |

### Before You Build: Strategic Debt

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E007 · Alta · Estilo | “In the current landscape of product development”<br>[276](/home/diego/Documents/diegodella/paper-01.html:276) | Apertura de plantilla: ubica una época sin aportar una observación. | We can build faster than we can explain what we are building. [Reemplaza la primera oración.] |
| E008 · Media · Estilo | “stable, coherent, and resonant thesis”<br>[295](/home/diego/Documents/diegodella/paper-01.html:295) | Tres calificativos abstractos; el lector necesita saber qué debe quedar claro. | clear account of who the product is for and what it helps them do |
| E009 · Alta · Estilo | “they are manifesting a specific vision of the future”<br>[296](/home/diego/Documents/diegodella/paper-01.html:296) | Grandilocuencia que tapa una consecuencia de producto más útil. | they know what to build and what to leave out |
| E010 · Media · Estilo | “We are not merely shipping features; we are staking a claim about how the world should work.”<br>[318](/home/diego/Documents/diegodella/paper-01.html:318) | Oposición épica innecesaria en un argumento sobre claridad. | The features should make the product’s purpose clear to the people using it. |
| E011 · Alta · Estilo | “That is the work. Everything else is execution.”<br>[343](/home/diego/Documents/diegodella/paper-01.html:343) | Remate totalizante: resta valor a la ejecución y repite la cadencia de otros finales. | Eliminar. El párrafo anterior ya termina con la decisión de acordar la historia antes de construir. |

### Message-Market Fit

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E012 · Media · Estilo | “The framework is sound. The logic is clean.”<br>[274](/home/diego/Documents/diegodella/paper-02.html:274) | Dos aprobaciones vagas antes de llegar al problema. | Eliminar ambas oraciones; pasar de la descripción de PMF al problema de reconocimiento. |
| E013 · Alta · Argumento | “Not approximately. Exactly.”<br>[318](/home/diego/Documents/diegodella/paper-02.html:318) | La precisión absoluta no está definida y convierte una idea útil en una exigencia imposible de evaluar tal como está escrita. | Eliminar este remate y sustituir “confirms exactly” por “supports in actual use”. |
| E014 · Media · Estilo | “The Operating Narrative is where strategy becomes engineering.”<br>[338](/home/diego/Documents/diegodella/paper-02.html:338) | Frase de conferencia; conviene decir qué cambia en las decisiones. | The Operating Narrative sets constraints the product team can use when choosing features. |
| E015 · Media · Estilo | “the users who were always yours to lose”<br>[361](/home/diego/Documents/diegodella/paper-02.html:361) | Dramatización posesiva; presupone que esos usuarios ya pertenecían al producto. | the users who need the product but cannot yet see how it helps them |

### The Architecture of Coherence

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E016 · Media · Estilo | “There is a belief, so widespread it has become invisible”<br>[323](/home/diego/Documents/diegodella/paper-03.html:323) | Apertura solemne sobre una creencia que se puede nombrar directamente. | Teams often build the product before deciding how to explain it. [Reemplaza la primera oración.] |
| E017 · Media · Estilo | “The message is not the paint. It is the load-bearing wall.”<br>[333](/home/diego/Documents/diegodella/paper-03.html:333) | Metáfora de construcción sobreexplotada en la serie; el párrafo siguiente extiende la imagen sin sumar criterio. | What the product promises should shape its design from the start. [Sustituye estas dos oraciones y la continuación de la pared.] |
| E018 · Alta · Argumento | “The Operating Narrative is the only document that connects strategy to execution without losing meaning at the handoff.”<br>[455](/home/diego/Documents/diegodella/paper-03.html:455) | “The only” declara superioridad exclusiva sin mostrar comparación. | The Operating Narrative gives product and communications teams a shared account of what they are building. |
| E019 · Alta · Duplicación | “You can re-acquire users. You cannot re-earn the clarity you chose not to build in the first place.”<br>[492](/home/diego/Documents/diegodella/paper-03.html:492) | Se repite literalmente en paper-04:413. También presenta la pérdida de claridad como irreversible sin justificarlo. | Write down the product’s claim and use it to review the next feature decision. |
| E020 · Alta · Duplicación | “That is the architecture. And like any architecture, the time to get it right is before anything is built; not after everything has to be torn down.”<br>[493](/home/diego/Documents/diegodella/paper-03.html:493) | También es el cierre literal de paper-04:414; la repetición hace visible la plantilla. | Eliminar después del cierre propuesto anterior. |

### Narrative Drift

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E021 · Alta · Argumento | “coherence does not break at launch. It breaks in year three.”<br>[288](/home/diego/Documents/diegodella/paper-04.html:288) | Falsa precisión temporal presentada como regla, aunque el fenómeno se describe como gradual y variable. | coherence can erode as the team grows and the original decisions become harder to explain. |
| E022 · Alta · Argumento | “the most expensive form of organizational entropy there is, because it is invisible until it is irreversible.”<br>[297](/home/diego/Documents/diegodella/paper-04.html:297) | Superlativo e irreversibilidad sin sostén en el pasaje; inflan una observación defendible. | a gradual loss of clarity that can become expensive to reverse. |
| E023 · Media · Estilo | “An Operating Narrative that is not being used to make decisions is not governance. It is archaeology.”<br>[346](/home/diego/Documents/diegodella/paper-04.html:346) | Chiste conceptual con la misma oposición que se repite en casi toda la serie. | Keep the Operating Narrative in use: review it when the product or audience changes. |
| E024 · Alta · Duplicación | “You can re-acquire users. You cannot re-earn the clarity you chose not to build in the first place.”<br>[413](/home/diego/Documents/diegodella/paper-04.html:413) | Copia del final del paper-03; este ensayo necesita terminar en gobernanza a escala. | When the team changes, revisit the original claim and decide which commitments still hold. |
| E025 · Alta · Duplicación | “That is the architecture. And like any architecture, the time to get it right is before anything is built; not after everything has to be torn down.”<br>[414](/home/diego/Documents/diegodella/paper-04.html:414) | Segunda oración del cierre compartida con paper-03, sin vínculo específico con mantenimiento. | Eliminar después del cierre propuesto anterior. |

### Launching Into Noise

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E026 · Media · Estilo | “The launch is not a moment. It is an architecture.”<br>[270](/home/diego/Documents/diegodella/paper-05.html:270) | La oposición “momento / arquitectura” es una consigna más que una explicación de la secuencia. | The launch depends on work that starts before the announcement: recruiting users, tracking their behavior, and deciding what would justify scaling. |
| E027 · Alta · Coherencia | “Only the first constitutes evidence of fit.”<br>[373](/home/diego/Documents/diegodella/paper-05.html:373) | El resumen contradice la distinción posterior: el propio texto admite señal de retención en usuarios de cualquier canal. | Acquisition source explains exposure; sustained use provides evidence of fit across both cohorts. |
| E028 · Media · Estilo | “These three deliverables reposition the PMM from a launch manager to a fit architect.”<br>[409](/home/diego/Documents/diegodella/paper-05.html:409) | “Fit architect” agrega una etiqueta profesional sin explicar trabajo adicional. | These three deliverables make the PMM responsible for the evidence used to decide when to scale. |
| E029 · Media · Estilo | “The Signal Map is not a reporting document. It is a discipline document.”<br>[433](/home/diego/Documents/diegodella/paper-05.html:433) | Distinción verbal poco útil: un documento puede cumplir ambas funciones. | Use the Signal Map to keep acquisition volume separate from evidence of sustained use. |
| E030 · Alta · Argumento | “It is also the only timeline that produces the evidence base the public launch needs to be more than a bet.”<br>[458](/home/diego/Documents/diegodella/paper-05.html:458) | Presenta un calendario propuesto como único válido; no encaja con la declaración de hipótesis no validada. | This is the timeline proposed here; teams should test whether it produces better decisions than a shorter launch process. |

### The Negotiated Moment

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E031 · Media · Estilo | “The Map You Are Using Is Wrong”<br>[300](/home/diego/Documents/diegodella/paper-06.html:300) | Título categórico y acusatorio antes de delimitar el problema. | What the journey map leaves out |
| E032 · Alta · Coherencia | “That assumption was wrong before it was proven wrong.”<br>[307](/home/diego/Documents/diegodella/paper-06.html:307) | Juego verbal que no aclara nada y choca con “Not because it was wrong then” del párrafo siguiente. | These models need a clearer account of how distribution systems influence the decision. |
| E033 · Media · Estilo | “The map is always the last to know.”<br>[451](/home/diego/Documents/diegodella/paper-06.html:451) | Personificación de cierre que reemplaza una instrucción útil. | Compare the journey you planned with how people actually found and understood the product. |
| E034 · Alta · Argumento | “It is the only measurement that predicts whether the relationship built will hold under pressure.”<br>[365](/home/diego/Documents/diegodella/paper-06.html:365) | Exclusividad predictiva, mientras el mismo ensayo llama a Resonance una orientación diagnóstica sin fórmula. | It asks whether the outcome served the user’s original intent, beyond whether they converted. |

### Before You Delegate

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E035 · Media · Estilo | “It is worth being precise about why this happens, because the answer changes what you do about it.”<br>[302](/home/diego/Documents/diegodella/before-you-delegate.html:302) | Anuncia precisión durante una oración entera; la explicación puede empezar directamente. | Eliminar y empezar por “The systems that eventually cost you your sovereignty…”. |
| E036 · Alta · Argumento | “That is the architecture of every platform, institution, and algorithmic system that has ever extracted value from the builders who depended on it.”<br>[302](/home/diego/Documents/diegodella/before-you-delegate.html:302) | “Every” y “ever” convierten el patrón en ley universal. | This is the dependency pattern I want to examine: useful services that become costly to leave. |
| E037 · Media · Estilo | “That is not a feature. That is the mechanism.”<br>[380](/home/diego/Documents/diegodella/before-you-delegate.html:380) | La oposición no distingue categorías excluyentes; repite la idea anterior. | Eliminar. La oración anterior ya dice que la utilidad crea la dependencia. |
| E038 · Alta · Argumento | “A platform that costs six months of transition work to exit today will cost two years in three years if the integration compounds.”<br>[457](/home/diego/Documents/diegodella/before-you-delegate.html:457) | Proyección numérica sin base expuesta: parece una medición y está presentada como certeza. | Estimate the exit work now, then review how further integrations would change that estimate. |

### Occlusion Bias

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E039 · Media · Estilo | “This is not a small methodological problem. It is the entire argument.”<br>[457](/home/diego/Documents/diegodella/occlusion-bias.html:457) | Autoénfasis en lugar de explicar el sesgo. | The visible sample excludes the content the distribution system never surfaced. |
| E040 · Media · Estilo | “Organizations making rational decisions on top of occluded data are not being irrational. They are being rational about the wrong signal.”<br>[498](/home/diego/Documents/diegodella/occlusion-bias.html:498) | Tautología retórica: “rational / irrational / rational” ocupa espacio sin precisar el error. | Teams can mistake the content a platform rewards for the content their audience values. |
| E041 · Alta · Coherencia | “Origin Gravity describes a structural force that is real, not a guaranteed outcome”<br>[655](/home/diego/Documents/diegodella/occlusion-bias.html:655) | La nota reconoce sesgo de supervivencia, pero enseguida afirma como probado el mecanismo que intenta evaluar. | Origin Gravity is a proposed explanation for these cases, not evidence that the same approach will work for every publisher |
| E042 · Alta · Coherencia | “If the argument here is wrong about the pace, it is not wrong about the direction.”<br>[731](/home/diego/Documents/diegodella/occlusion-bias.html:731) | Inmuniza la conclusión contra la evidencia después de dedicar una sección a falsarla. | The direction, as well as the pace, should be revisited if these indicators do not support the argument. |
| E043 · Media · Estilo | “The following kill criteria are the honest accounting of what would constitute evidence against each construct.”<br>[697](/home/diego/Documents/diegodella/occlusion-bias.html:697) | Segunda fórmula de “honest accounting”; la virtud no necesita anunciarse. | The following observations would count against each construct. |

### The Constitutive Arc

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E044 · Alta · Argumento | “The oldest known framework for multi-surface presence built around a single coherent lens.”<br>[405](/home/diego/Documents/diegodella/zmox.html:405) | Atribuye a Hokusai una primacía conceptual que surge de la analogía del autor. | I use the series here as an image for a consistent perspective across different contexts. |
| E045 · Alta · Estilo | “Not metaphor. Applied psychology.”<br>[670](/home/diego/Documents/diegodella/zmox.html:670) | Dos fragmentos buscan autoridad científica sin mostrar que la aplicación propuesta esté validada. | I am using that research to propose a design model; the model still needs testing. |
| E046 · Alta · Argumento | “No prior framework occupies the top-right quadrant: sustained engagement designed explicitly for deep transformation.”<br>[1132](/home/diego/Documents/diegodella/zmox.html:1132) | El gráfico seleccionado no demuestra ausencia de modelos previos; autoexcepcionalismo. | This comparison places CAX around sustained engagement and changes in understanding. |
| E047 · Media · Redundancia | “Campbell was not describing a storytelling technique. He was describing a structure of human transformation. The monomyth is the shape that meaningful change takes when it is made narratable.”<br>[940](/home/diego/Documents/diegodella/zmox.html:940), [944](/home/diego/Documents/diegodella/zmox.html:944) | Párrafo idéntico en líneas 940 y 944; aunque uno sea destacado, la repetición inmediata frena la lectura. | Conservar una aparición y formular como uso del autor: “I use Campbell’s monomyth here as a way to describe change over time.” |
| E048 · Alta · Argumento | “It is aligning itself with the deepest known pattern of how human beings grow.”<br>[1081](/home/diego/Documents/diegodella/zmox.html:1081) | Superlativo que contradice la cautela anterior sobre Campbell como heurística. | It is using a narrative model to plan how readers might develop their understanding over time. |
| E049 · Alta · Coherencia | “and the difference between them is not technical; it is intentional.”<br>[1664](/home/diego/Documents/diegodella/zmox.html:1664) | La conclusión atribuye la diferencia a intención, pero la sección ética anterior dice “Intention does not save. Structure does.” | and distinguishing them requires examining user autonomy and the accountability built into the system. |
| E050 · Media · Estilo | “Two iterations post red team”<br>[1831](/home/diego/Documents/diegodella/zmox.html:1831), [1920](/home/diego/Documents/diegodella/zmox.html:1920) | Nota de proceso interno expuesta en el colofón, sin decir quién revisó ni qué cambió. No prueba uso de IA. | Eliminar de ambas apariciones; conservar autor, versión y fecha. Si se documenta revisión, identificar revisores y alcance reales. |
| E051 · Media · Estilo | “This is the return. Not an answer. A lens. The rest is the work.”<br>[1794](/home/diego/Documents/diegodella/zmox.html:1794) | Cadencia de cuatro remates que se explica a sí misma después de un cierre ya extenso. | Eliminar. Cerrar con la pregunta concreta sobre qué aprende el lector al volver. |

### Already Decided

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E052 · Media · Estilo | “But the point is not the money. The point is that the decisions were already made before I opened my eyes.”<br>[261](/home/diego/Documents/diegodella/already-decided.html:261) | Oposición preparada; el hecho es suficientemente fuerte sin anunciar qué no importa. | The decisions were already made before I opened my eyes. |
| E053 · Alta · Estilo | “But here is what nobody says:”<br>[310](/home/diego/Documents/diegodella/already-decided.html:310) | Gancho de revelación exclusiva que no se sostiene ni hace falta. | Eliminar y empezar por “When the nature of the work changes…”. |
| E054 · Media · Estilo | “That is what cracks. Not headcount. Identity.”<br>[310](/home/diego/Documents/diegodella/already-decided.html:310) | Fragmentación enfática que simplifica el vínculo entre cambio laboral e identidad. | People also have to rethink the role they had built their identity around. |
| E055 · Media · Duplicación | “The distance between those two points is not a career.”<br>[342](/home/diego/Documents/diegodella/already-decided.html:342) | El mismo mecanismo de cierre aparece en The Rhyme; repetirlo reduce la identidad de ambas piezas. | Eliminar el párrafo de cierre que empieza “I started in metrics”; cerrar con las decisiones ya tomadas, que son el tema propio de este ensayo. |

### The Last Manual Moment

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E056 · Media · Estilo | “The texture of the world before intelligence became abundant.”<br>[350](/home/diego/Documents/diegodella/the-last-manual-moment.html:350) | Abstracción amplia: la preocupación concreta aparece más adelante y se puede anticipar. | What happens to the habit of working through a question when an answer is always available? |
| E057 · Alta · Argumento | “They are structurally incapable of giving you what you didn't know to ask for.”<br>[394](/home/diego/Documents/diegodella/the-last-manual-moment.html:394) | Una incapacidad absoluta sustituye a la pregunta válida sobre sistemas optimizados para preferencias. No queda demostrada en el ensayo. | My concern is whether systems built around our stated preferences leave enough room for encounters we did not plan. |
| E058 · Media · Estilo | “Not efficiently. Seriously.”<br>[408](/home/diego/Documents/diegodella/the-last-manual-moment.html:408) | Contraste llamativo entre dos cualidades compatibles. Puede sostenerse la voz de padre sin esa oposición. | Eliminar esas dos frases: “take their work seriously” ya expresa la idea. |
| E059 · Media · Estilo | “That's not a lesson about AI.”<br>[413](/home/diego/Documents/diegodella/the-last-manual-moment.html:413) | Prepara otro remate universal cuando la relación con Lucas es el cierre más propio. | That is what I want to teach Lucas as this changes. [Sustituye también la frase siguiente sobre “what being a person means”.] |

### The Great Contraction

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E060 · Media · Estilo | “Something is happening to the world at every scale simultaneously”<br>[553](/home/diego/Documents/diegodella/the-great-contraction.html:553) | La escena de la cámara da paso a una universalización repentina. | I see a similar desire for limits in several of the changes discussed here |
| E061 · Alta · Argumento | “That's not philosophy. That's physics.”<br>[581](/home/diego/Documents/diegodella/the-great-contraction.html:581) | Una analogía arquitectónica se usa como prueba del argumento social. | Eliminar estas dos frases; presentar la imagen del edificio como analogía, no demostración. |
| E062 · Media · Estilo | “Because density has a shadow, and the shadow has teeth.”<br>[695](/home/diego/Documents/diegodella/the-great-contraction.html:695) | Segunda y tercera metáfora sobre una abstracción; teatraliza el riesgo de exclusión. | The same structures that offer shelter can also exclude people. |
| E063 · Alta · Argumento | “It split into two extremes with nothing in between.”<br>[713](/home/diego/Documents/diegodella/the-great-contraction.html:713) | Binarismo que borra los casos intermedios para lograr contundencia. | I see pressure toward both large shared events and smaller communities. |
| E064 · Media · Estilo | “You're still here. You read the whole thing. That's a choice. What you do next is another one.”<br>[778](/home/diego/Documents/diegodella/the-great-contraction.html:778) | Interpela y felicita al lector; después de la vuelta a la cámara, prolonga artificialmente el final. | Eliminar. Recomiendo terminar en “But he kept the photos. He chose what stays.” y recortar los párrafos explicativos posteriores. |

### The Last Scarcity

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E065 · Media · Estilo | “That's it. That simple.”<br>[315](/home/diego/Documents/diegodella/the-last-scarcity.html:315) | Enfatiza una simplicidad ya expuesta; la operación concreta permite entender la escena. | Eliminar ambas frases. |
| E066 · Alta · Argumento | “Impossible to kill.”<br>[329](/home/diego/Documents/diegodella/the-last-scarcity.html:329) | Garantía absoluta dentro de una anécdota de trading; no se desprende de la estrategia descrita. | Eliminar la garantía y “so it couldn’t blow up”. Describir únicamente el tamaño de apuesta y el funcionamiento que el autor pueda respaldar. |
| E067 · Alta · Argumento | “It's the only one that matters. And almost nobody is talking about it.”<br>[364](/home/diego/Documents/diegodella/the-last-scarcity.html:364) | Combina exclusividad y falsa novedad; además minimiza las escaseces materiales que el ensayo presupone resueltas. | It is the question I want to focus on here: what gives people a reason to act? |
| E068 · Media · Estilo | “This sounds like a philosophy lecture. It's a business model.”<br>[457](/home/diego/Documents/diegodella/the-last-scarcity.html:457) | Eslogan que declara la conclusión antes de explicar el modelo. | I think this also changes what people may be willing to pay for. |
| E069 · Alta · Argumento | “He won't need to work to eat. He probably won't need to work to earn.”<br>[533](/home/diego/Documents/diegodella/the-last-scarcity.html:533) | Un futuro especulativo se narra como hecho sobre la vida del hijo. Cambiarlo a escenario, no a predicción asegurada. | If he grows up in a world where earning a living requires less work, what will give his days direction? |
| E070 · Media · Estilo | “Read that again slowly.”<br>[521](/home/diego/Documents/diegodella/the-last-scarcity.html:521) | Orden al lector que intenta fabricar importancia. | Eliminar; la contradicción personal siguiente puede sostenerse sola. |
| E071 · Media · Estilo | “That's the answer. You just watched it happen.”<br>[607](/home/diego/Documents/diegodella/the-last-scarcity.html:607) | Explica el significado del final después de mostrarlo. | Eliminar. Terminar en “Rewriting the last paragraph. Again.” conserva la escena y deja al lector sacar la conclusión. |

### The Rhyme

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E072 · Media · Estilo | “The crack is the crack. The pattern is the pattern.”<br>[281](/home/diego/Documents/diegodella/the-rhyme.html:281) | Tautologías que imitan profundidad; no describen qué patrón se reconoce. | Eliminar ambas oraciones; pasar de la comparación entre sectores al límite de esa comparación. |
| E073 · Alta · Argumento | “The order varies slightly. The outcome does not.”<br>[294](/home/diego/Documents/diegodella/the-rhyme.html:294) | La analogía histórica se convierte en determinismo. | The sequence is a useful comparison, though it does not guarantee the same outcome. |
| E074 · Alta · Argumento | “The company was the last community.”<br>[360](/home/diego/Documents/diegodella/the-rhyme.html:360) | Universaliza una experiencia profesional, pese a que el texto reconoce otras fuentes de comunidad. | For some people, the company is also their main community. |
| E075 · Alta · Argumento | “are about twelve to eighteen months from phase two”<br>[394](/home/diego/Documents/diegodella/the-rhyme.html:394) | Plazo concreto sin método expuesto. La frase de seis a doce meses repite el problema. | may next discover that their team structure no longer matches the cost of iteration. [Quitar ambos calendarios salvo que haya base explícita.] |
| E076 · Media · Estilo | “The rhyme is not the answer. The rhyme is the reason to keep asking.”<br>[426](/home/diego/Documents/diegodella/the-rhyme.html:426) | Nuevo cierre de oposición abstracta después de un pasaje más útil sobre equivocarse. | Eliminar. Terminar en la reflexión sobre cómo los errores previos ayudan a calibrar la comparación. |

### The Transition Tax

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E077 · Media · Estilo | “Not the most visible thing. Not the thing anyone announces.”<br>[351](/home/diego/Documents/diegodella/the-transition-tax.html:351) | Fragmentos de suspense antes de nombrar el descenso de tarifas. | You notice it when the rate drops or a client hesitates. [Unir con los ejemplos que siguen.] |
| E078 · Alta · Coherencia | “That gap is not fixed by retraining. It is fixed by time.”<br>[370](/home/diego/Documents/diegodella/the-transition-tax.html:370) | Más adelante, en la línea 440, se dice que la devaluación puede abordarse desarrollando habilidades. La oposición crea una contradicción. | Retraining takes time, and workers may face lower rates while they are still adapting. |
| E079 · Media · Estilo | “That is what vacuums do. They don't stay empty. They fill with whoever got there first.”<br>[405](/home/diego/Documents/diegodella/the-transition-tax.html:405) | La metáfora pasa a funcionar como explicación; no identifica quién termina pagando. | Eliminar. Dejar la discusión sobre cómo se asignan las consecuencias de los errores, con su alcance por verificar. |
| E080 · Media · Estilo | “That is what every constitution looks like from the inside.”<br>[466](/home/diego/Documents/diegodella/the-transition-tax.html:466) | Remate grandioso con un “every” innecesario. | Technical standards can embed choices that later become difficult to revisit. |

### The Last Human Impression

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E081 · Media · Estilo | “Not announced. Not replaced. Compressed.”<br>[529](/home/diego/Documents/diegodella/the-last-human-impression.html:529) | Tres fragmentos repiten “compressed” de la oración anterior para fabricar énfasis. | Eliminar estas tres frases; la compresión de la recepción humana ya está explicada. |
| E082 · Media · Estilo | “That unevenness is not a reassurance. It is a map.”<br>[565](/home/diego/Documents/diegodella/the-last-human-impression.html:565) | Consigna que retrasa el ejemplo de dónde afecta más la mediación. | The effect varies by task; the table below separates those cases. |
| E083 · Alta · Argumento | “It is the permanent floor of direct human experience value”<br>[592](/home/diego/Documents/diegodella/the-last-human-impression.html:592) | “Permanent” presenta un límite futuro como demostrado. | These are the experiences this argument expects to remain most resistant to delegation. [Reemplaza la oración completa y conserva su carácter de hipótesis.] |
| E084 · Alta · Argumento | “Build the asset now. The conversion path will clarify.”<br>[694](/home/diego/Documents/diegodella/the-last-human-impression.html:694) | Cierra una incertidumbre económica con una promesa de resolución inevitable. | Building the archive may help, but the revenue path remains unresolved and should be tested. |
| E085 · Media · Estilo | “The ones that wait for the metrics will find it occupied.”<br>[763](/home/diego/Documents/diegodella/the-last-human-impression.html:763) | Urgencia comercial de plantilla; asegura que esperar datos implica perder la posición. | Start with a small test in your own audience rather than assuming the same transition across every domain. |

### The Empty Room

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E086 · Media · Estilo | “You published something last week, or last month.”<br>[256](/home/diego/Documents/diegodella/the-empty-room.html:256) | Apertura que adjudica al lector una experiencia específica no conocida; pierde fuerza frente a un escenario explícito. | Suppose you publish a piece and the engagement looks normal. |
| E087 · Alta · Argumento | “The system has no reason to filter them out and, increasingly, no way to tell them apart.”<br>[274](/home/diego/Documents/diegodella/the-empty-room.html:274) | Generalización sobre todos los sistemas de medición; el ensayo no demuestra esa incapacidad. | The question for your analytics is whether those requests are being counted alongside human visits. |
| E088 · Media · Estilo | “The room isn't empty. That's the thing. It's full. It's just not full of who you think.”<br>[320](/home/diego/Documents/diegodella/the-empty-room.html:320) | La metáfora y la frase entrecortada vuelven a explicar lo ya argumentado. | Traffic can continue to rise while fewer people read the work directly. |
| E089 · Media · Redundancia | “The clicks are still coming. The question is who's making them.”<br>[340](/home/diego/Documents/diegodella/the-empty-room.html:340), [347](/home/diego/Documents/diegodella/the-empty-room.html:347) | Aparece en 340 y 347; mantener el cierre una sola vez. | Conservar solo la aparición final, en el bloque de cierre. |

### The Proxy Self

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E090 · Alta · Argumento | “What you were watching, without either of you knowing it, was a proxy.”<br>[255](/home/diego/Documents/diegodella/the-proxy-self.html:255) | Diagnostica una escena hipotética como si se conociera lo ocurrido. | One possible explanation is that more of the account’s activity has been delegated. |
| E091 · Media · Estilo | “Your professional reputation, in the most literal current sense, is a persistent queryable record”<br>[311](/home/diego/Documents/diegodella/the-proxy-self.html:311) | “In the most literal current sense” fuerza una metáfora y “persistent queryable record” reemplaza algo cotidiano por jerga. | Part of your professional reputation is now a searchable record of what you have published |
| E092 · Media · Redundancia | “The presence persists. The person keeps moving. At some point those two things are worth comparing.”<br>[330](/home/diego/Documents/diegodella/the-proxy-self.html:330), [336](/home/diego/Documents/diegodella/the-proxy-self.html:336) | Repetido inmediatamente en las líneas 330 y 336. El contraste sirve; sobra su duplicación. | Conservar una sola aparición, como cierre. |

### Writing for the Filter

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E093 · Media · Estilo | “Nobody updated the playbook.”<br>[258](/home/diego/Documents/diegodella/writing-for-the-filter.html:258) | Muletilla de cambio histórico que ya aparece en varias formulaciones del sitio. | The second filter changes what the first filter’s metrics can tell you. |
| E094 · Alta · Redundancia | “The agent summarizing your content doesn't care about the hook.”<br>[273](/home/diego/Documents/diegodella/writing-for-the-filter.html:273), [308](/home/diego/Documents/diegodella/writing-for-the-filter.html:308) | Las secciones 1 y 3 repiten casi el mismo párrafo sobre los dos filtros, el gancho y la compresión. | Mantener la explicación en la sección 1; abrir la sección 3 con lo que se pierde al resumir y quitar la reiteración. |
| E095 · Media · Estilo | “The numbers keep moving. The optimization keeps happening. The gap keeps opening.”<br>[324](/home/diego/Documents/diegodella/writing-for-the-filter.html:324) | Tríada de frases paralelas que fabrica cadencia sin precisar el efecto. | The metrics can keep rewarding changes that do not bring more readers to the original piece. |
| E096 · Media · Redundancia | “The content that matters now is the content that makes someone want to find the source.”<br>[345](/home/diego/Documents/diegodella/writing-for-the-filter.html:345), [352](/home/diego/Documents/diegodella/writing-for-the-filter.html:352) | Frase duplicada en el último párrafo y el cierre; “the content that matters” también excluye demasiado. | I want to write work that gives someone a reason to seek the original. [Usar una sola vez.] |

### The Trust Collapse

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E097 · Media · Estilo | “Nobody told you the rules changed. That's the part that stays with you afterward.”<br>[248](/home/diego/Documents/diegodella/the-trust-collapse.html:248) | Suspense genérico que presupone la reacción del lector. | A byline or a reply can lead a reader to assume a person is behind it. |
| E098 · Alta · Argumento | “The support agent resolves your issue faster than a human could have read your message, and you don't wonder anymore. You know.”<br>[281](/home/diego/Documents/diegodella/the-trust-collapse.html:281) | Rapidez convertida en prueba de autoría: reproduce justamente el salto que esta auditoría evita. | A very fast reply may make you wonder whether it was automated; speed alone does not settle that question. |
| E099 · Media · Estilo | “the category of online presences you assumed were people”<br>[286](/home/diego/Documents/diegodella/the-trust-collapse.html:286) | La categoría abstracta interrumpe una experiencia que se entiende con verbos comunes. | the accounts you assumed were run directly by the people behind them |
| E100 · Media · Redundancia | “Neither position gets you back to the floor you were standing on.”<br>[320](/home/diego/Documents/diegodella/the-trust-collapse.html:320), [328](/home/diego/Documents/diegodella/the-trust-collapse.html:328) | Repetida en 320 y 328; vuelve a una metáfora del piso usada muchas veces. | Either way, you now have to ask who produced what you are reading. [Una sola aparición.] |

### Origin Gravity

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E101 · Media · Estilo | “None of it is the thing.”<br>[251](/home/diego/Documents/diegodella/origin-gravity.html:251) | Retiene deliberadamente el referente; forma parte de una secuencia de negaciones antes de decir “origin”. | What interests me is the experience behind the work. |
| E102 · Media · Estilo | “That gap is where the human still lives.”<br>[284](/home/diego/Documents/diegodella/origin-gravity.html:284) | Remate metafísico después de una distinción que puede explicarse sin grandilocuencia. | Eliminar; la comparación entre recibir una respuesta y encontrar nuevas preguntas ya funciona. |
| E103 · Media · Estilo | “Not: be more personal. Not: perform vulnerability.”<br>[315](/home/diego/Documents/diegodella/origin-gravity.html:315) | Fórmula de falsas alternativas antes de una recomendación más concreta. | Write from situations you can describe and questions you have actually worked through. [Sustituir el arranque y enlazar con el resto.] |
| E104 · Media · Redundancia | “It is toward the person the content proves existed.”<br>[335](/home/diego/Documents/diegodella/origin-gravity.html:335), [341](/home/diego/Documents/diegodella/origin-gravity.html:341) | Repetido en 335 y 341. “Proves existed” dramatiza y no ofrece un criterio de verificación. | They want to keep reading the person behind the work. [Conservar una sola vez.] |
| E105 · Alta · Coherencia | “It is a property of the person who produced it”<br>[333](/home/diego/Documents/diegodella/origin-gravity.html:333) | El ensayo centra Origin Gravity en la persona; Occlusion Bias distingue expresamente editorial gravity de personality gravity. Aclarar si es un cambio o una aplicación del concepto. | Here I focus on the individual writer; in Occlusion Bias, the same question concerns the accountability of an editorial source. [Insertar aclaración junto a la definición y conservar el término solo con esa distinción.] |

### Unfinished Arguments

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E106 · Media · Estilo | “incompleteness here is honest, not lazy.”<br>[418](/home/diego/Documents/diegodella/unfinished-arguments.html:418) | Defensa anticipada del autor; evaluar honestidad corresponde al contenido y al lector. | These are working questions. I will revise them as evidence or experience changes the argument. |
| E107 · Alta · Argumento | “AI systems as currently deployed have no persistent memory across interactions.”<br>[516](/home/diego/Documents/diegodella/unfinished-arguments.html:516) | Afirmación universal y temporal sobre una clase heterogénea de sistemas, sin delimitar cuáles. Necesita verificación técnica antes de publicarse como hecho. | For a system that does not retain context between interactions, what kind of continuity can the user reasonably expect? |
| E108 · Alta · Argumento | “Nobody is building that mechanism back in.”<br>[598](/home/diego/Documents/diegodella/unfinished-arguments.html:598) | Declaración sobre todo el trabajo ajeno sin evidencia presentada. | What mechanisms would make providers and operators accountable for the advice their systems produce? |
| E109 · Alta · Coherencia | “both are true simultaneously.”<br>[647](/home/diego/Documents/diegodella/unfinished-arguments.html:647) | Una sección de argumentos abiertos declara dos hipótesis verdaderas antes de probarlas. | Both possibilities are worth examining together. |

### nuggets.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E110 · Media · Estilo | “each one reframes a decision you're about to make.”<br>[438](/home/diego/Documents/diegodella/nuggets.html:438) | Promete que cada tarjeta modificará una decisión real del lector sin conocerla. | Short ideas from the essays, with links to the full arguments. |
| E111 · Alta · Coherencia | “65 Ideas”<br>[440](/home/diego/Documents/diegodella/nuggets.html:440) | La introducción y el filtro dicen 86; el contador visible dice 65. Es un problema editorial, no indicio de autoría. | 86 Ideas. El HTML contiene 86 tarjetas con la clase “nugget-card fade-in”. |
| E112 · Alta · Coherencia | “Zero Moment of Influence”<br>[564](/home/diego/Documents/diegodella/nuggets.html:564) | El nombre desarrollado difiere del Zero Moment of Interpretation de la tesis. | Zero Moment of Interpretation |
| E113 · Alta · Argumento | “Funnels Are Dead”<br>[604](/home/diego/Documents/diegodella/nuggets.html:604) | Titular de fórmula “X ha muerto”; simplifica el argumento sobre entradas múltiples. | Readers enter from more than one route |
| E114 · Alta · Argumento | “Your Best Metrics Are Lying”<br>[707](/home/diego/Documents/diegodella/nuggets.html:707) | Personificación alarmista: los datos pueden estar mal interpretados sin mentir. | Check what your metrics actually measure |
| E115 · Media · Estilo | “Taste Is the New Oil”<br>[718](/home/diego/Documents/diegodella/nuggets.html:718) | Metáfora “X es el nuevo petróleo” intercambiable con cualquier tendencia. | Why selection matters when output grows |
| E116 · Alta · Argumento | “Nobody Will Browse Anymore”<br>[729](/home/diego/Documents/diegodella/nuggets.html:729) | Predicción total que borra los límites discutidos en los ensayos originales. | When agents browse on a reader’s behalf |
| E117 · Alta · Argumento | “If You Have to Explain It, You've Already Lost”<br>[775](/home/diego/Documents/diegodella/nuggets.html:775) | Confunde claridad con ausencia de explicación; gancho más absoluto que la idea que resume. | Explain the product before you scale acquisition |
| E118 · Media · Estilo | “something magical kicks in”<br>[803](/home/diego/Documents/diegodella/nuggets.html:803) | Muletilla promocional en una explicación de producto. | users have a clearer way to describe the product to others [Reformular desde “When that happens” y quitar la promesa de que cada usuario se vuelve un canal.] |
| E119 · Media · Estilo | “And here's the kicker:”<br>[838](/home/diego/Documents/diegodella/nuggets.html:838) | Gancho oral genérico que anuncia un golpe en vez de desarrollar el argumento. | Eliminar; revisar también la afirmación siguiente de que la coherencia no puede recuperarse. |
| E120 · Alta · Coherencia | “User from a friend's recommendation? Evidence of fit. User from an algorithm? Evidence that the algorithm found a trigger.”<br>[875](/home/diego/Documents/diegodella/nuggets.html:875) | La tarjeta transforma el origen en prueba suficiente de fit, perdiendo la distinción de comportamiento del paper 05. | A recommendation tells you how someone arrived. Retention and use tell you whether the product helps them. |
| E121 · Alta · Argumento | “slower to build, impossible to take away.”<br>[886](/home/diego/Documents/diegodella/nuggets.html:886) | “Impossible” promete invulnerabilidad a canales e infraestructuras. | slower to build, and less dependent on a single recommendation system. |
| E122 · Alta · Argumento | “Nothing survives in between.”<br>[1126](/home/diego/Documents/diegodella/nuggets.html:1126) | El resumen de The Great Contraction intensifica la falsa dicotomía. | The essay asks whether the middle is becoming harder to sustain. |
| E123 · Alta · Argumento | “The fastest-growing market in tech is the market for less tech.”<br>[1202](/home/diego/Documents/diegodella/nuggets.html:1202) | Superlativo cuantitativo sin comparación o medición expuesta. | Some people pay for tools that limit how much technology they use. |
| E124 · Alta · Argumento | “A person who can reason well is a hundred times more productive.”<br>[1194](/home/diego/Documents/diegodella/nuggets.html:1194) | Multiplicador no sustentado; no debe sobrevivir como dato al comprimir una hipérbole. | The value of the output still depends on how well the person directs and checks the work. |
| E125 · Media · Redundancia | “The Floor Was Made of Assumptions”<br>[1409](/home/diego/Documents/diegodella/nuggets.html:1409) | La tarjeta vuelve a narrar la misma metáfora en título, cita y explicación. | Who do readers think is answering? [Desarrollar la pregunta una vez y enlazar al ensayo.] |

### about.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E126 · Media · Estilo | “Together they provide inspectable evidence across media products, audience interaction, content workflows, editorial operations, AI agents, automation, and product strategy.”<br>[167](/home/diego/Documents/diegodella/about.html:167) | Explica cómo debe interpretarse la reputación del autor; lista larga que los proyectos ya muestran. | You can try the products or open their public repositories. |
| E127 · Media · Estilo | “These remain supporting experience, not the center of the current work.”<br>[134](/home/diego/Documents/diegodella/about.html:134) | Parece una instrucción interna de posicionamiento expuesta al público. | Eliminar. La experiencia de docencia y el programa pueden figurar sin jerarquizarlos defensivamente. |
| E128 · Media · Estilo | “His focus is not AI as a standalone category, but how it changes the systems behind media products, content, distribution and communities.”<br>[126](/home/diego/Documents/diegodella/about.html:126) | Cierre defensivo de bio que vuelve a enumerar categorías ya mencionadas. | His current work applies AI to the research, production, and distribution workflows behind media products. |

### ai-media.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E129 · Media · Estilo | “The least interesting version of an agent is a synthetic personality performing busyness.”<br>[103](/home/diego/Documents/diegodella/ai-media.html:103) | Caricatura de una alternativa ajena que retrasa los criterios útiles. | I evaluate agents by the work they can complete, the limits on their actions, and how they report problems. |
| E130 · Media · Estilo | “None of those jobs require pretending the agent is a colleague with a favorite coffee.”<br>[104](/home/diego/Documents/diegodella/ai-media.html:104) | Burla innecesaria; además el lenguaje personal de agentes aparece en los ensayos del propio sitio. | Eliminar. Conservar los ejemplos de investigación, metadata y programación. |
| E131 · Media · Estilo | “New work belongs here when there is something real to inspect, not when there is only a claim.”<br>[154](/home/diego/Documents/diegodella/ai-media.html:154) | Regla del proceso editorial insertada como cierre público. | Eliminar; los enlaces a proyectos ya cumplen esa función. |

### archive.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E132 · Media · Estilo | “The site is now organized as a decision path, not a storage room.”<br>[88](/home/diego/Documents/diegodella/archive.html:88) | Lenguaje de rediseño interno y contraste con una mala experiencia no solicitada. | Each route starts with a problem and suggests what to read next. |

### concepts.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E133 · Media · Estilo | “A retrieval-friendly map of the site”<br>[552](/home/diego/Documents/diegodella/concepts.html:552) | Describe la optimización para máquinas en lugar de la utilidad del glosario. | The ideas used throughout these essays |
| E134 · Media · Estilo | “teams that solved the thing but not the read of the thing.”<br>[635](/home/diego/Documents/diegodella/concepts.html:635) | “Thing / read of the thing” resulta opaco justo donde se promete lenguaje claro. | teams whose product solves a problem that potential users do not yet recognize |

### contact.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E135 · Baja · Estilo | “Send the context, not a puzzle.”<br>[90](/home/diego/Documents/diegodella/contact.html:90) | Tiene carácter, pero el reproche inicial puede ser innecesario para una consulta profesional. | Tell me what you are working on and where you need help. |

### essays.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E136 · Media · Estilo | “This is not a chronological blog.”<br>[73](/home/diego/Documents/diegodella/essays.html:73) | Explica qué no es el sitio en vez de facilitar la elección. | Choose a topic below, or follow a reading path. |
| E137 · Media · Estilo | “Use this when you want signal before commitment.”<br>[132](/home/diego/Documents/diegodella/essays.html:132) | Abstracción de navegación que también aparece en Notes. | Start here if you want a short idea before choosing an essay. |

### frameworks.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E138 · Media · Estilo | “launches either survive mediation or disappear.”<br>[99](/home/diego/Documents/diegodella/frameworks.html:99) | Final binario y dramático para explicar un índice. | launches depend on how people discover and understand the product. |

### index.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E139 · Media · Estilo | “I've spent more than 15 years building digital media companies, products, marketing, content, audiences, and communities.”<br>[98](/home/diego/Documents/diegodella/index.html:98) | Inventario de categorías que vuelve en varias páginas; “building marketing” también resulta forzado. | I co-founded Posta and helped build Roxom TV’s global operation. My work spans media products, marketing, content, and the teams and tools behind them. |
| E140 · Media · Estilo | “small experiments that make an operational idea inspectable.”<br>[130](/home/diego/Documents/diegodella/index.html:130) | “Inspectable” describe el objetivo de documentación más que el valor para el visitante. | small tools you can try |
| E141 · Media · Estilo | “the authoritative background.”<br>[168](/home/diego/Documents/diegodella/index.html:168) | La autoridad se autodeclara en un enlace de navegación. | my background. |

### media-kit.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E142 · Media · Estilo | “His focus is not AI as a standalone category, but how it changes the systems behind media products, content, distribution and communities.”<br>[91](/home/diego/Documents/diegodella/media-kit.html:91) | La misma bio de About; resolverla una vez y mantener la versión oficial sincronizada. | His current work applies AI to the research, production, and distribution workflows behind media products. |
| E143 · Media · Estilo | “A current repository-approved press headshot is not published on this site yet.”<br>[117](/home/diego/Documents/diegodella/media-kit.html:117) | “Repository-approved” filtra jerga de implementación al lector de prensa. | For a current press photo, contact Diego. |

### notes.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E144 · Media · Estilo | “signal before commitment: shorter arguments, sharper entries, and active fragments before the larger shelves.”<br>[142](/home/diego/Documents/diegodella/notes.html:142) | Metáforas de señal y estantes, más una tríada, para decir algo simple. | short ideas and work in progress before choosing a longer essay. |

### privacy.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E145 · Baja · Estilo | “A small site with a small data surface.”<br>[90](/home/diego/Documents/diegodella/privacy.html:90) | “Data surface” no ayuda al lector de una política de privacidad. | What information this site receives and how it is used. |

### series.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E146 · Media · Estilo | “These are the strongest read-this-in-order routes in the publication.”<br>[438](/home/diego/Documents/diegodella/series.html:438) | Autoevaluación genérica; el usuario necesita saber qué encontrará. | Choose Narrative-First for product and launch decisions, or After You Post for AI, readers, and trust. |

### speaking.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E147 · Media · Estilo | “not a generic AI keynote.”<br>[70](/home/diego/Documents/diegodella/speaking.html:70) | Diferenciación por descalificación vaga. | Eliminar el inciso: la experiencia operativa y los temas ya diferencian la propuesta. |
| E148 · Media · Estilo | “The AI-native newsroom is not an AI newsroom”<br>[78](/home/diego/Documents/diegodella/speaking.html:78) | Distinción circular que necesita interpretación para funcionar como título. | Where AI helps in a newsroom, and where editors still decide |

### work-posta.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E149 · Baja · Estilo | “That was the opening. It was also the constraint.”<br>[81](/home/diego/Documents/diegodella/work-posta.html:81) | Dos remates abstractos antes de la explicación concreta. | Eliminar; la oración sobre crear programas y desarrollar el mercado expresa ambas cosas. |

### work-roxom.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E150 · Media · Estilo | “Continuous live media is an operations problem disguised as a content problem.”<br>[74](/home/diego/Documents/diegodella/work-roxom.html:74) | Otra fórmula “X disfrazado de Y” que separa artificialmente responsabilidades conectadas. | Running a live channel around the clock requires programming, production, and recovery to work together. |
| E151 · Baja · Estilo | “without pretending uncertainty had disappeared.”<br>[108](/home/diego/Documents/diegodella/work-roxom.html:108) | Atribuye una pretensión a nadie; la capacidad concreta ya quedó explicada. | Eliminar el inciso y terminar después de “support internal interfaces”. |

### work.html

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E152 · Media · Estilo | “Not a résumé.”<br>[77](/home/diego/Documents/diegodella/work.html:77) | Niega una expectativa que el visitante no planteó. | Eliminar y comenzar con “Two cases…”. |
| E153 · Media · Estilo | “For inspectable evidence beyond the case studies”<br>[111](/home/diego/Documents/diegodella/work.html:111) | Jerga de verificación en un enlace cotidiano. | For more examples of what I am building |

### global.js

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E154 · Media · Estilo | “Stay in Essays, branch into Reading Paths, or take the compressed path before coming back deeper.”<br>[256](/home/diego/Documents/diegodella/global.js:256) | El texto añadido por JavaScript reproduce las metáforas de caminos y profundidad de los índices. | Read another essay, follow a series, or browse the short notes. |
| E155 · Media · Coherencia | “Message sent. Diego will reply directly.”<br>[1019](/home/diego/Documents/diegodella/global.js:1019) | Promete respuesta aunque Contact aclara que la aceptación del envío no garantiza contestación. | Your message has been sent to Diego. |
| E156 · Media · Coherencia | “Typical response: within two working days.”<br>[884](/home/diego/Documents/diegodella/global.js:884) | Plazo de respuesta añadido en el modal, sin respaldo en la página de contacto. | Eliminar el plazo salvo que Diego confirme que es un compromiso real. |

### zmox.md

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E157 · Media · Estilo | “It is not just about reaching audiences. It is about forming the conditions under which audiences interpret, trust, and remember.”<br>[7](/home/diego/Documents/diegodella/zmox.md:7) | El resumen reproduce la oposición y la tríada del ensayo, sin necesitar ese efecto. | It asks how repeated contact with a media source changes a reader’s understanding over time. |

### index.md

| ID / prioridad | Cita y ubicación | Motivo | Reemplazo o acción propuesta |
| --- | --- | --- | --- |
| E158 · Media · Estilo | “It is not a separate “AI expert” identity.”<br>[31](/home/diego/Documents/diegodella/index.md:31) | Instrucción de posicionamiento dentro de una presentación; ya queda claro por la trayectoria. | Eliminar; conservar la explicación anterior de continuidad profesional. |

## Versiones alternativas y recursos compartidos

Las versiones Markdown de tesis y frameworks son resúmenes, no copias completas. Se revisaron como textos propios. No deben contarse como una segunda lectura de la pieza larga.

| Recurso revisado | Resultado |
| --- | --- |
| `index.md` | Ajuste de posicionamiento listado; la introducción comparte la acumulación de categorías de Home. |
| `about.md` | Comparte la bio y la introducción de proyectos de About. Aplicar allí los mismos cambios si se aceptan; conservar datos y descripciones funcionales. |
| `thesis.md` | Resumen breve: no necesita una reescritura de estilo. Revisar la nomenclatura junto con la tesis. |
| `occlusion-bias.md` | Sin cambio de estilo adicional: resumen de alcance más breve que el paper. |
| `zmox.md` | Oposición y tríada incluidas en la lista; reemplazo específico. |
| `concepts.md` | Definiciones compartidas con el glosario. Sin otra intervención de voz; revisar CMOI frente a CMI. |
| `frameworks.md` | Sin cambios adicionales de esta clase; términos de navegación aceptables en el resumen. |
| `archive.md` | Índice escueto, sin cambios de estilo relevantes. |
| `404.md` | Mensaje funcional y rutas de recuperación; conservar. |
| `contact.md` | Instrucciones concretas; conservar. Su promesa de respuesta debe seguir alineada con el modal. |
| `privacy.md` | Registro funcional; no se propone alterar el contenido de política. |
| `developers.md` | Documentación de integración; terminología técnica pertinente. |
| `auth.md` | Instrucciones técnicas, sin un problema relevante de voz. |
| `docs/api.md` | Ejemplos y contrato técnico; sin reescritura editorial propuesta. No se probó el servicio. |
| `docs/problems.md` | Mensajes de diagnóstico y recuperación claros. |
| `docs/llms.txt` | Guía para máquinas; concisión e instrucciones explícitas son apropiadas. |
| `llms.txt` | La enumeración de áreas y las instrucciones de interpretación tienen una función de descubrimiento. Mantener sincronizadas las bios; no trasladar ese registro a la prosa dirigida a personas. |
| `site-data.json` | Revisadas bios, descripciones de proyectos y registro de 23 piezas. Comparte texto con Home, About y Media Kit; actualizar la fuente común si se editan sus copias. No tratar duplicación de metadata como falta de voz. |
| `global.js` | Se revisaron textos compartidos de navegación y contacto. Las observaciones específicas figuran en la lista. No se modificó ni ejecutó el formulario. |

**Coherencia terminológica adicional:** el cuerpo de la tesis desarrolla CMI, mientras la presentación y los índices también usan CMOI. Elegir CMI como forma canónica, por ser la definida en la tesis, y usarla en el glosario y en las referencias del sitio. En Nuggets, “Zero Moment of Influence” debe decir “Zero Moment of Interpretation”. Esto es consistencia editorial, no detección de IA.

## Cómo usar los reemplazos sin borrar la voz

- Empezar por duplicaciones y relleno: son los cambios de menor riesgo y no necesitan reinventar el argumento.
- En las filas de argumento, revisar primero si se quiere conservar la afirmación fuerte y aportar evidencia, o presentarla como hipótesis. La propuesta de esta auditoría es la versión delimitada, no una validación de la afirmación original.
- No trasladar lenguaje coloquial a todas las definiciones académicas. Mantener términos propios cuando están definidos y ayudan a razonar.
- No añadir anécdotas, muletillas, errores o confesiones para aparentar espontaneidad. Los detalles existentes alcanzan para identificar el registro que se quiere preservar.
- Mantener una sola aparición de los remates duplicados dentro de cada ensayo. En los papers 03 y 04, dar a cada uno un cierre propio.
- Revisar los resúmenes después de la pieza fuente: especialmente Nuggets, bios compartidas y descripciones del índice. Un resumen no debe tener más certeza que su fuente.

## Alcance y comprobación

La revisión es editorial y de consistencia interna. No es un fact-check externo ni valida citas bibliográficas, porcentajes, resultados financieros, afirmaciones legales, capacidades de productos o relatos autobiográficos. Cuando una frase dependía de ese tipo de prueba, se marcó la necesidad de delimitarla o verificarla, sin presentarla como refutada por esta revisión. Tampoco se atribuyó autoría a partir de rasgos de estilo.

Se excluyeron los briefs no publicados, backlog, ZIP de diseño, archivos de video, instrucciones de agentes y documentación interna de implementación. No se recorrieron los sitios de los productos enlazados. Las páginas HTML, resúmenes y recursos enumerados son la cobertura concreta; no se afirma haber revisado todos los archivos que un servidor pudiera hacer descargables.

Las citas de todas las filas se comprobaron por coincidencia literal contra el texto extraído de los archivos. Se verificó que las 42 páginas tengan una fila de cobertura y que las 23 piezas editoriales tengan observaciones propias. Se verificó el número de tarjetas de Nuggets en el HTML. Los enlaces y números de línea corresponden a la copia local al momento de la revisión.

Solo se crean este informe y su lista CSV. No se editaron los textos, no se regeneró metadata y no se publicó ningún cambio. El CSV permite filtrar por archivo, prioridad y tipo; comparte los mismos identificadores y propuestas de este informe.
