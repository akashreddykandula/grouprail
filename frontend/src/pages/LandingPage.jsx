import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useLocation} from 'react-router-dom';
import {useEffect} from 'react';

import {
  MdTrain,
  MdGroups,
  MdAutoAwesome,
  MdChat,
  MdNotifications,
  MdCheckCircle,
} from 'react-icons/md';
import {
  HiArrowRight,
  HiUserAdd,
  HiClipboardList,
  HiLightningBolt,
} from 'react-icons/hi';
import {FiUsers, FiMapPin, FiCalendar, FiStar} from 'react-icons/fi';
import {useState} from 'react';

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: {opacity: 0, y: 32},
  whileInView: {opacity: 1, y: 0},
  viewport: {once: true, margin: '-60px'},
  transition: {duration: 0.6, delay, ease: 'easeOut'},
});

/* ── data ── */
const features = [
  {
    icon: MdGroups,
    color: 'text-primary-400',
    bg: 'bg-primary-400/10',
    title: 'Group Coordination',
    desc: 'Everyone enters their boarding station and passenger details. See the whole group at a glance.',
  },
  {
    icon: MdAutoAwesome,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    title: 'AI Boarding Strategy',
    desc: 'Our AI analyses all stations and recommends the best common boarding point so the group travels together.',
  },
  {
    icon: MdChat,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    title: 'Real-Time Group Chat',
    desc: 'Coordinate last-minute changes with Socket.IO powered live chat — no WhatsApp group needed.',
  },
  {
    icon: HiClipboardList,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    title: 'Booking Checklist',
    desc: 'A smart checklist tracks who is ready. When all green, one click redirects everyone to IRCTC.',
  },
  {
    icon: MdNotifications,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Smart Notifications',
    desc: 'Get notified when someone joins, updates details, or when the journey date is approaching.',
  },
  {
    icon: FiStar,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    title: 'Seat Preferences',
    desc: 'Each passenger picks window, lower berth, side berth and more. All stored and shown to the group.',
  },
];

const steps = [
  {
    number: '01',
    icon: HiLightningBolt,
    title: 'Organizer creates a trip',
    desc: 'Set the destination, travel date, train preference and max group size. Get an invite code instantly.',
  },
  {
    number: '02',
    icon: HiUserAdd,
    title: 'Friends join via invite',
    desc: 'Share the code or link. Each member enters their boarding station, passenger names and seat preferences.',
  },
  {
    number: '03',
    icon: MdAutoAwesome,
    title: 'AI recommends a strategy',
    desc: 'GroupRail analyses all boarding points and suggests the station that gives the best chance of travelling together.',
  },
  {
    number: '04',
    icon: MdCheckCircle,
    title: 'Everyone books on IRCTC',
    desc: 'When the checklist is complete, a button redirects the group to the official railway booking site.',
  },
];

const faqs = [
  {
    q: 'Does GroupRail book tickets for me?',
    a: 'No. GroupRail is a planning tool, not a booking platform. We help your group coordinate and then redirect you to the official IRCTC website to book tickets.',
  },
  {
    q: 'Is GroupRail free to use?',
    a: 'Yes, GroupRail is completely free. Create an account, plan as many trips as you like.',
  },
  {
    q: 'How does the AI recommendation work?',
    a: "The AI analyses everyone's boarding stations, the group size, travel date, and seat preferences to suggest the boarding point that maximises the chance of all passengers getting confirmed berths in the same coach.",
  },
  {
    q: 'How many people can join a trip?',
    a: 'A trip can have up to 50 members, each with up to 10 passengers — covering even large family or corporate group travel.',
  },
  {
    q: 'Can I join a trip without an account?',
    a: 'You need a free GroupRail account to join a trip so your details are saved and the group can see your status.',
  },
];

const testimonials = [
  {
    name: 'Priya M.',
    role: 'Organised family trip · Vizag → Hyderabad',
    avatar: 'P',
    color: 'bg-primary-500',
    text: "We were coming from 4 different cities. GroupRail's AI told us to board from Vijayawada and we all ended up in the same coach. Brilliant!",
    rating: 5,
  },
  {
    name: 'Arjun K.',
    role: 'College reunion trip · 12 people',
    avatar: 'A',
    color: 'bg-violet-500',
    text: 'The group chat and booking checklist saved so much confusion. Everyone knew exactly when to book and what to enter.',
    rating: 5,
  },
  {
    name: 'Sunita R.',
    role: 'Corporate offsite · Mumbai team',
    avatar: 'S',
    color: 'bg-emerald-500',
    text: 'Managing 20 employees travelling from different stations was a nightmare — until GroupRail. The AI recommendation was spot on.',
    rating: 5,
  },
];

/* ── sub-components ── */
const StarRating = ({count}) => (
  <div className="flex gap-0.5">
    {Array.from ({length: count}).map ((_, i) => (
      <FiStar key={i} className="text-amber-400 fill-amber-400" size={14} />
    ))}
  </div>
);

const FaqItem = ({q, a}) => {
  const [open, setOpen] = useState (false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen (!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-white font-medium text-sm sm:text-base group-hover:text-primary-300 transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-400 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{height: open ? 'auto' : 0, opacity: open ? 1 : 0}}
        transition={{duration: 0.25}}
        className="overflow-hidden"
      >
        <p className="text-slate-400 text-sm leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  );
};
const location = useLocation ();

useEffect (
  () => {
    if (location.hash) {
      const element = document.querySelector (location.hash);

      if (element) {
        setTimeout (() => {
          element.scrollIntoView ({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  },
  [location]
);

/* ── page ── */
const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-mesh">
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div {...fadeUp (0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
                <MdAutoAwesome size={15} /> AI-Powered Group Train Planning
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp (0.1)}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-display leading-tight mb-6"
            >
              Plan your group{' '}
              <span className="gradient-text">train journey</span>{' '}
              together
            </motion.h1>

            <motion.p
              {...fadeUp (0.2)}
              className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Friends travelling from different cities? GroupRail co-ordinates everyone's boarding stations,
              analyses your options with AI, and gives the group the best chance of travelling together.
            </motion.p>

            <motion.div
              {...fadeUp (0.3)}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-3.5 shadow-glow"
              >
                Start Planning Free <HiArrowRight size={18} />
              </Link>
              <button
  onClick={() =>
    document.querySelector("#how-it-works")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="btn-secondary text-base px-8 py-3.5"
>
  See How It Works
</button>
            </motion.div>

            {/* stats */}
            <motion.div
              {...fadeUp (0.45)}
              className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md"
            >
              {[
                {value: '10K+', label: 'Trips Planned'},
                {value: '50K+', label: 'Travellers'},
                {value: '98%', label: 'Group Success'},
              ].map (s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">
                    {s.value}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{y: [0, 8, 0]}}
          transition={{repeat: Infinity, duration: 2}}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="section-container">
          <motion.div {...fadeUp ()} className="text-center mb-16">
            <span className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Everything your group needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From AI recommendations to live chat — GroupRail handles the complexity so you can focus on the journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map ((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp (i * 0.07)}
                className="glass-card-hover p-6"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                >
                  <f.icon className={f.color} size={22} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="section-container">
          <motion.div {...fadeUp ()} className="text-center mb-16">
            <span className="badge bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Four steps to travel together
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              GroupRail guides your group from first idea to booking-ready in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

            {steps.map ((s, i) => (
              <motion.div
                key={s.number}
                {...fadeUp (i * 0.1)}
                className="relative glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <s.icon className="text-primary-400" size={24} />
                </div>
                <span className="text-5xl font-black text-white/5 absolute top-4 right-5 leading-none select-none">
                  {s.number}
                </span>
                <h3 className="text-white font-semibold mb-2 text-sm">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI RECOMMENDATION SHOWCASE ── */}
      <section className="py-24 border-t border-white/5">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp ()}>
              <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-4">
                AI Recommendation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                Smart boarding advice, instantly
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                The AI doesn't just list your stations — it reasons about group size, train quotas, station
                availability, and seat preferences to pick the boarding point with the highest probability
                of getting you all confirmed in the same coach.
              </p>
              <ul className="space-y-3">
                {[
                  "Analyses every member's boarding point",
                  'Considers train quota availability',
                  'Shows advantages and trade-offs clearly',
                  'Updates when group details change',
                ].map (item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <MdCheckCircle
                      className="text-emerald-400 shrink-0 mt-0.5"
                      size={18}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* mock AI card */}
            <motion.div {...fadeUp (0.15)}>
              <div className="glass-card p-6 border-primary-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center">
                    <MdAutoAwesome className="text-primary-400" size={16} />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    AI Recommendation
                  </span>
                  <span className="ml-auto badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    High confidence
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    <span className="text-primary-300 font-medium">
                      Board from Vijayawada (BZA)
                    </span>
                    {' '}
                    instead of
                    Guntur. The group has a significantly better chance of getting confirmed seats in the same coach
                    because BZA is an originating station for this train.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-emerald-400 text-xs font-medium mb-2 uppercase tracking-wide">
                      Advantages
                    </p>
                    <div className="space-y-1.5">
                      {[
                        'Originating station — more quota available',
                        'Train departs from here (no delay risk)',
                        '3 of 5 members already board here',
                      ].map (a => (
                        <div
                          key={a}
                          className="flex items-start gap-2 text-slate-300 text-xs"
                        >
                          <MdCheckCircle
                            className="text-emerald-400 shrink-0 mt-0.5"
                            size={13}
                          />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-amber-400 text-xs font-medium mb-2 uppercase tracking-wide">
                      Trade-offs
                    </p>
                    <div className="flex items-start gap-2 text-slate-300 text-xs">
                      <span className="text-amber-400 shrink-0">⚠</span>
                      2 members need to travel 45 min extra to reach Vijayawada
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 border-t border-white/5">
        <div className="section-container">
          <motion.div {...fadeUp ()} className="text-center mb-16">
            <span className="badge bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Groups that travelled together
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map ((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp (i * 0.1)}
                className="glass-card p-6"
              >
                <StarRating count={t.rating} />
                <p className="text-slate-300 text-sm leading-relaxed my-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div
                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 border-t border-white/5">
        <div className="section-container">
          <motion.div {...fadeUp ()} className="text-center mb-16">
            <span className="badge bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Common questions
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp (0.1)}
            className="max-w-2xl mx-auto glass-card px-6 divide-y divide-white/0"
          >
            {faqs.map (faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-white/5">
        <div className="section-container">
          <motion.div
            {...fadeUp ()}
            className="relative glass-card p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-violet-600/10 pointer-events-none" />
            <div className="relative z-10">
              <MdTrain className="text-primary-400 mx-auto mb-4" size={40} />
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                Ready to travel together?
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Create your first trip in under a minute. Free forever.
              </p>
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-3.5 shadow-glow"
              >
                Get Started Free <HiArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
