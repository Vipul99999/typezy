import { pack, wordsFromText } from "@/data/content/types";
import { numbersBeginner } from "@/data/shared/numbers";

export const frBeginner = pack({
  words: wordsFromText(
    "rythme calme clavier progres lecture ligne mot mains simple propre repeter pratique mesure vitesse base claire stable pause confiance courte seance effort precision routine regard guide temps apprendre resultat souple facile focus bureau etude geste controle frappe texte touche doigt espace retour copie debut fin lent rapide juste poser tenir suivre voir ecran table posture souffle pause droite gauche centre serie minute seconde niveau debutant tranquille leger proprement patience repetition utile regulier habitude memo fluide naturel objectif petit avance support travail energie repos confort logique"
  ),

  sentences: [
    "Une seance calme aide les doigts a garder un rythme stable.",
    "Une ligne claire facilite la lecture et la precision.",
    "Des exercices courts et reguliers donnent souvent de meilleurs resultats.",
    "La vitesse apparait plus facilement quand le texte reste lisible.",
    "La confiance grandit quand l interface reste discrete.",
    "La precision vient souvent avant la rapidite.",
    "Une bonne habitude commence avec une lecture claire.",
    "La repetition simple rend le geste plus naturel.",
    "Un rythme lent au debut construit une base solide.",
    "Les mains detendues reduisent les erreurs inutiles.",
    "Une courte pause aide a reprendre avec plus de calme.",
    "Le regard stable suit mieux la ligne de texte.",
    "Un exercice simple motive a continuer chaque jour.",
    "La posture droite rend la frappe plus confortable.",
    "Le clavier devient familier avec une pratique reguliere.",
    "La vitesse augmente quand les gestes restent propres.",
    "Une routine breve peut produire un vrai progres.",
    "Lire avant de taper aide a garder la fluidite.",
    "Un texte court permet de rester concentre.",
    "Chaque petite reussite renforce la confiance.",
    "Une reprise rapide aide a garder l habitude.",
    "Le calme rend la progression plus durable.",
    "Le temps de pratique compte plus qu une seule longue session.",
    "Les doigts apprennent mieux avec des mouvements simples.",
    "La constance quotidienne donne souvent les meilleurs effets."
  ],

  quotes: [
    "La progression durable vient d une pratique courte mais reguliere.",
    "Une frappe calme produit souvent une vitesse plus stable.",
    "Les bons reflexes viennent d une repetition bien mesuree.",
    "Une interface sobre aide a rester concentre.",
    "Commencer lentement aide a finir plus vite.",
    "Un geste propre vaut mieux qu un geste presse.",
    "Le calme soutient la precision.",
    "La routine simple reste souvent la meilleure methode.",
    "Chaque jour compte dans un apprentissage regulier.",
    "Le confort aide a pratiquer plus longtemps."
  ],

  punctuation: [
    "Lire, taper, respirer. Corriger, reprendre, avancer.",
    "Calme, rythme, precision : une bonne base pour progresser.",
    "Texte clair; pratique simple; progression durable.",
    "Lire mieux, taper mieux, recommencer sans bruit.",
    "Debut lent, resultat solide : principe utile.",
    "Pause breve, esprit clair, reprise facile.",
    "Mains detendues, regard fixe, geste propre.",
    "Routine simple; effort constant; bon resultat.",
    "Petit pas, grand effet : continuer.",
    "Voir, comprendre, taper, corriger."
  ],

  numbers: numbersBeginner,

  code: [
    "const pas = sessions.length;",
    "if (precision > 95) return 'pret';",
    "let cadence = mots / minutes;",
    "const modeRapide = actuel === 'time';",
    "const total = erreurs.length;",
    "if (score > 80) return 'bien';",
    "let vitesse = lignes / minute;",
    "const actif = mode === 'focus';",
    "const jour = historique[0];",
    "return session.terminee === true;",
    "const base = stats.score;",
    "if (temps < 60) return 'court';",
    "let net = brut - fautes;",
    "const serie = jours.length;",
    "return niveau === 'debut';"
  ]
});