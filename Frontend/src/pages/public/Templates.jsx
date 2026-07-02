import { LayoutTemplate } from 'lucide-react';

export default function Templates() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="text-center mb-12">
          <span className="chip mb-4">Resources</span>
          <h1 className="display-h text-4xl md:text-5xl text-ink mb-4">Templates</h1>
          <p className="text-ink-dim max-w-xl mx-auto">Ready-to-use templates and starter kits from the WorknAi team.</p>
        </div>

        <div className="flex flex-col items-center gap-3 py-20 text-ink-dim">
          <LayoutTemplate className="w-10 h-10 text-violet-400 opacity-60" />
          <p>Coming soon!</p>
        </div>
      </div>
    </section>
  );
}
