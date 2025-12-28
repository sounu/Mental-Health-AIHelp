'use client';

import { useState } from 'react';

export default function WellnessPage() {
  const [feeling, setFeeling] = useState('');
  const [goal, setGoal] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feeling.trim() || !goal.trim()) {
      alert('Please fill in both fields');
      return;
    }

    // For now just mark as submitted
    // Later → send this to AI recommendation API
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Personalized Wellness</h1>
      <p className="text-foreground/70 mb-8">
        Get AI-powered recommendations tailored just for you.
      </p>

      {!submitted ? (
        <div className="space-y-6">
          {/* SECTION TITLE */}
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Tell us about yourself
            </h2>
            <p className="text-sm text-foreground/70">
              The more we know, the better we can help.
            </p>
          </div>

          {/* FEELING INPUT */}
          <div>
            <label className="block mb-2 font-medium">
              How are you feeling right now?
            </label>
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="e.g., A bit stressed but hopeful"
              className="w-full rounded-lg border px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* GOAL INPUT */}
          <div>
            <label className="block mb-2 font-medium">
              What are you hoping to achieve?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., I want to manage my anxiety better and improve my sleep."
              className="w-full rounded-lg border px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="mt-4 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90 transition"
          >
            Get Recommendations
          </button>
        </div>
      ) : (
        /* SUCCESS STATE */
        <div className="rounded-xl border bg-white/5 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Thanks for sharing 💙
          </h2>
          <p className="text-foreground/70 mb-4">
            We’re preparing personalized recommendations for you.
          </p>
          <p className="text-sm text-foreground/60">
            (Next step: connect this to AI suggestions)
          </p>
        </div>
      )}
    </div>
  );
}
