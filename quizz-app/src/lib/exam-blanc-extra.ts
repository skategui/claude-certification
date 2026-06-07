import type { AntiPattern, SampleQuestion } from "./exam-blanc";

// Generated from the Claude Certified Architect domain + anti-patterns pages
// (claudecertifications.com). Editable study/practice data — rework freely.

export const antiPatterns: AntiPattern[] = [
  {
    id: 1,
    title: "Parsing natural language for loop termination",
    severity: "critical",
    domainId: "agentic",
    trap: "Parse the model's natural-language text output to decide whether the agentic loop should stop",
    correct:
      "Check the structured stop_reason field (tool_use vs end_turn) to drive loop control",
    why: "Text content is for the user, not control flow; the model phrases completion differently each time, while stop_reason is deterministic",
  },
  {
    id: 2,
    title: "Arbitrary iteration caps as primary stopping mechanism",
    severity: "critical",
    domainId: "agentic",
    trap: "Use a fixed iteration count (e.g. stop after 10 loops) as the primary stopping mechanism",
    correct:
      "Let the agentic loop terminate naturally via stop_reason based on task state",
    why: "An arbitrary cap can cut the agent off mid-task or let it loop pointlessly; it does not reflect actual task completion",
  },
  {
    id: 3,
    title: "Prompt-based enforcement for critical business rules",
    severity: "critical",
    domainId: "agentic",
    trap: "Enforce critical business rules by writing instructions in the prompt",
    correct:
      "Use programmatic hooks (PreToolUse for blocking, PostToolUse for normalization) for deterministic enforcement",
    why: "Prompts are probabilistic and the model can and will sometimes ignore critical instructions; hooks run as code with 100% reliable enforcement",
  },
  {
    id: 4,
    title: "Sentiment-based escalation to human agents",
    severity: "high",
    domainId: "agentic",
    trap: "Escalate to a human agent based on customer sentiment (the customer sounds angry)",
    correct:
      "Escalate based on policy gaps, capability limits, explicit requests, or business thresholds",
    why: "Sentiment does not equal task complexity; an angry customer with a simple request does not need a human",
  },
  {
    id: 5,
    title: "Self-reported confidence scores for decision-making",
    severity: "high",
    domainId: "agentic",
    trap: "Use the model's self-reported confidence score to drive production escalation decisions",
    correct:
      "Use structured criteria and programmatic checks based on observable facts",
    why: "Model confidence scores are not well-calibrated and cannot be relied upon for production decisions",
  },
  {
    id: 6,
    title: "Generic error messages ('Operation failed')",
    severity: "critical",
    domainId: "tools",
    trap: "Return generic error strings like 'Operation failed' from a tool",
    correct:
      "Return structured errors with isError, errorCategory, isRetryable, and context",
    why: "Without details the agent cannot decide whether to retry, try an alternative, or escalate",
  },
  {
    id: 7,
    title: "Silently returning empty results for access failures",
    severity: "critical",
    domainId: "tools",
    trap: "Return an empty result set when the tool could not even perform the lookup (e.g. an access failure)",
    correct:
      "Distinguish access failures (isError: true) from genuinely empty results (isError: false, results: [])",
    why: "The agent thinks 'no results found' when the real problem is 'could not even check', causing catastrophic misunderstandings",
  },
  {
    id: 8,
    title: "Giving one agent 18+ tools",
    severity: "high",
    domainId: "tools",
    trap: "Load a single agent with a large tool set of 18+ tools",
    correct:
      "Keep 4-5 tools per agent and distribute the rest across specialized subagents",
    why: "Tool selection accuracy degrades rapidly above 5 tools and similar tools create ambiguity",
  },
  {
    id: 9,
    title: "Hardcoding API keys in .mcp.json configuration",
    severity: "critical",
    domainId: "tools",
    trap: "Hardcode API keys and secrets directly in the .mcp.json configuration file",
    correct: "Use ${ENV_VAR} environment variable expansion in the MCP config",
    why: "Configuration files are committed to git, so hardcoded secrets get leaked",
  },
  {
    id: 10,
    title: "Putting personal preferences in project-level CLAUDE.md",
    severity: "medium",
    domainId: "claudecode",
    trap: "Put personal preferences (editor settings, themes) in the project-level .claude/CLAUDE.md",
    correct:
      "Use ~/.claude/CLAUDE.md for personal prefs and .claude/CLAUDE.md for team standards",
    why: "Personal preferences should not be imposed on the whole team; each config layer has a specific audience",
  },
  {
    id: 11,
    title: "Using commands for complex tasks that need context isolation",
    severity: "high",
    domainId: "claudecode",
    trap: "Use slash commands for complex tasks that require context isolation",
    correct: "Use skills with context: fork and allowed-tools restrictions",
    why: "Commands run in the current session context, polluting it with exploration noise",
  },
  {
    id: 12,
    title: "Same-session self-review in CI/CD pipelines",
    severity: "critical",
    domainId: "claudecode",
    trap: "Have the same session both generate code and review it in a CI/CD pipeline",
    correct: "Use separate sessions for code generation and code review",
    why: "The reviewer retains the generator's reasoning context, creating confirmation bias",
  },
  {
    id: 13,
    title: "Vague instructions like 'be thorough' or 'find all issues'",
    severity: "critical",
    domainId: "prompt",
    trap: "Give vague instructions such as 'be thorough' or 'find all issues'",
    correct:
      "Provide explicit, measurable criteria such as 'flag functions exceeding 50 lines'",
    why: "Vague instructions cause over-flagging, false positives, and alert fatigue so developers stop trusting the tool",
  },
  {
    id: 14,
    title: "Assuming tool_use guarantees semantic correctness",
    severity: "high",
    domainId: "prompt",
    trap: "Assume a successful tool_use means the extracted values are semantically correct",
    correct:
      "Validate extracted values after tool_use with business rule checks",
    why: "tool_use guarantees structure only; the values inside the JSON may still be wrong",
  },
  {
    id: 15,
    title: "Generic retry messages: 'There were errors, please try again'",
    severity: "high",
    domainId: "prompt",
    trap: "Send generic retry prompts like 'There were errors, please try again'",
    correct:
      "Append specific error details: which field, what was wrong, expected vs actual",
    why: "Without specific error details the model has no signal for what to fix",
  },
  {
    id: 16,
    title: "Progressive summarization of critical customer details",
    severity: "critical",
    domainId: "context",
    trap: "Progressively summarize context that contains critical customer details",
    correct:
      "Use immutable 'case facts' blocks positioned at the start of context",
    why: "Each round of summarization loses specifics like names, IDs, amounts, and dates",
  },
  {
    id: 17,
    title: "Aggregate accuracy metrics only (e.g., '95% overall')",
    severity: "critical",
    domainId: "context",
    trap: "Track only aggregate accuracy metrics such as '95% overall'",
    correct: "Track accuracy per document type using stratified metrics",
    why: "Aggregate metrics mask per-category failures (invoices at 70% while receipts at 99% still averages 95%)",
  },
  {
    id: 18,
    title: "No provenance tracking for multi-agent data",
    severity: "high",
    domainId: "context",
    trap: "Do not track provenance for data produced by multiple agents",
    correct:
      "Track source, confidence level, timestamp, and agent ID for all data",
    why: "When subagents provide conflicting data there is no way to determine which source to trust",
  },
];

export const extraQuestions: SampleQuestion[] = [
  {
    id: 31,
    domainId: "agentic",
    scenarioId: "research",
    question:
      "Dans un système hub-and-spoke où un coordinateur délègue à un market_researcher et un tech_analyst, comment devez-vous passer le contexte à chaque subagent ?",
    options: [
      "Transmettre l'historique complet de conversation du coordinateur à chaque subagent pour qu'il dispose de toute l'information",
      "Découper en sous-tâches extrêmement étroites et nombreuses pour que chaque subagent ne voie presque rien",
      "Passer à chaque subagent uniquement le contexte spécifique à sa sous-tâche assignée",
      "Ne fournir aucun contexte explicite car les subagents héritent automatiquement des connaissances du coordinateur",
    ],
    correctIndex: 2,
    explanation:
      "La règle de passage de contexte impose de ne transmettre que le contexte propre à la sous-tâche : l'isolation de contexte économise des tokens et évite de noyer le subagent. Partager l'historique complet (option 0) est le anti-pattern de pollution de contexte (90% non pertinent). Le découpage trop étroit crée des lacunes de couverture, et les subagents n'héritent jamais implicitement du contexte — il faut le fournir explicitement.",
    takeaway:
      "Chaque subagent ne reçoit que le contexte de sa sous-tâche, jamais l'historique complet du coordinateur.",
  },
  {
    id: 32,
    domainId: "tools",
    scenarioId: "support",
    question:
      "Un outil `lookup_customer` ne parvient pas a joindre la base de donnees (timeout) lors d'une recherche client : que doit renvoyer l'outil a l'agent ?",
    options: [
      "Un tableau vide `[]` avec `isError: false`, puisque aucun client n'a ete trouve",
      'Une reponse structuree avec `isError: true`, `errorCategory: "timeout"`, `isRetryable: true` et un champ `context`',
      'Un message generique `"Operation failed"` sans champs structures',
      "Une chaine vide pour laisser l'agent supposer qu'il n'y a aucun client",
    ],
    correctIndex: 1,
    explanation:
      "Une panne d'acces (la recherche n'a PAS ete effectuee) doit renvoyer `isError: true` avec `errorCategory`, `isRetryable` et `context`, pour que l'agent puisse reessayer ou escalader. Renvoyer `[]`/`isError: false` confond panne d'acces et resultat vide (anti-pattern le plus teste : l'agent croirait qu'aucun client n'existe), et `\"Operation failed\"` masque le contexte utile.",
    takeaway:
      "Panne d'acces = `isError: true`; resultat vide reel = `isError: false` : ne jamais maquiller une panne en tableau vide.",
  },
  {
    id: 33,
    domainId: "tools",
    scenarioId: "support",
    question:
      "Un agent de support unique dispose de 18 outils et choisit regulierement le mauvais (`search_customers` vs `find_customer` vs `lookup_user`) : quelle est la meilleure correction selon les bonnes pratiques ?",
    options: [
      'Forcer `tool_choice: "any"` pour obliger l\'agent a toujours utiliser un outil',
      "Supprimer les descriptions des outils pour economiser du contexte",
      "Repartir les outils en 3-4 sous-agents specialises de 4-5 outils chacun derriere un coordinateur",
      "Ajouter encore plus d'outils pour couvrir tous les cas possibles",
    ],
    correctIndex: 2,
    explanation:
      "La qualite de selection se degrade au-dela de ~4-5 outils par agent et les outils quasi-dupliques creent de l'ambiguite ; la solution est de scoper les outils dans des sous-agents specialises (Customer/Order/Communication) derriere un coordinateur. `tool_choice: \"any\"` force seulement l'usage d'un outil sans resoudre l'ambiguite, supprimer les descriptions enleve la documentation que le modele utilise pour choisir, et ajouter des outils aggrave le probleme.",
    takeaway:
      "4-5 outils par agent : distribuer dans des sous-agents specialises, ne pas entasser ni masquer les descriptions.",
  },
  {
    id: 34,
    domainId: "claudecode",
    scenarioId: "codegen",
    question:
      "Pour outiller votre équipe avec une procédure de refactoring multi-fichiers qui explore tout le code mais ne doit ni polluer la session principale ni écrire au-delà de Read/Edit/Grep, quelle configuration Claude Code choisissez-vous ?",
    options: [
      "Une slash command dans .claude/commands/refactor.md décrivant le refactoring, car elle est partageable via git",
      "Un skill .claude/skills/refactor/SKILL.md avec frontmatter context: fork et allowed-tools: [Read, Edit, Grep]",
      "Un skill SKILL.md avec context: fork mais sans allowed-tools, pour laisser Claude utiliser tous les outils",
      "Une règle dans .claude/rules/ avec un glob paths ciblant les fichiers à refactorer",
    ],
    correctIndex: 1,
    explanation:
      "Une tâche complexe exigeant isolation de contexte ET restriction d'outils appelle un skill : context: fork isole l'exploration de la session principale et allowed-tools borne l'accès. La slash command (option 0) tourne dans le contexte courant sans isolation — c'est l'anti-pattern exact du SKILL.md de la page. Le skill sans allowed-tools (option 2) est l'anti-pattern 'overly broad tool access', et une règle .claude/rules/ (option 3) configure du contexte, elle n'exécute pas une procédure.",
    takeaway:
      "Isolation ou restriction d'outils requise = skill avec context: fork + allowed-tools, jamais une command.",
  },
  {
    id: 35,
    domainId: "claudecode",
    scenarioId: "cicd",
    question:
      "Dans un pipeline GitHub Actions qui demande à Claude de relire chaque diff de pull request avant merge, comment configurez-vous la revue pour obtenir un avis non biaisé et automatisable ?",
    options: [
      "Réutiliser la session qui a généré le code pour relire le diff, afin que le relecteur garde tout le raisonnement",
      "Lancer claude -p sur le diff dans une session séparée de la génération, avec --output-format json",
      "Lancer Claude en mode interactif dans le job CI pour pouvoir poser des questions de suivi",
      "Soumettre la revue via la Message Batches API pour économiser 50 % sur chaque PR",
    ],
    correctIndex: 1,
    explanation:
      "Le relecteur doit tourner dans une session totalement séparée du générateur (claude -p, fresh) avec --output-format json pour parser le résultat : un relecteur sans contexte de génération donne un avis non biaisé. Réutiliser la session de génération (option 0) crée un biais de confirmation, le mode interactif (option 2) est interdit en CI, et la Batch API (option 3) avec sa fenêtre de 24 h ne convient pas à une revue de PR bloquante.",
    takeaway:
      "En CI : -p + --output-format json, et toujours isoler la session du relecteur de celle du générateur.",
  },
  {
    id: 36,
    domainId: "prompt",
    scenarioId: "extraction",
    question:
      'Votre pipeline force `tool_choice={"type":"tool","name":"extract_invoice"}` et le JSON respecte toujours le schéma, mais certaines factures ressortent avec le mauvais montant total : quelle action corrige réellement le problème ?',
    options: [
      "Valider le contenu extrait contre les règles métier après l'appel, car tool_use garantit la structure mais pas la justesse sémantique",
      "Considérer que tool_use élimine le besoin de validation puisque le schéma JSON est respecté",
      "Basculer sur `tool_choice: \"auto\"` pour laisser Claude décider d'appeler ou non l'outil",
      "Ajouter six exemples few-shot supplémentaires pour fiabiliser l'extraction des montants",
    ],
    correctIndex: 0,
    explanation:
      "tool_use garantit la conformité STRUCTURELLE (champs requis, types, enums valides) mais PAS la justesse sémantique : un montant peut être faux tout en étant un JSON valide, d'où la validation post-extraction. Croire que tool_use supprime la validation est l'anti-pattern exact du domaine ; `tool_choice: auto` retire la garantie d'invocation et n'adresse pas la sémantique ; au-delà de 4-6 exemples le few-shot ne fait que gonfler le prompt sans bénéfice proportionnel.",
    takeaway:
      "tool_use garantit la structure, jamais le contenu : valide toujours la sémantique après extraction.",
  },
  {
    id: 37,
    domainId: "prompt",
    scenarioId: "cicd",
    question:
      "Votre scan de conformité nocturne extrait des données via une boucle validation-retry, mais après un échec vous renvoyez seulement « des erreurs ont été détectées, réessaie » sans que le modèle ne se corrige : que faut-il changer ?",
    options: [
      "Ajouter au prompt de retry les erreurs spécifiques (« total des lignes 450 $ ≠ sous-total 500 $, le champ taxe contient 10 % au lieu d'un montant »)",
      "Garder le message générique mais augmenter le nombre maximal de tentatives de la boucle",
      "Demander à la même session de relire et corriger sa propre sortie après l'échec",
      "Augmenter la température du modèle pour qu'il explore d'autres extractions au prochain essai",
    ],
    correctIndex: 0,
    explanation:
      "Le principe clé des boucles validation-retry est un feedback d'erreur SPÉCIFIQUE et non générique : il faut décrire quel champ est faux et la valeur attendue vs obtenue pour que le modèle se corrige. Le retry générique est l'anti-pattern listé sur la page ; l'auto-relecture en même session retient le contexte de raisonnement et crée un biais (faire en sessions séparées) ; jouer sur la température ne fournit aucune information corrective.",
    takeaway:
      "En retry, n'écris jamais « réessaie » : appende l'erreur précise (champ, valeur attendue vs obtenue).",
  },
  {
    id: 38,
    domainId: "context",
    scenarioId: "support",
    question:
      "Un agent de support reçoit un client en colère qui réclame uniquement un simple changement d'adresse, puis un autre cas où le modèle s'auto-évalue à une confiance de 0,6 sur une demande de remboursement de 80 $ ; lesquels doivent déclencher une escalade vers un humain ?",
    options: [
      "Le client en colère, car un sentiment négatif signale une situation complexe à confier à un humain",
      "Le cas à confiance 0,6, car sous le seuil de 0,7 le modèle reconnaît honnêtement son incertitude",
      "Aucun des deux : le sentiment n'égale pas la complexité et la confiance auto-déclarée du modèle n'est pas fiable",
      "Les deux, par prudence, puisque colère et faible confiance sont tous deux des signaux de risque",
    ],
    correctIndex: 2,
    explanation:
      "Le page établit que le sentiment n'égale pas la complexité (un client en colère avec un simple changement d'adresse ne doit PAS être escaladé) et que la confiance auto-déclarée du modèle n'est pas fiable. Les options basées sur le sentiment ou sur un seuil de confiance reproduisent exactement les deux anti-patterns d'escalade marqués « ALWAYS wrong » ; les déclencheurs valides sont la demande explicite du client, un vide de politique, une limite de capacité ou un seuil métier dépassé.",
    takeaway:
      "On escalade sur des critères objectifs (demande explicite, vide de politique, seuil métier), jamais sur le sentiment ni sur la confiance auto-déclarée du modèle.",
  },
  {
    id: 39,
    domainId: "context",
    scenarioId: "extraction",
    question:
      "Dans une longue session d'extraction où le contexte se remplit, comment garantir que le nom du client, le numéro de compte et le montant exact restent disponibles jusqu'au bout sans être perdus ?",
    options: [
      "Appliquer une summarization progressive de l'historique pour compresser les détails au fur et à mesure",
      "Conserver ces détails dans un bloc « case facts » immuable placé en tête de contexte, jamais résumé",
      "Placer ces détails au milieu du contexte pour libérer les positions de début et de fin",
      "Laisser la session se compacter automatiquement et se fier à la mémoire du modèle pour les retrouver",
    ],
    correctIndex: 1,
    explanation:
      "La page montre que la summarization progressive détruit silencieusement les détails critiques (nom, compte, numéro de commande, montants) et recommande un bloc « case facts » immuable, jamais résumé, placé en position de début à haute mémorisation. Le milieu du contexte est précisément la zone « lost in the middle » la moins rappelée, et se fier à la summarization automatique ou à la mémoire du modèle reproduit l'anti-pattern qui perd les originaux.",
    takeaway:
      "Pour préserver des détails critiques sur une longue conversation, la réponse est TOUJOURS un bloc « case facts » immuable en tête de contexte, jamais la summarization progressive.",
  },
  {
    id: 40,
    domainId: "context",
    scenarioId: "support",
    question:
      "Sur un agent support client, vous devez définir quand transférer une conversation à un humain : quelle règle d'escalade retenez-vous ?",
    options: [
      "Escalader dès que le ton du client est détecté comme énervé ou frustré",
      "Escalader lorsque le score de confiance auto-déclaré du modèle passe sous un seuil",
      "Escalader selon des critères objectifs : lacunes de politique, limites de capacité, demande explicite ou seuils métier",
      "Escalader automatiquement après un nombre fixe d'itérations de la boucle agentique",
    ],
    correctIndex: 2,
    explanation:
      "L'escalade doit reposer sur des critères objectifs (lacunes de politique, limites de capacité, demande explicite, seuils métier) car ils évitent les transferts inutiles tout en captant les vrais cas limites. Le sentiment n'égale pas la complexité de la tâche (un client énervé avec une demande simple n'a pas besoin d'humain), les scores de confiance auto-déclarés sont mal calibrés, et un plafond d'itérations ne reflète pas l'achèvement de la tâche.",
    takeaway:
      "Escalader sur des faits observables et des seuils métier, jamais sur le sentiment ni un score de confiance auto-déclaré.",
  },
  {
    id: 41,
    domainId: "claudecode",
    scenarioId: "cicd",
    question:
      "Vous intégrez Claude dans un pipeline CI/CD qui génère du code puis le passe en revue : comment structurez-vous la revue pour éviter le biais de confirmation ?",
    options: [
      "Réutiliser la même session pour générer puis relire le code afin de garder le contexte",
      "Demander au modèle un score de confiance sur sa propre génération et relire si bas",
      "Ajouter au prompt l'instruction 'sois rigoureux et trouve tous les problèmes'",
      "Utiliser des sessions séparées : une pour la génération, une autre pour la revue",
    ],
    correctIndex: 3,
    explanation:
      "Il faut des sessions séparées pour la génération et la revue : une session fraîche relit le code objectivement, sans préconception. Réutiliser la même session conserve le raisonnement du générateur et crée un biais de confirmation, un score de confiance auto-déclaré est mal calibré, et une instruction vague comme 'trouve tous les problèmes' produit du sur-signalement et de la fatigue d'alerte.",
    takeaway:
      "Génération et revue dans des sessions distinctes : un relecteur sans préconception attrape ce que l'auteur ne voit pas.",
  },
];
