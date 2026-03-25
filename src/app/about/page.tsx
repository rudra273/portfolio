import Image from 'next/image';
import Link from 'next/link';
import { careerTimeline } from '@/career';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative min-h-screen w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">

        {/* ═══ ABOUT SECTION ═══ */}
        <div className="hud-panel p-8 md:p-12 relative overflow-hidden">
          {/* HUD decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent-cyan/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent-cyan/20 rounded-br-2xl" />
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-pulse" />
            <span className="text-accent-cyan/40 font-space text-[10px] tracking-[0.2em] uppercase">
              Sys:Profile
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-start">
            {/* Left Column: Profile Photo */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-[180px] h-[180px] rounded-full p-2 border border-accent-cyan/30 bg-accent-cyan/5">
                <Image
                  src="https://res.cloudinary.com/dldkrpbjt/image/upload/v1774436299/profile/rudra.jpg"
                  alt="Rudrapratap Mohanty"
                  fill
                  className="rounded-full object-cover scale-[0.95] opacity-80 hover:scale-100 hover:opacity-100 transition-all duration-500"
                />
                {/* Spin decoration */}
                <div className="absolute inset-[-4px] rounded-full border border-t-accent-cyan/50 border-r-transparent border-b-accent-purple/30 border-l-transparent animate-spin-slow pointer-events-none" />
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent my-2" />

              <Link
                href="https://drive.google.com/drive/folders/1BWzQhsPt2WGACNzpWYfq_etNg2654N7Y?usp=drive_link"
                target="_blank"
                className="w-full"
              >
                <button className="w-full py-2.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/10 text-accent-cyan font-space text-xs tracking-widest uppercase transition-all duration-300">
                  Access Data Log (CV)
                </button>
              </Link>
            </div>

            {/* Right Column: About Text */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold font-space text-white mb-6 tracking-wide">
                Identity Verification
              </h1>

              <div className="space-y-4 font-poppins text-white/60 text-sm leading-relaxed">
                <p>
                  I am currently based in Bangalore, working as an <span className="text-accent-cyan font-medium">MLOps Engineer</span>. With a strong foundation
                  in software development, I specialize in backend engineering, cloud infrastructure, and operationalizing Machine Learning models.
                </p>
                <p>
                  My expertise spans backend frameworks like Django and FastAPI, where I have built high-performance APIs and microservices. I am heavily focused on the intersection of DevOps and AI, leveraging Kubernetes, AWS, and GCP to streamline model deployment, scaling, and lifecycle management.
                </p>
                <p>
                  Currently, I am immersed in the world of LLM engineering, <span className="text-accent-purple font-medium">building agentic AI systems using LangChain and LangGraph</span>. Integrating these advanced NLP workflows into robust, scalable architectures is where I do my most exciting work.
                </p>
                <p>
                  Beyond my professional work, I am deeply passionate about technology and creativity. I love tackling algorithmic challenges on LeetCode to keep my problem-solving sharp. Outside of tech, I have a deep fascination with <span className="text-accent-cyan font-medium">space and astronomy</span>,
                  often exploring the mysteries of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ JOURNEY TIMELINE ═══ */}
        <div className="hud-panel p-8 md:p-12 relative overflow-hidden">
          {/* HUD decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent-purple/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent-purple/20 rounded-br-2xl" />
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/60 animate-pulse" />
            <span className="text-accent-purple/40 font-space text-[10px] tracking-[0.2em] uppercase">
              Sys:Timeline
            </span>
          </div>

          <div className="text-center mb-16">
            <p className="text-accent-purple/50 font-space text-xs tracking-[0.3em] uppercase mb-3">
              Expedition Log
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-space tracking-wide">
              Career Trajectory
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col items-center max-w-3xl mx-auto">
            {/* The absolute center glowing line */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-accent-purple/40 to-transparent" />

            {careerTimeline.map((item, index) => (
              <div key={index} className="w-full mb-12 relative group">
                <div className="grid grid-cols-2 gap-8 relative items-center">

                  {/* Glowing node point on the timeline */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-black border-2 border-accent-purple/60 z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-accent-purple/20 group-hover:border-accent-cyan shadow-[0_0_15px_rgba(157,78,221,0.5)]" />
                  </div>

                  {/* Left or Right Positioned Content */}
                  <div className={`col-span-1 ${item.position === 'up' ? 'col-start-1 text-right' : 'col-start-2 text-left'}`}>
                    <div className={`inline-block w-full max-w-[280px] glass-card p-5 border border-white/5 group-hover:border-accent-purple/30 group-hover:-translate-y-1 transition-all duration-300 ${item.position === 'up' ? 'mr-6' : 'ml-6'}`}>
                      <p className="text-[10px] font-space text-accent-cyan/80 tracking-widest uppercase mb-2">
                        {item.date}
                      </p>
                      <h3 className="text-sm md:text-base font-bold text-white font-space leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/40 font-poppins text-xs leading-relaxed">
                        {item.role}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* End of timeline marker */}
            <div className="flex flex-col items-center mt-8 relative z-10">
              <div className="w-2 h-2 rounded-full bg-accent-cyan/80 animate-pulse shadow-[0_0_10px_rgba(102,252,241,0.5)] mb-4" />
              <p className="text-accent-cyan/50 font-space text-[10px] tracking-[0.3em] uppercase">
                Awaiting Next Transmission...
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
