import { pack, wordsFromText } from "@/data/content/types";
import { numbersIntermediate } from "@/data/shared/numbers";

export const frIntermediate = pack({
  words: wordsFromText(
    "analyse constance fluidite discipline repere habitude attention resultat equilibre stabilite tempo signal soutien lecture guidee comparaison retour confiance outil durable mesure visible session utilisateur reprise immediat realiste progression interface discrete endurance structure recommandation performance vitesse precision clavier frappe logique memoire adaptation pratique energie cadence objectif methode routine concentration lisibilite calme effort strategie qualite coherence repete controle suivi progression reguliere continuite application maitrise efficacite souplesse variation dynamique motivation stabilisation correction observation endurance active competence confort orientation niveau parcours serie rythme nuance fiabilite experience gestion evaluation succes constance durable"
  ),

  sentences: [
    "Quand la ligne de lecture reste fixe, le rythme devient plus naturel et moins fatigant.",
    "Une pratique intermediaire a besoin de contenu varie pour eviter l impression de repetition mecanique.",
    "Un bon outil affiche le resultat tout de suite afin que la fin de session soit evidente.",
    "La confiance augmente quand les chiffres semblent justes et que le redemarrage est immediat.",
    "Une surface calme aide a tenir des exercices plus longs sans perte de concentration.",
    "Le produit devient motivant quand il combine precision, lisibilite et fluidite.",
    "Le rythme reste plus fiable quand la lecture et la saisie avancent ensemble.",
    "Les utilisateurs reviennent plus volontiers quand l interface n ajoute pas de confusion.",
    "Une progression visible encourage l utilisateur a poursuivre meme apres une erreur passagere.",
    "Les exercices courts servent a maintenir l energie pendant les periodes chargees.",
    "Une bonne cadence permet de garder la precision sans ralentir la frappe.",
    "Quand les objectifs sont clairs, la pratique semble plus simple et plus utile.",
    "Le suivi detaille aide a comprendre les habitudes de frappe sur plusieurs jours.",
    "Un environnement stable limite la fatigue et favorise une meilleure endurance.",
    "Les ajustements progressifs donnent une sensation de controle durable.",
    "La regularite quotidienne produit souvent plus de progres qu une longue session isolee.",
    "Une interface discrete laisse la place au texte et a la concentration.",
    "Le retour immediat aide a corriger rapidement les erreurs repetitives.",
    "La precision augmente quand le regard reste calme et bien oriente.",
    "Une methode simple reste souvent la plus efficace sur la duree.",
    "Le rythme personnel change selon l heure, la fatigue et la motivation.",
    "Des statistiques lisibles rendent la progression plus concrete.",
    "Un bon systeme sait varier les exercices sans casser les habitudes.",
    "La repetition utile doit rester breve, claire et bien mesuree.",
    "Quand la confiance revient, la vitesse suit naturellement."
  ],

  quotes: [
    "Une bonne interface laisse la concentration sur les mots et non sur les controles.",
    "Une pratique reguliere devient motivante quand le retour est immediat et lisible.",
    "Le progres durable vient souvent d un environnement simple, calme et fiable.",
    "Le redemarrage rapide soutient une bonne boucle d entrainement.",
    "La precision nait souvent de la constance plus que de la vitesse.",
    "Un outil discret peut produire de grands resultats.",
    "La repetition utile reste courte, claire et frequente.",
    "Le rythme personnel vaut mieux qu une vitesse forcee.",
    "La progression visible nourrit la motivation.",
    "Une methode simple facilite l engagement quotidien."
  ],

  punctuation: [
    "Texte stable, reprise rapide, mesures honnetes : la confiance se construit ainsi.",
    "Lire bien; taper juste; terminer clairement. Le cycle doit rester simple.",
    "Rythme, attention et controle soutiennent une bonne pratique.",
    "Mesurer, corriger, recommencer : une progression lisible.",
    "Precision d abord, vitesse ensuite : ordre essentiel.",
    "Observer, ajuster, continuer : logique durable.",
    "Calme visuel, objectif clair, effort constant.",
    "Routine breve, impact reel, fatigue reduite.",
    "Analyser moins; pratiquer mieux; avancer souvent.",
    "Erreur comprise, correction rapide, reprise immediate."
  ],

  numbers: numbersIntermediate,

  code: [
    "const scoreNet = scores.map((item) => item.netWpm);",
    "if (consistance > 80) { lancerModeAdaptatif(); }",
    "const tendance = sessions.slice(-8).map((item) => item.metrics.accuracy);",
    "return historique.filter((item) => item.mode === 'time').length;",
    "const vitesse = resultats.reduce((sum, item) => sum + item.wpm, 0);",
    "if (precision < 95) { proposerRevision(); }",
    "const serie = joursConsecutifs.map((jour) => jour.total);",
    "return erreurs.filter((item) => item.count > 3);",
    "const meilleur = essais.sort((a, b) => b.score - a.score)[0];",
    "if (fatigue === true) { lancerSessionCourte(); }",
    "const resume = sessions.slice(-5).map((item) => item.summary);",
    "return modes.find((item) => item.id === 'focus');"
  ]
});