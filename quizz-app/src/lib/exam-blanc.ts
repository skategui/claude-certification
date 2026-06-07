export type Domain = {
  id: string;
  index: number;
  weight: number;
  emoji: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  color: string;
};

export type Scenario = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  domains: string[];
};

export type SampleQuestion = {
  id: number;
  domainId: string;
  scenarioId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  takeaway: string;
};

export type AntiPattern = {
  id: number;
  title: string;
  severity: "critical" | "high" | "medium";
  domainId: string;
  trap: string;
  correct: string;
  why: string;
};

export type ScopeItem = {
  title: string;
  items: string[];
};

export type PrepStep = {
  step: number;
  title: string;
  description: string;
  emoji: string;
};

export const examMeta = {
  name: "Claude Certified Architect – Foundations",
  passingScore: 720,
  scoreRange: "100–1000",
  questionFormat: "QCM (1 bonne réponse parmi 4)",
  scenariosOnExam: 4,
  totalScenarios: 6,
  experienceTarget: "6+ mois Claude API / Agent SDK / Claude Code / MCP",
};

export const domains: Domain[] = [
  {
    id: "agentic",
    index: 1,
    weight: 27,
    emoji: "🤖",
    title: "Architecture & Orchestration agentique",
    summary:
      "Boucles agentiques, coordinateur + sous-agents, hooks, décomposition de tâches, sessions et fork.",
    keyConcepts: [
      "Boucle: stop_reason 'tool_use' → continue, 'end_turn' → stop",
      "Hub-and-spoke: coordinateur centralise communication",
      "Sous-agents = contexte ISOLÉ, passer infos via prompt",
      "Task tool spawn sous-agents, allowedTools doit inclure 'Task'",
      "Hooks PostToolUse: normaliser données, bloquer actions",
      "Enforcement programmatique > instructions prompt pour règles strictes",
      "fork_session pour explorer branches divergentes",
    ],
    color: "from-indigo-100 to-purple-100",
  },
  {
    id: "tools",
    index: 2,
    weight: 18,
    emoji: "🔧",
    title: "Tool Design & MCP Integration",
    summary:
      "Descriptions de tools, erreurs structurées, distribution par agent, scope MCP, built-in tools.",
    keyConcepts: [
      "Descriptions tools = mécanisme #1 sélection LLM",
      "isError + errorCategory (transient/validation/permission) + isRetryable",
      "Trop de tools (18 vs 4-5) dégrade fiabilité",
      "tool_choice: 'auto' / 'any' / forced selection",
      ".mcp.json projet vs ~/.claude.json user",
      "Resources MCP = catalogues, Tools MCP = actions",
      "Grep contenu, Glob chemin, Read+Write fallback Edit",
    ],
    color: "from-pink-100 to-orange-100",
  },
  {
    id: "claudecode",
    index: 3,
    weight: 20,
    emoji: "💻",
    title: "Claude Code — Configuration & Workflows",
    summary:
      "Hiérarchie CLAUDE.md, slash commands, skills, règles path-scoped, plan mode, CI/CD.",
    keyConcepts: [
      "CLAUDE.md hiérarchie: user > project > directory",
      ".claude/rules/ + paths glob > sous-dirs CLAUDE.md",
      ".claude/commands/ projet, ~/.claude/commands/ perso",
      "context: fork isole skills verbeux",
      "Plan mode: complexe / architectural / multi-fichiers",
      "Direct execution: scope clair, fix simple",
      "CI: -p / --print, --output-format json, --json-schema",
    ],
    color: "from-emerald-100 to-teal-100",
  },
  {
    id: "prompt",
    index: 4,
    weight: 20,
    emoji: "✍️",
    title: "Prompt Engineering & Output structuré",
    summary:
      "Critères explicites, few-shot, JSON schemas via tool_use, validation/retry, batch API.",
    keyConcepts: [
      "Critères explicites > 'be conservative' / 'high confidence'",
      "Few-shot 2-4 exemples ambigus = format + généralisation",
      "tool_use + JSON schema = pas d'erreur syntaxe",
      "Champs nullable empêchent fabrication de valeurs",
      "Retry inutile si info absente du source",
      "Batch API: 50% économie, 24h, pas de tool calling multi-tour",
      "Multi-pass review: per-fichier + cross-fichier",
    ],
    color: "from-amber-100 to-yellow-100",
  },
  {
    id: "context",
    index: 5,
    weight: 15,
    emoji: "🧠",
    title: "Context Management & Reliability",
    summary:
      "Faits persistants, lost-in-the-middle, escalation, propagation erreurs, provenance.",
    keyConcepts: [
      "Progressive summarization perd chiffres/dates",
      "Lost-in-the-middle: clés au début + fin",
      "Trim tool outputs aux champs pertinents",
      "Escalation: demande explicite client > sentiment",
      "Self-confidence LLM mal calibré",
      "Erreur structurée > 'search unavailable' générique",
      "Provenance: claim → source URL + date publication",
    ],
    color: "from-rose-100 to-fuchsia-100",
  },
];

export const scenarios: Scenario[] = [
  {
    id: "support",
    emoji: "🛎️",
    title: "Customer Support Resolution Agent",
    description:
      "Agent traite retours, litiges, comptes. Tools MCP: get_customer, lookup_order, process_refund, escalate_to_human. Cible: 80%+ résolution premier contact.",
    domains: ["agentic", "tools", "context"],
  },
  {
    id: "codegen",
    emoji: "⚡",
    title: "Code Generation avec Claude Code",
    description:
      "Équipe utilise Claude Code: génération, refactor, debug, docs. Slash commands custom, CLAUDE.md, plan mode vs direct.",
    domains: ["claudecode", "context"],
  },
  {
    id: "research",
    emoji: "🔬",
    title: "Multi-Agent Research System",
    description:
      "Coordinateur délègue à sous-agents spécialisés (search web, analyse docs, synthèse, rapport). Production de rapports cités.",
    domains: ["agentic", "tools", "context"],
  },
  {
    id: "devprod",
    emoji: "🛠️",
    title: "Developer Productivity",
    description:
      "Agent aide ingénieurs: explorer codebases, comprendre legacy, générer boilerplate. Tools built-in (Read/Write/Bash/Grep/Glob) + serveurs MCP.",
    domains: ["tools", "claudecode", "agentic"],
  },
  {
    id: "cicd",
    emoji: "🚦",
    title: "Claude Code dans CI/CD",
    description:
      "Pipeline: review code auto, génération tests, feedback PR. Prompts actionnables, minimiser faux positifs.",
    domains: ["claudecode", "prompt"],
  },
  {
    id: "extraction",
    emoji: "📄",
    title: "Structured Data Extraction",
    description:
      "Extraction d'infos depuis docs non structurés, validation JSON schema, gestion edge cases, intégration downstream.",
    domains: ["prompt", "context"],
  },
];

export const sampleQuestions: SampleQuestion[] = [
  {
    id: 1,
    domainId: "agentic",
    scenarioId: "support",
    question:
      "Production: 12% des cas, l'agent skip get_customer et appelle lookup_order avec juste le nom client → comptes mal identifiés, refunds incorrects. Quelle correction la plus efficace ?",
    options: [
      "Prerequisite programmatique: bloque lookup_order et process_refund tant que get_customer n'a pas retourné un customerId vérifié",
      "Renforcer le system prompt: vérification client obligatoire avant ops sur commandes",
      "Few-shot: agent appelle toujours get_customer en premier, même si client donne details commande",
      "Routing classifier: analyse requête et active subset de tools selon type",
    ],
    correctIndex: 0,
    explanation:
      "Quand séquence d'outils est requise pour business logic critique (vérification identité avant refund), enforcement programmatique = garanties déterministes. Prompt et few-shot = compliance probabiliste, insuffisant si erreurs ont impact financier. Routing classifier traite disponibilité, pas ordre.",
    takeaway:
      "Règles strictes → hooks/gates programmatiques, jamais prompt seul.",
  },
  {
    id: 2,
    domainId: "tools",
    scenarioId: "support",
    question:
      "Logs: agent appelle get_customer pour requêtes orders ('check my order #12345') au lieu de lookup_order. Les deux ont descriptions minimales ('Retrieves customer/order information') et formats d'identifiants similaires. Première étape la plus efficace ?",
    options: [
      "Few-shot 5-8 exemples routing order-queries → lookup_order",
      "Étendre chaque description: input formats, exemples, edge cases, frontières vs tools similaires",
      "Layer routing qui parse input et pré-sélectionne le tool selon keywords/identifiers",
      "Consolider en un lookup_entity qui détermine le backend",
    ],
    correctIndex: 1,
    explanation:
      "Tool descriptions = mécanisme primaire de sélection LLM. Descriptions minimales = pas de contexte pour différencier. Étendre = root cause, low-effort high-leverage. Few-shot ajoute tokens sans fix root. Routing layer over-engineered. Consolider valide mais trop d'effort pour 'first step'.",
    takeaway:
      "Avant tout, écris des descriptions de tools détaillées et différenciées.",
  },
  {
    id: 3,
    domainId: "context",
    scenarioId: "support",
    question:
      "Agent: 55% résolution premier contact (cible 80%). Logs montrent escalation de cas simples (remplacement standard avec photo) mais tente cas complexes nécessitant exceptions policy. Comment améliorer la calibration d'escalation ?",
    options: [
      "Critères d'escalation explicites + few-shot dans system prompt: quand escalader vs résoudre",
      "Self-report confidence (1-10) avant chaque réponse, route auto humain si seuil bas",
      "Classifier séparé entraîné sur tickets historiques pour prédire escalation",
      "Sentiment analysis: escalade si frustration client dépasse seuil",
    ],
    correctIndex: 0,
    explanation:
      "Critères explicites + few-shot adresse root cause: frontières de décision floues. Réponse proportionnée avant ajouter infrastructure. Self-confidence LLM mal calibré. Classifier ML over-engineered avant essayer prompt. Sentiment ≠ complexité du cas.",
    takeaway:
      "Calibration via critères explicites + exemples. Pas de classifier ML prématuré.",
  },
  {
    id: 4,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Tu veux créer un /review slash command custom partagé avec toute l'équipe via le repo. Où le créer ?",
    options: [
      ".claude/commands/ dans le repo projet",
      "~/.claude/commands/ dans le home de chaque dev",
      "Dans CLAUDE.md à la racine du projet",
      "Dans .claude/config.json avec un array commands",
    ],
    correctIndex: 0,
    explanation:
      ".claude/commands/ = scope projet, version-controlled, dispo à tous au clone/pull. ~/.claude/commands/ = perso non partagé. CLAUDE.md = instructions, pas définitions de commands. .claude/config.json avec commands array n'existe pas dans Claude Code.",
    takeaway: "Slash commands partagés → .claude/commands/ dans le repo.",
  },
  {
    id: 5,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Mission: restructurer monolithe en microservices. Changements sur dizaines de fichiers, décisions sur boundaries de service et dépendances modules. Quelle approche ?",
    options: [
      "Plan mode: explorer codebase, comprendre dépendances, designer approche avant changes",
      "Direct execution incrémental, laisser implémentation révéler les boundaries",
      "Direct avec instructions upfront détaillant exactement chaque service",
      "Direct, switch plan mode seulement si complexité émerge",
    ],
    correctIndex: 0,
    explanation:
      "Plan mode = tâches complexes, multi-approches valides, décisions architecturales — exactement monolithe→microservices. Permet exploration sûre avant commit. Direct risque rework coûteux quand dépendances découvertes tard. Complexité ici déjà énoncée, pas émergente.",
    takeaway: "Plan mode pour L3+ architectural. Direct pour scope clair.",
  },
  {
    id: 6,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Codebase avec conventions distinctes: composants React (hooks), API handlers (async/await + error handling), DB models (repository pattern). Tests éparpillés (Button.test.tsx à côté de Button.tsx). Comment garantir auto-application des bonnes conventions ?",
    options: [
      "Fichiers .claude/rules/ avec frontmatter YAML paths glob (e.g. **/*.test.tsx)",
      "Tout consolider dans CLAUDE.md racine sous headers par zone, Claude infère section",
      "Skills .claude/skills/ par type de code avec conventions dans SKILL.md",
      "CLAUDE.md séparé dans chaque sous-dir avec conventions de la zone",
    ],
    correctIndex: 0,
    explanation:
      ".claude/rules/ + glob (e.g. **/*.test.tsx) = application auto par chemin, peu importe la dir — essentiel pour tests éparpillés. Headers = inférence non fiable. Skills = invocation manuelle/choix de Claude, contredit 'automatique'. CLAUDE.md sous-dir = dir-bound, ne couvre pas fichiers éparpillés.",
    takeaway:
      "Conventions cross-dir → .claude/rules/ glob, pas CLAUDE.md sous-dir.",
  },
  {
    id: 7,
    domainId: "agentic",
    scenarioId: "research",
    question:
      "Topic 'impact AI sur creative industries'. Sous-agents OK individuellement, mais rapport final couvre seulement visual arts (manque musique, écriture, film). Logs coordinateur: décomposition en 'AI digital art', 'AI graphic design', 'AI photography'. Root cause ?",
    options: [
      "Synthesis agent manque instructions pour identifier coverage gaps",
      "Décomposition coordinateur trop étroite — assignations sous-agents ne couvrent pas tous domaines",
      "Web search agent: queries pas assez exhaustives",
      "Document analysis filtre sources non-visuelles (relevance trop restrictif)",
    ],
    correctIndex: 1,
    explanation:
      "Logs coordinateur révèlent direct: décomposition réduite à visual arts (digital art, graphic design, photography), omet musique/écriture/film. Sous-agents font correctement leur scope assigné. Le problème = ce qui leur a été assigné. A/C/D blâment downstream qui marche dans son scope.",
    takeaway:
      "Décomposition coordinateur = risque #1 multi-agent. Couverture > précision sous-agents.",
  },
  {
    id: 8,
    domainId: "context",
    scenarioId: "research",
    question:
      "Web search subagent timeout. Comment faire remonter l'erreur au coordinateur pour permettre recovery intelligent ?",
    options: [
      "Erreur structurée: failure type, query tentée, partial results, alternatives",
      "Retry auto exponential backoff dans subagent, retourner 'search unavailable' générique après échec",
      "Catch timeout, retourner empty result set marqué success",
      "Propager exception au top-level handler qui termine le workflow",
    ],
    correctIndex: 0,
    explanation:
      "Erreur structurée donne au coordinateur ce qu'il faut pour décider — retry query modifiée, alternative, ou avancer avec partial. Generic status cache contexte. Empty=success supprime erreur, prévient recovery. Termination workflow = inutile quand recovery possible.",
    takeaway:
      "Erreurs sous-agents: failureType + attempt + partial + alternatives. Jamais 'failed'.",
  },
  {
    id: 9,
    domainId: "tools",
    scenarioId: "research",
    question:
      "Synthesis agent vérifie souvent claims via coordinateur → web search → re-synthesis: +2-3 round trips, +40% latence. 85% verifications = simple fact-check (dates, noms, stats), 15% = investigation profonde. Approche la plus efficace ?",
    options: [
      "Tool scoped verify_fact pour synthesis (lookups simples), complex via coordinateur",
      "Synthesis accumule besoins, return batch fin de pass au coordinateur",
      "Donner accès complet web search à synthesis pour gérer toute vérification direct",
      "Web search cache proactivement contexte extra autour de chaque source",
    ],
    correctIndex: 0,
    explanation:
      "A = least privilege: synthesis a juste ce qu'il faut pour 85% commun, pattern coordinateur préservé pour complexe. Batching = blocking deps si étapes synthesis dépendent de facts vérifiés tôt. C over-provision, viole separation of concerns. D speculative caching, ne peut prédire fiablement besoins.",
    takeaway:
      "Tools cross-rôle scopés pour cas fréquent. Coordinateur garde routing complexe.",
  },
  {
    id: 10,
    domainId: "claudecode",
    scenarioId: "cicd",
    question:
      'Pipeline: claude "Analyze this PR for security issues" hang indéfiniment. Logs: Claude Code attend input interactive. Comment fixer pour CI ?',
    options: [
      'Flag -p: claude -p "Analyze this PR for security issues"',
      "Variable env CLAUDE_HEADLESS=true",
      'Rediriger stdin: claude "..." < /dev/null',
      'Flag --batch: claude --batch "..."',
    ],
    correctIndex: 0,
    explanation:
      "-p (--print) = mode non-interactif documenté. Process prompt, output stdout, exit. CLAUDE_HEADLESS et --batch n'existent pas. Workarounds Unix ne traitent pas la syntaxe propre de Claude Code.",
    takeaway: "CI/CD Claude Code → toujours -p / --print.",
  },
  {
    id: 11,
    domainId: "prompt",
    scenarioId: "cicd",
    question:
      "Réduire coûts API. Deux workflows real-time: (1) check pre-merge bloquant (dev attend) et (2) rapport tech debt overnight pour review matin. Manager propose Message Batches API (50% économie) sur les deux. Évaluation ?",
    options: [
      "Batch pour rapports tech debt seulement, real-time pour pre-merge",
      "Switch les deux en batch avec polling de status",
      "Garder real-time pour les deux pour éviter problèmes d'ordering batch",
      "Switch les deux en batch avec timeout fallback real-time",
    ],
    correctIndex: 0,
    explanation:
      "Batch API: 50% économie MAIS jusqu'à 24h, pas de SLA latence. Inutilisable pour pre-merge bloquant. Idéal pour overnight. B: 'souvent rapide' inacceptable pour bloquant. C: ordering géré via custom_id (misconception). D: complexité inutile, fit chaque API à son use case.",
    takeaway:
      "Batch API = non-bloquant uniquement. custom_id corrèle req/resp.",
  },
  {
    id: 12,
    domainId: "prompt",
    scenarioId: "cicd",
    question:
      "PR modifie 14 fichiers. Review single-pass donne résultats incohérents: feedback détaillé sur certains, superficiel sur d'autres, bugs évidents manqués, contradictions (pattern flagué dans un fichier, approuvé identique ailleurs même PR). Comment restructurer ?",
    options: [
      "Splitter: passes per-fichier pour issues locales + pass séparé integration cross-fichier",
      "Forcer devs à splitter PR en submissions de 3-4 fichiers",
      "Switch modèle tier supérieur avec context window plus large",
      "3 passes indépendantes, flag seulement issues présentes dans 2/3",
    ],
    correctIndex: 0,
    explanation:
      "Splitter adresse root cause: dilution attention sur multi-fichiers. File-by-file = profondeur consistante, pass integration cross-fichier = issues data flow. B = shift burden au dev sans fix système. C = misconception (window plus large ≠ qualité attention). D supprime détection de vrais bugs en exigeant consensus sur issues parfois intermittentes.",
    takeaway:
      "Reviews larges → multi-pass per-fichier + integration. Pas de single-pass.",
  },
  {
    id: 13,
    domainId: "agentic",
    scenarioId: "support",
    question:
      "Tu implémentes la boucle agentique du support agent. Comment déterminer de façon fiable quand continuer à exécuter des tools vs terminer le tour ?",
    options: [
      "Continuer tant que stop_reason == 'tool_use', terminer quand stop_reason == 'end_turn'",
      "Cap arbitraire à 10 itérations max comme mécanisme d'arrêt principal",
      "Parser le texte de la réponse pour détecter des phrases de complétion ('I've resolved your issue')",
      "Terminer dès qu'un bloc de texte assistant apparaît dans la réponse",
    ],
    correctIndex: 0,
    explanation:
      "Le contrôle de flux de la boucle agentique repose sur stop_reason: 'tool_use' → exécuter les tools et reboucler, 'end_turn' → terminer. Cap d'itérations, parsing de langage naturel et détection de texte assistant sont les trois anti-patterns explicites du guide — signaux non déterministes qui cassent dès que la formulation du modèle change.",
    takeaway:
      "Boucle agentique pilotée par stop_reason, jamais par parsing de texte ou cap arbitraire.",
  },
  {
    id: 14,
    domainId: "agentic",
    scenarioId: "research",
    question:
      "Le coordinateur délègue au synthesis subagent. Malgré allowedTools incluant 'Task', le synthesis ne voit jamais les résultats du web search agent. Cause + fix ?",
    options: [
      "Les findings du web search doivent être inclus explicitement dans le prompt du synthesis — les sous-agents n'héritent pas du contexte du coordinateur",
      "Augmenter max_tokens du coordinateur pour que son contexte se propage aux sous-agents",
      "Les sous-agents partagent automatiquement la mémoire : c'est un bug transitoire, relancer l'invocation",
      "Ajouter le tool web_search aux allowedTools du synthesis pour qu'il refasse la recherche lui-même",
    ],
    correctIndex: 0,
    explanation:
      "Les sous-agents opèrent avec un contexte isolé : ils n'héritent pas de l'historique du coordinateur. Le contexte doit être passé explicitement dans le prompt du sous-agent (ex. passer les résultats web + analyse docs au synthesis). max_tokens ne propage rien. Refaire la recherche viole la séparation des rôles et duplique le travail.",
    takeaway:
      "Contexte sous-agent = explicite dans le prompt. Pas d'héritage automatique.",
  },
  {
    id: 15,
    domainId: "agentic",
    scenarioId: "support",
    question:
      "get_customer renvoie les dates en Unix epoch, lookup_order en ISO 8601, process_refund en codes de statut numériques. L'agent interprète mal les dates et statuts. Approche la plus fiable pour normaliser avant que le modèle traite les données ?",
    options: [
      "Hook PostToolUse qui normalise les formats hétérogènes (timestamps, status codes) avant que l'agent les traite",
      "Instruire dans le system prompt de toujours reconvertir chaque date en ISO avant de raisonner",
      "Ajouter un tool convert_date que l'agent doit penser à appeler après chaque lookup",
      "Few-shot montrant des exemples de conversion de chacun des trois formats",
    ],
    correctIndex: 0,
    explanation:
      "Un hook PostToolUse intercepte les résultats de tools et les transforme de façon déterministe avant que le modèle les voie — exactement le cas de la normalisation de formats hétérogènes. Prompt et few-shot = conformité probabiliste. Un tool de conversion dépend du modèle qui pense à l'appeler.",
    takeaway:
      "Normalisation de données entrantes → hook PostToolUse déterministe, pas prompt.",
  },
  {
    id: 16,
    domainId: "agentic",
    scenarioId: "devprod",
    question:
      "Mission 'ajouter des tests complets à un codebase legacy' : scope ouvert, dépendances inconnues, zones à risque inégales. Quelle stratégie de décomposition de tâche ?",
    options: [
      "Décomposition dynamique adaptative : mapper la structure, identifier les zones à fort impact, créer un plan priorisé qui s'adapte aux dépendances découvertes",
      "Prompt chaining fixe : un pipeline séquentiel prédéfini, identique pour chaque fichier",
      "Un seul prompt massif demandant tous les tests du codebase d'un coup",
      "Cap arbitraire de 5 fichiers par passe, traités dans l'ordre alphabétique",
    ],
    correctIndex: 0,
    explanation:
      "Une tâche ouverte dont les sous-tâches dépendent de ce qu'on découvre appelle une décomposition dynamique adaptative : mapper d'abord, prioriser le fort impact, adapter au fil des dépendances. Le prompt chaining fixe convient aux reviews prévisibles multi-aspects, pas à l'exploration ouverte. Un prompt unique dilue l'attention ; un cap arbitraire ignore l'impact réel.",
    takeaway:
      "Tâche ouverte → décomposition dynamique. Pipeline fixe → reviews prévisibles seulement.",
  },
  {
    id: 17,
    domainId: "agentic",
    scenarioId: "devprod",
    question:
      "Après une analyse complète d'un codebase, tu veux comparer deux stratégies de refactoring divergentes en repartant de la même baseline d'analyse. Quel mécanisme ?",
    options: [
      "fork_session pour créer des branches d'exploration indépendantes depuis la baseline d'analyse partagée",
      "--resume sur la même session nommée pour les deux stratégies, séquentiellement",
      "Démarrer deux sessions fraîches sans contexte et ré-analyser le codebase à chaque fois",
      "/compact puis poser les deux questions de refactoring dans le même tour",
    ],
    correctIndex: 0,
    explanation:
      "fork_session crée des branches indépendantes à partir d'une baseline partagée — idéal pour explorer des approches divergentes (deux stratégies de refactoring) sans que l'une pollue l'autre. --resume continue UNE conversation linéaire, donc les deux stratégies se contamineraient. Repartir de zéro gaspille l'analyse. /compact dans un seul tour mélange les deux explorations.",
    takeaway:
      "Branches divergentes depuis une baseline → fork_session. --resume = continuation linéaire.",
  },
  {
    id: 18,
    domainId: "tools",
    scenarioId: "support",
    question:
      "process_refund échoue parfois sur timeout service, parfois car montant > policy, parfois sur input invalide. Tous renvoient 'Operation failed'. L'agent retry tout, y compris les violations de policy. Quelle conception d'erreur ?",
    options: [
      "Métadonnées structurées : errorCategory (transient/validation/permission/business) + isRetryable boolean + description lisible",
      "Garder 'Operation failed' mais ajouter un retry automatique avec backoff sur toutes les erreurs",
      "Lever une exception qui termine la conversation dès la première erreur",
      "Renvoyer un résultat vide marqué success pour ne pas bloquer l'agent",
    ],
    correctIndex: 0,
    explanation:
      "Le flag MCP isError + errorCategory + isRetryable permet à l'agent de décider correctement : retry sur transient, explication au client sur business (retriable: false). Une erreur uniforme 'Operation failed' empêche toute décision de recovery appropriée. Retry universel gaspille des appels sur des violations non-retryables. Empty=success supprime l'erreur.",
    takeaway:
      "Erreurs MCP structurées : errorCategory + isRetryable. Jamais 'Operation failed' générique.",
  },
  {
    id: 19,
    domainId: "tools",
    scenarioId: "devprod",
    question:
      "L'équipe veut partager un serveur MCP GitHub (nécessitant un token) à tous les devs via le repo, sans committer le secret. Quelle configuration ?",
    options: [
      "Serveur dans .mcp.json projet avec expansion de variable d'environnement (${GITHUB_TOKEN}) pour le token",
      "Serveur dans le ~/.claude.json de chaque dev avec le token écrit en clair",
      "Token hardcodé directement dans le .mcp.json committé dans le repo",
      "Token placé dans une section 'secrets' du CLAUDE.md racine",
    ],
    correctIndex: 0,
    explanation:
      ".mcp.json projet = scope partagé via version control, disponible à tous au clone/pull. L'expansion ${GITHUB_TOKEN} référence une variable d'environnement sans committer le secret. ~/.claude.json est user-level (non partagé). Hardcoder le token dans un fichier committé = fuite de secret. CLAUDE.md ne configure pas de serveurs MCP.",
    takeaway:
      "MCP partagé + secret → .mcp.json projet + ${ENV_VAR}. Jamais de token committé.",
  },
  {
    id: 20,
    domainId: "tools",
    scenarioId: "devprod",
    question:
      "Tu explores un codebase inconnu pour tracer tous les appelants de la fonction refundOrder. Quel built-in tool et quelle approche ?",
    options: [
      "Grep pour chercher le contenu (les appels à refundOrder) à travers tout le codebase",
      "Glob avec un pattern de nom de fichier **/refundOrder* pour trouver les usages",
      "Read sur chaque fichier du repo, un par un, jusqu'à tomber sur les appels",
      "Edit en mode recherche pour localiser les correspondances de refundOrder",
    ],
    correctIndex: 0,
    explanation:
      "Grep cible la recherche de CONTENU (motifs dans le code : appels de fonction, messages d'erreur, imports) — exactement le cas pour trouver tous les appelants. Glob ne matche que des CHEMINS de fichiers, pas le contenu. Lire tout le repo gaspille le contexte. Edit modifie, il ne sert pas à explorer.",
    takeaway:
      "Contenu → Grep. Chemin de fichier → Glob. Ne pas tout lire d'avance.",
  },
  {
    id: 21,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Un nouveau membre de l'équipe ne reçoit pas les standards de code que tout le monde applique. Tu les avais placés dans ~/.claude/CLAUDE.md. Diagnostic + fix ?",
    options: [
      "~/.claude/CLAUDE.md est user-level, non partagé via version control — déplacer les standards dans le CLAUDE.md projet",
      "Le nouveau dev doit lancer /compact pour charger les standards manquants",
      "Les standards doivent rester en user-level : lui demander de recopier le fichier à la main",
      "Augmenter la priorité du fichier user-level pour qu'il se propage à l'équipe",
    ],
    correctIndex: 0,
    explanation:
      "La hiérarchie CLAUDE.md : user-level (~/.claude/CLAUDE.md) ne s'applique qu'à cet utilisateur et n'est PAS partagé par version control. Les standards d'équipe doivent vivre au niveau projet (.claude/CLAUDE.md ou racine), versionné et disponible à tous au clone. /compact gère le contexte, pas la config. La priorité ne change pas le partage.",
    takeaway:
      "Standards d'équipe → CLAUDE.md projet (versionné). user-level = perso, non partagé.",
  },
  {
    id: 22,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Claude interprète de façon incohérente une description en prose d'une transformation de données. Quelle technique communique le plus efficacement le résultat attendu ?",
    options: [
      "Fournir 2-3 exemples concrets entrée/sortie de la transformation",
      "Réécrire la description en prose, plus détaillée et plus longue",
      "Ajouter 'sois précis et rigoureux' au system prompt",
      "Baisser la température du modèle pour réduire la variance",
    ],
    correctIndex: 0,
    explanation:
      "Des exemples concrets entrée/sortie sont le moyen le plus efficace de communiquer une transformation quand la prose est interprétée de façon incohérente — ils montrent le contrat exact au lieu de le décrire. Plus de prose reste ambigu. 'Sois précis' n'ancre rien de concret. La température réduit la variance mais ne clarifie pas l'intention.",
    takeaway:
      "Transformation ambiguë → exemples I/O concrets, pas plus de prose.",
  },
  {
    id: 23,
    domainId: "prompt",
    scenarioId: "cicd",
    question:
      "La review CI génère trop de faux positifs sur les commentaires de code, érodant la confiance des devs. Tu as déjà essayé 'sois conservateur, ne signale que les findings haute confiance' — sans effet. Meilleure approche ?",
    options: [
      "Critères explicites et catégoriels : 'signale un commentaire uniquement quand le comportement décrit contredit le comportement réel du code'",
      "Renforcer 'sois conservateur' et ajouter 'uniquement très haute confiance'",
      "Demander un score de confiance auto-reporté et filtrer sous un seuil",
      "Passer à un modèle de tier supérieur pour réduire les faux positifs",
    ],
    correctIndex: 0,
    explanation:
      "Des critères explicites et catégoriels ('contredit le comportement réel' vs 'vérifie que les commentaires sont exacts') améliorent la précision là où 'sois conservateur' / 'haute confiance' échouent — ces formulations vagues ne donnent pas de frontière de décision. Le score de confiance LLM est mal calibré. Un meilleur modèle ne corrige pas des critères flous.",
    takeaway:
      "Réduire les faux positifs → critères explicites catégoriels, pas 'sois conservateur'.",
  },
  {
    id: 24,
    domainId: "prompt",
    scenarioId: "extraction",
    question:
      "Pipeline d'extraction : le modèle gère mal les documents aux structures variées (citations inline vs bibliographies) et hallucine des champs absents. Les instructions détaillées seules donnent des résultats incohérents. Quelle technique ?",
    options: [
      "2-4 exemples few-shot montrant l'extraction correcte sur des structures de documents variées",
      "Une instruction unique très détaillée listant tous les formats possibles",
      "Augmenter max_tokens pour donner plus d'espace de raisonnement au modèle",
      "Demander au modèle de deviner les champs manquants à partir du contexte",
    ],
    correctIndex: 0,
    explanation:
      "Les exemples few-shot sont la technique la plus efficace pour un output cohérent quand les instructions seules échouent : ils démontrent la gestion des cas ambigus et permettent au modèle de généraliser aux structures variées tout en réduisant l'hallucination. Plus d'instructions reste abstrait. max_tokens ne change pas la qualité. Deviner les champs = fabrication.",
    takeaway:
      "Structures variées + hallucination → 2-4 exemples few-shot ciblés.",
  },
  {
    id: 25,
    domainId: "prompt",
    scenarioId: "extraction",
    question:
      "Ton extraction produit parfois du JSON malformé (erreurs de syntaxe) qui casse l'intégration downstream. Approche la plus fiable pour garantir un output conforme au schéma ?",
    options: [
      "tool_use avec un JSON schema en paramètre, extraire les données de la réponse tool_use — élimine les erreurs de syntaxe",
      "Demander dans le prompt 'réponds uniquement en JSON valide' puis valider après coup",
      "Few-shot avec plusieurs exemples de JSON bien formé",
      "Post-traiter la sortie texte avec un parser tolérant aux erreurs",
    ],
    correctIndex: 0,
    explanation:
      "tool_use avec un JSON schema strict est l'approche la plus fiable pour un output schema-conforme : il élimine les erreurs de syntaxe par construction. Une instruction prose + validation reste probabiliste. Few-shot réduit sans garantir. Un parser tolérant masque le problème au lieu de l'éliminer. (À noter : tool_use élimine la syntaxe, pas les erreurs sémantiques comme des totaux qui ne s'additionnent pas.)",
    takeaway:
      "Output structuré garanti → tool_use + JSON schema. Élimine la syntaxe, pas la sémantique.",
  },
  {
    id: 26,
    domainId: "prompt",
    scenarioId: "extraction",
    question:
      "Une extraction échoue à la validation. Tu mets en place un retry-avec-feedback (document + extraction ratée + erreur de validation). Dans quel cas ce retry échouera-t-il quoi qu'il arrive ?",
    options: [
      "Quand l'information requise est simplement absente du document source",
      "Quand l'extraction a une erreur de format (date au mauvais format)",
      "Quand l'erreur est un placement de valeur dans le mauvais champ",
      "Quand un champ obligatoire a été laissé vide alors qu'il existe dans le doc",
    ],
    correctIndex: 0,
    explanation:
      "Le retry-avec-feedback corrige les erreurs de format, de structure et de placement — le modèle s'auto-corrige avec l'erreur en contexte. Mais il est inutile quand l'information n'existe pas dans la source : aucun feedback ne fait apparaître une donnée absente. Il faut alors un champ nullable, pas un retry. Les autres cas sont tous résolubles par retry.",
    takeaway:
      "Retry inutile si l'info est absente de la source. Utile pour format/structure/placement.",
  },
  {
    id: 27,
    domainId: "context",
    scenarioId: "support",
    question:
      "Session support longue, multi-tours. Après résumé progressif, l'agent oublie le montant exact du refund promis et la date limite annoncée au client. Comment préserver ces faits transactionnels ?",
    options: [
      "Extraire les faits transactionnels (montants, dates, n° commande, statuts) dans un bloc 'case facts' persistant, inclus dans chaque prompt hors historique résumé",
      "Désactiver le résumé progressif et conserver tout l'historique verbeux",
      "Placer ces faits au milieu de l'historique pour qu'ils restent accessibles",
      "Demander au client de répéter le montant et la date à chaque tour",
    ],
    correctIndex: 0,
    explanation:
      "Le résumé progressif condense justement les valeurs critiques (montants, dates, attentes client) en vague. La parade : extraire ces faits dans un bloc 'case facts' persistant, ré-injecté dans chaque prompt en dehors de l'historique résumé. Tout garder explose le contexte. Mettre les faits au milieu déclenche le lost-in-the-middle. Faire répéter le client dégrade l'expérience.",
    takeaway:
      "Faits critiques → bloc 'case facts' persistant hors résumé. Pas au milieu (lost-in-the-middle).",
  },
  {
    id: 28,
    domainId: "context",
    scenarioId: "devprod",
    question:
      "Session d'exploration de codebase longue. L'agent commence à donner des réponses incohérentes et référence des 'patterns typiques' au lieu des classes spécifiques découvertes plus tôt. Quelle technique contre cette dégradation de contexte ?",
    options: [
      "Faire maintenir à l'agent un fichier scratchpad des findings clés et l'y référer pour les questions suivantes",
      "Continuer en espérant que le modèle se souvienne, en baissant la température",
      "Tout recharger en relisant chaque fichier du codebase à nouveau",
      "Augmenter max_tokens pour étendre la fenêtre de contexte",
    ],
    correctIndex: 0,
    explanation:
      "Le signe ('patterns typiques' au lieu de classes spécifiques) est la dégradation de contexte en session longue. Un fichier scratchpad persiste les findings clés à travers les frontières de contexte et sert de référence fiable. Espérer / baisser la température ne persiste rien. Tout relire gaspille. max_tokens ne corrige pas la dégradation d'attention.",
    takeaway:
      "Dégradation de contexte longue → scratchpad de findings clés (ou subagents / /compact).",
  },
  {
    id: 29,
    domainId: "context",
    scenarioId: "extraction",
    question:
      "Ton extraction affiche 97% de précision globale. Avant d'automatiser et de réduire la review humaine, quel risque et quelle vérification ?",
    options: [
      "La métrique agrégée peut masquer une mauvaise perf sur certains types de docs / champs — analyser la précision par type de document et par champ",
      "97% suffit : automatiser entièrement et supprimer la review humaine",
      "N'échantillonner que les extractions basse confiance, ignorer les hautes",
      "Monter le seuil de confiance global à 99% sans segmenter par type",
    ],
    correctIndex: 0,
    explanation:
      "Une précision agrégée (97%) peut masquer une mauvaise performance sur un type de document ou un champ précis. Avant d'automatiser, il faut valider la précision segmentée par type de doc et par champ, et faire de l'échantillonnage aléatoire stratifié sur les hautes confiances pour détecter des patterns d'erreur nouveaux. Automatiser sur l'agrégat, ignorer les hautes confiances ou monter un seuil global ignorent la variance par segment.",
    takeaway:
      "Métrique agrégée masque la variance. Valider par type de doc + champ avant d'automatiser.",
  },
  {
    id: 30,
    domainId: "context",
    scenarioId: "research",
    question:
      "Deux sources crédibles donnent des statistiques différentes pour la même métrique. Le synthesis agent doit produire le rapport. Comment gérer le conflit ?",
    options: [
      "Annoter le conflit en préservant les deux valeurs avec leur attribution de source, et structurer le rapport pour distinguer findings établis vs contestés",
      "Choisir arbitrairement la valeur de la source qui paraît la plus récente",
      "Faire la moyenne des deux statistiques pour produire une valeur unique",
      "Omettre la métrique conflictuelle du rapport pour éviter la confusion",
    ],
    correctIndex: 0,
    explanation:
      "Face à des statistiques conflictuelles de sources crédibles, on annote le conflit avec attribution de source (et dates de publication pour ne pas confondre écart temporel et contradiction) plutôt que de trancher arbitrairement. Le rapport distingue alors findings bien établis et contestés. Choisir au hasard, moyenner ou omettre détruisent l'information de provenance et peuvent induire en erreur.",
    takeaway:
      "Conflit de sources → annoter les deux valeurs + provenance. Jamais trancher/moyenner/omettre.",
  },
];

export const inScope: ScopeItem[] = [
  {
    title: "Agentic & Multi-agent",
    items: [
      "Boucle agentique: stop_reason, tool result, terminaison",
      "Coordinateur-subagent, décomposition, parallèle, refinement",
      "Context passing explicite, manifests, crash recovery",
    ],
  },
  {
    title: "Tools & MCP",
    items: [
      "Descriptions tools, splitting/consolidation, naming",
      "Resources catalogues, tools actions, qualité description",
      "MCP scope project/user, env vars, multi-server simultané",
      "Erreurs structurées: transient/business/permission, recovery local",
    ],
  },
  {
    title: "Claude Code",
    items: [
      "CLAUDE.md hiérarchie, @import, .claude/rules/ + globs",
      "Commands & skills: scope, context: fork, allowed-tools, argument-hint",
      "Plan mode vs direct execution",
      "Refinement: I/O examples, test-driven, interview, parallel/sequential",
    ],
  },
  {
    title: "Output & Prompt",
    items: [
      "tool_use + JSON schema, tool_choice, nullable",
      "Few-shot ambigu, format, false positive reduction",
      "Batch API, latency tolerance, custom_id failure handling",
    ],
  },
  {
    title: "Context & Reliability",
    items: [
      "Trim outputs, fact extraction, position-aware ordering",
      "Confidence calibration, stratified sampling, segmentation",
      "Provenance: claim-source, temporal, conflits, coverage gaps",
      "Escalation: critères explicites, préférences client, policy gaps",
    ],
  },
];

export const outOfScope: ScopeItem[] = [
  {
    title: "Hors-scope (n'apparaîtra PAS)",
    items: [
      "Fine-tuning Claude / training modèles custom",
      "Auth, billing, account management API",
      "Implémentation détaillée langages/frameworks",
      "Déploiement / hosting MCP servers (infra, networking)",
      "Architecture interne Claude, training process, weights",
      "Constitutional AI, RLHF, safety training",
      "Embeddings, vector DB implementation",
      "Computer use (browser/desktop automation)",
      "Vision / image analysis",
      "Streaming API, server-sent events",
      "Rate limits, quotas, pricing API",
      "OAuth, rotation API key, protocoles auth",
      "Configs cloud spécifiques (AWS/GCP/Azure)",
      "Benchmarks performance, comparaison modèles",
      "Détails implementation prompt caching",
      "Tokenization, algorithmes counting tokens",
    ],
  },
];

export const prepSteps: PrepStep[] = [
  {
    step: 1,
    emoji: "🤖",
    title: "Build un agent avec Agent SDK",
    description:
      "Boucle agentique complète: tool calling, error handling, sessions. Spawn sous-agents, passer contexte.",
  },
  {
    step: 2,
    emoji: "💻",
    title: "Configure Claude Code sur un vrai projet",
    description:
      "CLAUDE.md hiérarchie, .claude/rules/ path-spécifiques, skills avec frontmatter (context: fork, allowed-tools), au moins un MCP server.",
  },
  {
    step: 3,
    emoji: "🔧",
    title: "Design + test MCP tools",
    description:
      "Descriptions différenciantes pour tools similaires. Erreurs structurées (categories, retryable). Tester sélection sur requêtes ambiguës.",
  },
  {
    step: 4,
    emoji: "📄",
    title: "Pipeline d'extraction structurée",
    description:
      "tool_use + JSON schemas, validation/retry, schemas optional/nullable, batch processing via Message Batches API.",
  },
  {
    step: 5,
    emoji: "✍️",
    title: "Prompt engineering",
    description:
      "Few-shot pour ambigus. Critères review explicites pour réduire faux positifs. Architectures multi-pass review.",
  },
  {
    step: 6,
    emoji: "🧠",
    title: "Patterns context management",
    description:
      "Extraire faits structurés depuis outputs verbeux. Scratchpad files sessions longues. Subagent delegation pour limites contexte.",
  },
  {
    step: 7,
    emoji: "🚦",
    title: "Escalation & human-in-the-loop",
    description:
      "Quand escalader (policy gaps, demandes client, blocage progression) vs résoudre. Workflows review humain avec routing par confidence.",
  },
  {
    step: 8,
    emoji: "📝",
    title: "Practice exam officiel",
    description:
      "Avant le vrai exam: practice exam (lien fourni séparément). Mêmes scénarios, format, explications.",
  },
];

export const keyPatterns: { emoji: string; title: string; rule: string }[] = [
  {
    emoji: "🔒",
    title: "Enforcement programmatique > prompt",
    rule: "Règle stricte (verif identité avant refund) → hooks/gates. Prompt = compliance probabiliste.",
  },
  {
    emoji: "📝",
    title: "Tool descriptions = signal #1",
    rule: "Descriptions vagues = misroute. Fix descriptions AVANT few-shot ou consolidation.",
  },
  {
    emoji: "🎯",
    title: "Décomposition coordinateur = risque #1",
    rule: "Sous-agents corrects ≠ rapport complet. Le scope assigné fait la couverture.",
  },
  {
    emoji: "📡",
    title: "Erreurs structurées",
    rule: "errorCategory + isRetryable + attempt + partial. Jamais 'failed' générique.",
  },
  {
    emoji: "🗺️",
    title: "Plan mode triggers",
    rule: "Architectural / multi-fichiers / multi-approches valides. Direct = scope clair.",
  },
  {
    emoji: "🧱",
    title: "tool_use = pas de syntax error",
    rule: "JSON schema strict élimine syntax. Erreurs sémantiques (sums, fields) restent.",
  },
  {
    emoji: "⏱️",
    title: "Batch API ≠ bloquant",
    rule: "50% économie, jusqu'à 24h, pas de SLA. Overnight OK, pre-merge NO.",
  },
  {
    emoji: "👁️",
    title: "Self-review faible",
    rule: "Même session retient reasoning. Instance indépendante > self-review instructions.",
  },
  {
    emoji: "🌳",
    title: ".claude/rules/ globs > sous-dir CLAUDE.md",
    rule: "Conventions cross-tree (e.g. *.test.tsx) → globs. CLAUDE.md = dir-bound.",
  },
];
