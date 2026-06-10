// One-shot (2026-06-10): adds DE/PL/ES card translations for the six AI
// projects that were missing from the locale files (belay, selfhelp-rag,
// nutrition-rag-autonomous, aichat, mcp-servers, resource-orchestration).
// Existing translations always win — this only fills gaps.
// Run from repo root:  node scripts/merge-ai-project-translations.mjs
import { readFileSync, writeFileSync } from "node:fs";

const T = {
  de: {
    belay: {
      title: "Belay — Ein KI-Tutor, der deinen Live-State liest",
      description:
        "Ein interaktiver KI-Tutor, der dir einen lebendigen, gesandboxten Übungsraum baut, deinen echten Fortschritt über eine strukturierte State-Bridge von innen abliest und dir abgestufte Hilfe gibt, die ausblendet, je besser du wirst. Kein Chatbot, der HTML schreibt — er verortet dich in der Aufgabe anhand des Live-States, bevor er ein Wort sagt. Ein einziger Vue-3-+-TypeScript-Renderer erscheint als Electron-Desktop-App und als Web-Build ohne Installation, läuft gehostet oder vollständig on-device (transformers.js + ONNX Runtime) und öffnet sich auf einen Katalog von 80 Templates in acht Domänen. Auch deine Paper liest er — ziehe einen Rahmen um eine Formel im PDF und pinne die gesetzte Antwort an genau diese Stelle — und ein begrenzter In-App-Browser stellt das echte Tool (ComfyUI, ein Fine-Tuning-Studio auf deiner eigenen Maschine) neben den Tutor.",
      highlights: {
        0: "Liest strukturierten Live-State über eine gesandboxte postMessage-Bridge — schlussfolgert über Fakten, nicht Pixel",
        1: "Abgestufte Hilfe (Hinweis → Ein Schritt → Lösung), verortet im Live-State, mit Unterstützung, die mit deinem Fortschritt ausblendet",
        2: "Verify-→-Self-Repair-Pipeline: ein kaputter erster Entwurf bekommt seinen eigenen Fehler zurückgespielt und wird regeneriert, bis er besteht",
        3: "Läuft gehostet oder vollständig on-device (transformers.js + ONNX Runtime), mit nativer Inferenz isoliert im eigenen Prozess — ein Modell-Crash reißt die App nicht mit",
        4: "Host-gerenderter PDF-Reader mit visuellem Q&A pro Region — gesetzte Antworten an die exakte Stelle pinnen, exportieren und re-importieren",
        5: "Begrenzter In-App-Browser für deine lokalen KI-Tools — ein selbst gebauter Filter-Proxy schließt DNS-Rebinding, und nicht vertrauenswürdiger Seitentext gelangt nie in persistierten Kontext",
      },
      links: { 0: "Live-Demo ausprobieren", 1: "Belay-Website besuchen" },
    },
    "selfhelp-rag": {
      title: "SelfHelpRAG — On-Premise-RAG mit hybridem Retrieval",
      description:
        "Ein Retrieval-augmentiertes Q&A-System für die Wissensbasis eines Enterprise-ERP. Deutschsprachig, läuft vollständig on-premise gegen ein selbst gehostetes LLM — von Tag eins für DSGVO-sensible Daten konzipiert.",
      highlights: {
        0: "Hybrides Retrieval — dense (Qdrant) + sparse (BM25) mit Reranking",
        1: "Eval-Harness mit gelabeltem Fragenkatalog, bewertet Retrieval + Zitation",
        2: "Injection-bewusster System-Prompt mit explizitem Verweigerungssatz",
      },
    },
    "nutrition-rag-autonomous": {
      title: "Autonome Ernährungs-Wissensbasis — selbstaktualisierendes RAG",
      description:
        "Eine selbstaktualisierende persönliche Ernährungs-Wissensbasis. Ein nächtlicher Daemon durchläuft den Obsidian-Vault, holt neue biomedizinische Literatur von Europe PMC für jedes Lebensmittel/Supplement/jede Substanz im Stack, fasst jedes Abstract über ein lokales Qwen3.6-35B auf vLLM zusammen, schreibt strukturierte Markdown-Notizen, committet und pusht in ein privates Forgejo-Repo — und eine Forgejo Action difft den Push und reindiziert nur die geänderten Dateien in OpenWebUIs BGE-M3-Hybrid-RAG. End-to-end on-premise; keine Dritt-API außer PubMed.",
      highlights: {
        0: "Tägliche autonome Research-Ingestion — 113 Themen → Europe PMC → lokales Qwen3.6 → 165 Paper/Lauf",
        1: "Git-getriebener CI-Reindex: Push → Diff → OpenWebUI-KB in ~30 Sekunden aktualisiert",
        2: "Hybrides Retrieval (BGE-M3 + BM25 + BGE-Reranker) empirisch getunt; 3 / 8 → 6 / 8 Queries über Schwellwert",
      },
    },
    aichat: {
      title: "AIChat — On-Premise-LLM-Chat-Frontend",
      description:
        "Ein selbst gehostetes Chat-Frontend für LM-Studio-Endpoints mit erstklassigem MCP-Tool-Calling. Streaming-SSE mit sauberer State-Trennung zwischen Vor-Tool-Erzählung und finaler Antwort. Läuft über Tailscale auf einem privaten DGX Spark.",
      highlights: {
        0: "Streaming-SSE-State-Machine, die Erzählung / Tool-Calls / finale Antwort trennt",
        1: "Erstklassige MCP-Integration mit Plugin- + ephemeral_mcp-Support",
        2: "Läuft über Tailscale auf einem selbst gehosteten DGX Spark — keine Cloud-Abhängigkeit",
      },
    },
    "mcp-servers": {
      title: "MCP-Server-Entwicklung",
      description:
        "Zwei eigene Model-Context-Protocol-Server für pixelgenaue Design-Workflows, plus Erweiterungen mehrerer Community-MCP-Server. TypeScript + Node, stdio-Transport, gebaut zum Andocken an MCP-Clients wie Claude Desktop und LM Studio.",
      highlights: {
        0: "design-perfect-mcp — 5 Tools für pixelgenaue Design-Umsetzung",
        1: "adobe-xd-mcp — Maße direkt aus .xd-Dateien extrahieren",
        2: "Mehrere Community-MCP-Server geforkt und erweitert",
      },
    },
    "resource-orchestration": {
      title: "Resource-Orchestration-Simulator",
      description:
        "Datacenter-Scheduling-Simulator mit Rust-Backend (~2.900 LOC) und Vue-3-Dashboard. Strategy-Pattern-Scheduler, Task-State-Machine, heterogenes Node-Tracking (CPU, Speicher, GPU). REST-API über Tokio + axum.",
      highlights: {
        0: "Tokio-+-axum-REST-API mit Strategy-Pattern-Scheduler",
        1: "Task-State-Machine mit Rust-Enums modelliert — ungültige Zustände sind nicht darstellbar",
        2: "Live-Vue-3-Dashboard für Submission, Scheduling und Metriken",
      },
    },
  },

  pl: {
    belay: {
      title: "Belay — tutor AI, który czyta twój live state",
      description:
        "Interaktywny tutor AI, który buduje ci żywą, odizolowaną (sandbox) przestrzeń ćwiczeń, odczytuje twój rzeczywisty postęp od środka przez ustrukturyzowany state bridge i podaje stopniowaną pomoc, która wygasa w miarę twoich postępów. To nie chatbot piszący HTML — lokalizuje cię w zadaniu na podstawie live state, zanim powie słowo. Jeden renderer Vue 3 + TypeScript działa jako aplikacja desktopowa Electron i web build bez instalacji, hostowany lub w pełni on-device (transformers.js + ONNX Runtime), i otwiera się na katalog 80 szablonów w ośmiu domenach. Czyta też twoje papery — zaznacz wzór w PDF i przypnij złożoną typograficznie odpowiedź dokładnie w tym miejscu — a ograniczona wbudowana przeglądarka stawia prawdziwe narzędzie (ComfyUI, studio fine-tuningu na twojej maszynie) obok tutora.",
      highlights: {
        0: "Czyta ustrukturyzowany live state przez odizolowany postMessage bridge — wnioskuje z faktów, nie pikseli",
        1: "Stopniowana pomoc (podpowiedź → jeden krok → rozwiązanie) lokalizowana z live state, ze wsparciem wygasającym w miarę postępów",
        2: "Pipeline verify → self-repair: zepsuty pierwszy szkic dostaje z powrotem własny błąd i jest regenerowany, aż przejdzie",
        3: "Działa hostowany lub w pełni on-device (transformers.js + ONNX Runtime), z natywną inferencją odizolowaną we własnym procesie — crash modelu nie zabiera aplikacji",
        4: "Renderowany przez hosta czytnik PDF z wizualnym Q&A dla regionu — przypinaj złożone odpowiedzi w dokładnym miejscu, eksportuj i importuj ponownie",
        5: "Ograniczona wbudowana przeglądarka dla lokalnych narzędzi AI — własny filtrujący proxy zamyka DNS rebinding, a niezaufany tekst strony nigdy nie trafia do utrwalanego kontekstu",
      },
      links: { 0: "Wypróbuj demo na żywo", 1: "Odwiedź stronę Belay" },
    },
    "selfhelp-rag": {
      title: "SelfHelpRAG — RAG on-premise z hybrydowym retrievalem",
      description:
        "System Q&A typu retrieval-augmented dla bazy wiedzy korporacyjnego ERP. Niemieckojęzyczny, działa w całości on-premise na własnym LLM — od pierwszego dnia projektowany pod dane wrażliwe wg RODO.",
      highlights: {
        0: "Hybrydowy retrieval — dense (Qdrant) + sparse (BM25) z rerankingiem",
        1: "Harness ewaluacyjny z oznakowanym zestawem pytań, ocenia retrieval + cytowania",
        2: "System prompt odporny na injection, z jawnym zdaniem odmowy",
      },
    },
    "nutrition-rag-autonomous": {
      title: "Autonomiczna baza wiedzy o żywieniu — samoaktualizujący się RAG",
      description:
        "Samoaktualizująca się osobista baza wiedzy o żywieniu. Nocny daemon przechodzi vault Obsidiana, pobiera nową literaturę biomedyczną z Europe PMC dla każdego produktu/suplementu/związku w stacku, streszcza każdy abstrakt lokalnym Qwen3.6-35B na vLLM, zapisuje ustrukturyzowane notatki Markdown, commituje i pushuje do prywatnego repo Forgejo — a Forgejo Action diffuje push i reindeksuje tylko zmienione pliki do hybrydowego RAG BGE-M3 w OpenWebUI. End-to-end on-premise; żadnego zewnętrznego API poza PubMed.",
      highlights: {
        0: "Codzienna autonomiczna ingestia badań — 113 tematów → Europe PMC → lokalny Qwen3.6 → 165 paperów/przebieg",
        1: "Reindeks CI sterowany gitem: push → diff → baza w OpenWebUI zaktualizowana w ~30 sekund",
        2: "Hybrydowy retrieval (BGE-M3 + BM25 + BGE-reranker) strojony empirycznie; 3 / 8 → 6 / 8 zapytań powyżej progu",
      },
    },
    aichat: {
      title: "AIChat — frontend czatu LLM on-premise",
      description:
        "Samodzielnie hostowany frontend czatu dla endpointów LM Studio z pełnoprawnym MCP tool-callingiem. Streaming SSE z czystym rozdziałem stanu między narracją przed wywołaniem narzędzia a finalną odpowiedzią. Działa przez Tailscale na prywatnym DGX Spark.",
      highlights: {
        0: "State machine dla streamingu SSE rozdzielająca narrację / wywołania narzędzi / finalną odpowiedź",
        1: "Pełnoprawna integracja MCP z obsługą pluginów + ephemeral_mcp",
        2: "Działa przez Tailscale na własnym DGX Spark — zero zależności od chmury",
      },
    },
    "mcp-servers": {
      title: "Rozwój serwerów MCP",
      description:
        "Dwa własne serwery Model Context Protocol do pixel-perfect workflow designu, plus rozszerzenia kilku społecznościowych serwerów MCP. TypeScript + Node, transport stdio, zaprojektowane pod klienty MCP jak Claude Desktop i LM Studio.",
      highlights: {
        0: "design-perfect-mcp — 5 narzędzi do pixel-perfect implementacji designu",
        1: "adobe-xd-mcp — wyciąganie wymiarów bezpośrednio z plików .xd",
        2: "Kilka społecznościowych serwerów MCP zforkowanych i rozszerzonych",
      },
    },
    "resource-orchestration": {
      title: "Symulator orkiestracji zasobów",
      description:
        "Symulator schedulingu datacenter z backendem w Rust (~2 900 LOC) i dashboardem Vue 3. Scheduler we wzorcu strategii, task state machine, śledzenie heterogenicznych node'ów (CPU, pamięć, GPU). REST API na Tokio + axum.",
      highlights: {
        0: "REST API na Tokio + axum ze schedulerem we wzorcu strategii",
        1: "Task state machine zamodelowana enumami Rusta — stany niedozwolone są niereprezentowalne",
        2: "Dashboard Vue 3 na żywo: zgłaszanie zadań, scheduling i metryki",
      },
    },
  },

  es: {
    belay: {
      title: "Belay — un tutor de IA que lee tu live state",
      description:
        "Un tutor de IA interactivo que te construye un espacio de práctica vivo y aislado (sandbox), lee tu progreso real desde dentro a través de un state bridge estructurado y te da ayuda graduada que se desvanece a medida que mejoras. No es un chatbot que escribe HTML: te ubica en la tarea a partir del live state antes de decir una palabra. Un único renderer Vue 3 + TypeScript se distribuye como app de escritorio Electron y como web build sin instalación, funciona hosteado o totalmente on-device (transformers.js + ONNX Runtime), y se abre a un catálogo de 80 plantillas en ocho dominios. También lee tus papers: encuadra una fórmula en un PDF y fija la respuesta tipografiada en ese punto exacto; y un navegador integrado y acotado pone la herramienta real (ComfyUI, un estudio de fine-tuning en tu propia máquina) junto al tutor.",
      highlights: {
        0: "Lee live state estructurado por un postMessage bridge aislado — razona sobre hechos, no píxeles",
        1: "Ayuda graduada (pista → un paso → solución) ubicada desde el live state, con apoyo que se desvanece a medida que mejoras",
        2: "Pipeline verify → self-repair: un primer borrador roto recibe su propio fallo y se regenera hasta pasar",
        3: "Funciona hosteado o totalmente on-device (transformers.js + ONNX Runtime), con la inferencia nativa aislada en su propio proceso: un crash del modelo no tumba la app",
        4: "Lector de PDF renderizado por el host con Q&A visual por región: fija respuestas tipografiadas en el punto exacto, expórtalas y reimpórtalas",
        5: "Navegador integrado y acotado para tus herramientas locales de IA: un proxy de filtrado propio cierra el DNS rebinding y el texto no confiable de la página nunca entra al contexto persistido",
      },
      links: { 0: "Prueba la demo en vivo", 1: "Visita el sitio de Belay" },
    },
    "selfhelp-rag": {
      title: "SelfHelpRAG — RAG on-premise con retrieval híbrido",
      description:
        "Un sistema de Q&A con retrieval aumentado para la base de conocimiento de un ERP empresarial. En alemán, corre íntegramente on-premise contra un LLM autohosteado — diseñado desde el primer día para datos sensibles bajo RGPD.",
      highlights: {
        0: "Retrieval híbrido — dense (Qdrant) + sparse (BM25) con reranking",
        1: "Eval harness con set de preguntas etiquetado que puntúa retrieval + citación",
        2: "System prompt consciente de inyecciones, con frase explícita de rechazo",
      },
    },
    "nutrition-rag-autonomous": {
      title: "Base de conocimiento nutricional autónoma — RAG autoactualizable",
      description:
        "Una base de conocimiento nutricional personal que se actualiza sola. Un daemon nocturno recorre el vault de Obsidian, trae literatura biomédica nueva de Europe PMC para cada alimento/suplemento/compuesto del stack, resume cada abstract con un Qwen3.6-35B local sobre vLLM, escribe notas Markdown estructuradas, hace commit y push a un repo Forgejo privado — y una Forgejo Action hace diff del push y reindexa solo los archivos cambiados al RAG híbrido BGE-M3 de OpenWebUI. End-to-end on-premise; sin APIs de terceros salvo PubMed.",
      highlights: {
        0: "Ingesta de investigación autónoma diaria — 113 temas → Europe PMC → Qwen3.6 local → 165 papers/ejecución",
        1: "Reindexado CI guiado por git: push → diff → KB de OpenWebUI actualizada en ~30 segundos",
        2: "Retrieval híbrido (BGE-M3 + BM25 + BGE-reranker) ajustado empíricamente; 3 / 8 → 6 / 8 consultas sobre el umbral",
      },
    },
    aichat: {
      title: "AIChat — frontend de chat LLM on-premise",
      description:
        "Un frontend de chat autohosteado para endpoints de LM Studio con MCP tool-calling de primera clase. Streaming SSE con separación limpia de estado entre la narración previa a la herramienta y la respuesta final. Corre por Tailscale hacia un DGX Spark privado.",
      highlights: {
        0: "State machine de streaming SSE que separa narración / llamadas a herramientas / respuesta final",
        1: "Integración MCP de primera clase con soporte de plugins + ephemeral_mcp",
        2: "Corre por Tailscale hacia un DGX Spark autohosteado — sin dependencia de la nube",
      },
    },
    "mcp-servers": {
      title: "Desarrollo de servidores MCP",
      description:
        "Dos servidores Model Context Protocol propios para flujos de diseño pixel-perfect, más extensiones a varios servidores MCP de la comunidad. TypeScript + Node, transporte stdio, pensados para conectarse a clientes MCP como Claude Desktop y LM Studio.",
      highlights: {
        0: "design-perfect-mcp — 5 herramientas para implementación de diseño pixel-perfect",
        1: "adobe-xd-mcp — extrae medidas directamente de archivos .xd",
        2: "Varios servidores MCP de la comunidad forkeados y extendidos",
      },
    },
    "resource-orchestration": {
      title: "Simulador de orquestación de recursos",
      description:
        "Simulador de scheduling de datacenter con backend en Rust (~2.900 LOC) y dashboard en Vue 3. Scheduler con patrón estrategia, task state machine, seguimiento de nodos heterogéneos (CPU, memoria, GPU). REST API sobre Tokio + axum.",
      highlights: {
        0: "REST API sobre Tokio + axum con scheduler de patrón estrategia",
        1: "Task state machine modelada con enums de Rust — los estados inválidos son irrepresentables",
        2: "Dashboard Vue 3 en vivo para envío de tareas, scheduling y métricas",
      },
    },
  },
};

for (const [locale, additions] of Object.entries(T)) {
  const path = `src/i18n/locales/${locale}.json`;
  const data = JSON.parse(readFileSync(path, "utf8"));
  data.projects = data.projects ?? {};
  let added = 0;
  for (const [id, card] of Object.entries(additions)) {
    if (data.projects[id]) continue; // existing translations always win
    data.projects[id] = card;
    added += 1;
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: +${added} projects`);
}
