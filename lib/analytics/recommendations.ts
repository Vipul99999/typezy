import { Recommendation, SessionRecord } from "@/lib/types";

export function buildRecommendations(sessions: SessionRecord[]): Recommendation[] {
  const latest = sessions[0];
  if (!latest) {
    return [
      {
        id: "start-fast",
        title: "Start with a short focused drill",
        body: "Begin with a 30 or 60 second session so Typezy can learn your pace and suggest better next steps.",
        mode: "time"
      }
    ];
  }

  const recommendations: Recommendation[] = [];
  const recent = sessions.slice(0, 3);
  const recurringWeakKeys = Object.entries(
    recent.reduce<Record<string, number>>((accumulator, session) => {
      Object.entries(session.weakKeys).forEach(([key, value]) => {
        accumulator[key] = (accumulator[key] || 0) + value;
      });
      return accumulator;
    }, {})
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);
  const recurringWeakWords = Object.entries(
    recent.reduce<Record<string, number>>((accumulator, session) => {
      Object.entries(session.weakWords).forEach(([word, value]) => {
        accumulator[word] = (accumulator[word] || 0) + value;
      });
      return accumulator;
    }, {})
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);

  if (latest.metrics.accuracy < 90) {
    recommendations.push({
      id: "accuracy-reset",
      title: "Slow down for one cleaner run",
      body: "Your latest session shows that accuracy is the main limiter. Run one shorter, cleaner session next and aim to finish above 95% before pushing speed again.",
      mode: "quote",
      language: latest.language
    });
  }

  if (latest.metrics.accuracy > 97 && latest.metrics.consistency > 85) {
    recommendations.push({
      id: "step-up",
      title: "Push into a harder drill",
      body: "Control is strong right now. Move into adaptive practice or a longer timed session to raise the ceiling without losing form.",
      mode: "adaptive",
      language: latest.language
    });
  }

  if (latest.mode !== "time") {
    recommendations.push({
      id: "timed-confidence",
      title: "Verify your pace in a timed run",
      body: "A clean 60-second timed session is the best confidence check after words, quote, or adaptive practice.",
      mode: "time",
      language: latest.language
    });
  }

  if (latest.metrics.consistency < 70 && latest.metrics.netWpm > 35) {
    recommendations.push({
      id: "consistency-rebuild",
      title: "Smooth out your rhythm",
      body: "Speed is present, but the session still swings. Try one calmer Text Mode run to make your pace more even.",
      mode: "time",
      language: latest.language
    });
  }

  if (recurringWeakKeys.length) {
    recommendations.push({
      id: "weak-key-loop",
      title: "Target recurring weak keys",
      body: `Recent errors cluster around ${recurringWeakKeys.map(([key]) => key).join(", ")}. Run an adaptive drill to repeat those patterns intentionally.`,
      mode: "adaptive",
      language: latest.language
    });
  }

  if (recurringWeakWords.length) {
    recommendations.push({
      id: "weak-word-loop",
      title: "Repeat the words that still break your flow",
      body: `Recent sessions show hesitation on ${recurringWeakWords.map(([word]) => word).join(", ")}. Adaptive drills can loop those words until they feel automatic.`,
      mode: "adaptive",
      language: latest.language
    });
  }

  if (latest.mode !== "punctuation" && latest.metrics.accuracy > 95) {
    recommendations.push({
      id: "punctuation-check",
      title: "Stress-test punctuation control",
      body: "General accuracy is healthy. A punctuation drill can expose rhythm issues that plain word lists hide.",
      mode: "punctuation",
      language: latest.language
    });
  }

  const unique = recommendations.filter(
    (item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index
  );

  return unique.slice(0, 4);
}
