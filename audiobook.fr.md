# Préparation à la certification Claude — Un audiobook de 10 minutes

> Durée cible : ~11–12 minutes à ~150 mots par minute (~1 750 mots).
> Quatorze chapitres : ingénierie de prompt, évaluation de prompt, outils, fonctionnalités de Claude, API, RAG, MCP, agents et workflows, Claude Code en action, hooks, skills, détails verbatim, conseils finaux.
> Version optimisée pour synthèse vocale (TTS) : pas de balises de code, pas de markdown gras, ponctuation fluide.

---

## Chapitre 0 — Bienvenue et mode d'emploi

Bienvenue. Au cours des dix prochaines minutes, vous allez écouter une revue structurée de chaque sujet de la certification Claude. Chaque chapitre est court, dense et autonome, vous pouvez donc l'écouter d'un trait avant l'examen, ou rejouer un seul chapitre quand vous avez besoin d'une révision ciblée. La certification récompense deux choses : maîtriser les concepts sous-jacents, et comprendre comment ces concepts s'articulent dans une vraie application Claude. Gardez cela en tête — chaque chapitre se termine par un point d'ancrage mental que vous pourrez emporter dans la salle d'examen.

---

## Chapitre 1 — Ingénierie de prompt

L'ingénierie de prompt est itérative, jamais en un seul jet. La boucle est la suivante : fixer un objectif, écrire un prompt naïf de référence, l'évaluer, appliquer une technique, puis réévaluer. Un score de départ autour de deux sur dix est normal — c'est votre plancher, pas votre échec. Deux techniques font la plus grande différence. D'abord, « être clair et direct » : indiquez à Claude le rôle à jouer, la tâche à accomplir et les contraintes à respecter. Ensuite, « être spécifique » : fournissez des consignes de sortie qui contrôlent la longueur, la structure, le format et le ton, et des étapes de processus qui guident le raisonnement — par exemple : « brainstorme trois options, choisis la meilleure, puis détaille-la. » Les consignes de sortie ont leur place dans presque tous les prompts. Les étapes de processus sont réservées aux tâches complexes. Ajoutez de la structure avec des balises XML pour que contexte, instructions et exemples ne se mélangent jamais. Changez une seule chose à la fois et mesurez. Ancrage : itérer, une variable à la fois, mesurer chaque pas.

---

## Chapitre 2 — Évaluation de prompt

L'ingénierie de prompt rédige le prompt ; l'évaluation mesure s'il fonctionne vraiment. La plupart des ingénieurs tombent dans deux pièges : tester une fois et livrer, ou rapiécer quelques cas limites évidents. Les deux laissent exposé en production. La bonne approche est un pipeline d'évaluation. Construisez trois fonctions clés : run prompt fusionne un cas de test avec un template de prompt et appelle Claude ; run test case appelle run prompt puis note la sortie ; run eval itère sur tout le jeu de données et agrège les résultats. La notation est l'endroit où vit la vraie complexité. Vous pouvez utiliser des vérifications déterministes par code, ou la notation par modèle, où un second appel à Claude évalue le premier selon des critères explicites. Gardez les jeux de tests petits pendant l'itération, puis montez en charge. Cet état d'esprit transforme « ça marche chez moi » en confiance mesurable. Ancrage : trois fonctions clés — run prompt, run test case, run eval.

---

## Chapitre 3 — Outils

Les outils permettent à Claude de sortir de ses données d'entraînement. Le schéma est une boucle structurée : votre application envoie une question à Claude avec une liste d'outils ; Claude répond par une demande d'utilisation d'outil ; votre serveur exécute la fonction et renvoie le résultat ; Claude génère la réponse finale. Un outil compte trois éléments — une fonction Python, un schéma JSON qui la décrit, et son intégration dans la boucle de messages. Bonnes pratiques : noms de fonction et de paramètres explicites, validation des entrées, et erreurs claires. Claude lit les messages d'erreur et réessaie avec des paramètres corrigés, donc de bonnes erreurs rendent le système auto-correcteur. Le schéma déclare le nom, la description et la forme des entrées en JSON Schema. Côté réponses, surveillez les blocs : les blocs texte contiennent la prose, les blocs tool use contiennent les requêtes, et vous devez répondre avec un bloc tool result correspondant pour que Claude continue. Ancrage : trois blocs — text, tool use, tool result.

---

## Chapitre 4 — Fonctionnalités de Claude

Quatre fonctionnalités reviennent constamment. La réflexion étendue permet à Claude de raisonner avant de répondre, échangeant de la latence contre de la qualité sur les tâches mathématiques, de planification ou d'analyse. Le support image accepte jusqu'à cent images par requête, cinq mégaoctets chacune ; le coût en tokens vaut environ largeur fois hauteur divisé par 750. Les règles d'ingénierie de prompt s'appliquent identiquement à la vision : un prompt vague donne une réponse vague, donc guidez Claude étape par étape. Le support PDF permet la lecture directe de documents, combinant texte et mise en page visuelle. Les citations ancrent les réponses dans les documents sources, en renvoyant les passages exacts utilisés pour permettre la vérification. Ensemble, ces fonctionnalités transforment Claude d'un modèle de chat en analyste multimodal. À l'examen, retenez les limites précises et que la qualité du prompt compte autant pour les images et PDF que pour le texte. Ancrage : 100 images max, 5 Mo chacune, tokens ≈ largeur × hauteur / 750.

---

## Chapitre 5 — L'API

Trois comportements de l'API sont essentiels. La température contrôle l'aléa : zéro produit des sorties déterministes et reproductibles, idéal pour l'évaluation et l'extraction ; les valeurs élevées produisent des sorties créatives, idéales pour le brainstorming. Le streaming de réponse supprime l'attente. Au lieu d'attendre dix à trente secondes, votre serveur transmet les fragments au fur et à mesure que Claude les génère. L'événement clé est Content Block Delta, qui transporte le texte. Utilisez la version simplifiée client messages stream avec text stream pour la majorité des cas, puis appelez get final message pour récupérer l'objet complet, utile pour la persistance. L'extraction de données structurées demande à Claude de retourner du JSON conforme à un schéma, souvent en utilisant un outil comme contrainte — définissez un outil dont la seule mission est de recevoir l'objet structuré, et la réponse arrive parsée et validée. Ancrage : température zéro pour la précision, Content Block Delta pour le streaming, outil pour la structure.

---

## Chapitre 6 — RAG, génération augmentée par récupération

RAG comporte cinq étapes : découper le texte en chunks, embarquer chaque chunk, stocker les embeddings avec le texte original, embarquer la requête utilisateur, puis récupérer les correspondances les plus proches par distance cosinus — distance plus faible signifie pertinence plus haute. La stratégie de chunking compte plus qu'on ne le pense. Le découpage par taille est simple et marche partout mais peut couper des phrases. Le découpage par structure utilise les titres et paragraphes et donne les chunks les plus propres quand la mise en forme est fiable. Le découpage par phrases est un excellent défaut généraliste. Le découpage sémantique groupe par sens et reste le plus précis mais le plus coûteux. La recherche purement sémantique manque les termes exacts comme un identifiant d'incident, donc en production on utilise la recherche hybride : on combine la similarité vectorielle avec la recherche lexicale BM25, puis on fusionne avec la Reciprocal Rank Fusion, qui note chaque document par un sur k plus son rang dans chaque index. Les documents forts dans les deux remontent en tête. Ancrage : cinq étapes RAG, hybride = vecteur + BM25 fusionnés par RRF.

---

## Chapitre 7 — MCP, le Model Context Protocol

MCP standardise la manière dont Claude dialogue avec des outils et données externes. Un serveur expose des outils, des ressources et des prompts. Un client est le pont qui gère le transport — généralement stdio pour le local, HTTP ou WebSockets pour le distant — pour que votre application n'ait pas à s'occuper du protocole. Deux types de messages dominent : List Tools pour découvrir ce qui est disponible, et Call Tool pour en exécuter un. Le SDK Python rend la création de serveur triviale : FastMCP plus le décorateur le décorateur mcp tool transforment une fonction Python typée en outil enregistré, les descriptions Pydantic Field alimentant le schéma vu par Claude. Les ressources exposent des données en lecture seule via des URIs, accédées par des requêtes Read Resource. L'inspecteur intégré, lancé avec mcp dev, permet de se connecter, lister et exécuter les outils dans le navigateur — une boucle de feedback rapide qui remplace les scripts de test manuels. Ancrage : deux messages clés — List Tools et Call Tool — FastMCP plus le décorateur mcp tool.

---

## Chapitre 8 — Agents et workflows

Un workflow est une séquence prédéfinie d'appels à Claude — utilisez-le quand vous pouvez dessiner le flux au tableau. Un agent donne à Claude un objectif et des outils, en le laissant décider des étapes — utilisez-le quand le chemin est imprévisible. Trois patterns de workflow reviennent à l'examen. Le chaining passe la sortie d'un prompt en entrée du suivant, en affinant à chaque étape. Le routing classe d'abord la requête utilisateur, puis l'envoie vers un prompt spécialisé — bien meilleur qu'un prompt générique géant. La parallélisation éclate les sous-tâches indépendantes et fusionne les résultats, réduisant la latence. Enfin, le pattern Evaluator-Optimizer associe un Producer et un Grader : le Producer génère, le Grader note, et le feedback boucle jusqu'à ce que la sortie passe. Ce sont des recettes réutilisables, pas du code — les connaître accélère chaque conception. Ancrage : quatre patterns — chaining, routing, parallélisation, evaluator-optimizer.

---

## Chapitre 9 — Claude Code en action

Claude Code est un agent dédié à l'ingénierie logicielle. Trois habitudes définissent l'usage expert. Ajouter du contexte : référencez les fichiers exacts, collez la sortie d'erreur verbatim, joignez les configs pertinentes — Claude ne peut pas lire ce qu'il ne voit pas. Faire des changements : préférez des éditions chirurgicales aux réécritures, exécutez le changement et vérifiez qu'il fonctionne avant de passer à la suite. Build, run, fix, puis module suivant. Contrôler le contexte : utilisez le fichier CLAUDE point md pour les standards de projet toujours actifs, videz le contexte en changeant de tâche, et déléguez aux subagents pour la recherche indépendante afin de garder la fenêtre principale propre. La certification attend que vous choisissiez le bon outil : edit pour les changements connus, agents de recherche pour l'exploration, mode plan pour le non-trivial, et gates de vérification avant de déclarer terminé. Ancrage : trois habitudes — ajouter contexte, faire changement vérifié, contrôler contexte.

---

## Chapitre 10 — Hooks

Les hooks interceptent les appels d'outils de Claude Code. Deux types : PreToolUse s'exécute avant l'outil et peut le bloquer ; PostToolUse s'exécute après et peut seulement observer. On les définit dans le fichier settings local point json dans le dossier point claude avec un matcher — les outils à intercepter, comme Read ou Grep — et une commande. Claude transmet du JSON sur l'entrée standard du hook, incluant session id, hook event name, tool name et tool input. Le code de sortie du script pilote la décision : zéro autorise, deux bloque, et tout message écrit sur stderr devient l'explication renvoyée à Claude. L'exemple classique est la protection des fichiers point env : on matche Read et Grep, on parse le chemin, on quitte avec deux si le motif sensible est détecté. Les hooks sont proactifs, transparents et flexibles — un seul hook peut surveiller plusieurs outils grâce à l'opérateur barre verticale. Ancrage : Pre Tool Use bloque, Post Tool Use observe, exit 2 + stderr explique.

---

## Chapitre 11 — Skills

Les skills sont une expertise chargée à la demande. Chaque skill est un dossier contenant un fichier le fichier SKILL point md : métadonnées en frontmatter — nom et description — puis instructions dans le corps. Claude ne charge que les noms et descriptions au démarrage et les compare à vos requêtes par correspondance sémantique. Quand un match se déclenche, vous obtenez une confirmation avant que le contenu complet n'entre dans le contexte. La priorité en cas de conflit de noms va Enterprise, puis Personal, puis Project, puis Plugins. Comparaison avec les voisins : le fichier CLAUDE point md est toujours actif, les skills se chargent à la demande ; les subagents tournent dans des contextes isolés, les skills enrichissent le courant ; les hooks sont pilotés par événement, les skills par requête ; MCP fournit des outils externes, les skills fournissent des connaissances. Les skills de projet dans le dossier point claude skills se partagent via Git. Si un skill ne se déclenche pas, la description est mauvaise — ajoutez les formulations que les utilisateurs utilisent vraiment. Ancrage : le fichier SKILL point md plus frontmatter, priorité Enterprise → Personal → Project → Plugins.

---

## Chapitre 12 — Détails verbatim à mémoriser

Quelques points précis qui tombent souvent. Multishot prompting : fournissez deux ou trois exemples entrée-sortie avant la vraie requête, encadrés en balises XML — un prompt naïf scoré 3,92 sur dix peut monter à 7,86 avec consignes spécifiques et exemples. Tools : chaque tool result doit reprendre le tool use id exact du tool use correspondant ; sans cet identifiant, Claude refuse de continuer la conversation. Extended thinking : les réponses contiennent des blocs thinking séparés du texte, paramétrés par budget tokens ; certains passent en redacted thinking pour des raisons de sécurité. Citations : Claude renvoie un tableau citations avec spans de caractères pointant vers le document source, vérifiable côté client. Hooks, gotchas : la commande tourne dans un shell, donc échappez bien chemins et arguments ; un hook lent bloque Claude — gardez-le court et idempotent. MCP : trois primitives, pas deux — tools, resources, prompts ; l'implémentation client typique utilise stdio client plus Client Session pour orchestrer la connexion. Skills : la frontmatter peut déclarer un champ allowed tools pour restreindre, et le le fichier SKILL point md peut référencer des scripts annexes dans le même dossier. Subagents Claude Code : dispatchés en parallèle avec isolation par worktree, chacun reçoit un brief scopé et un glob de fichiers disjoint. Workflow d'évaluation : générez le dataset à partir des inputs requis du prompt, puis le pipeline run prompt → run test case → run eval. Ancrage : un détail verbatim par sujet — c'est ce qui transforme un sept sur dix en neuf sur dix.

---

## Chapitre 13 — Conseils finaux pour l'examen

Trois rappels pour finir. Premièrement, chaque sujet Claude se réduit à la même boucle : écrire, évaluer, raffiner. Que vous régliez un prompt, construisiez un outil ou expédiiez un agent, la discipline est la même. Deuxièmement, les noms exacts comptent — codes de sortie, types de blocs de message, champs de schéma et événements de hook apparaissent verbatim dans les questions, donc mémorisez-les précisément. Troisièmement, préférez le mécanisme le plus simple qui résout le problème : un prompt plus clair avant un outil, un outil avant un workflow, un workflow avant un agent. Entrez calme. Vous savez tout cela. Bonne chance.
