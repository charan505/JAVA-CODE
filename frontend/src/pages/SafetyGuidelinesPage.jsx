import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ShieldAlert, 
  Printer, 
  Sparkles,
  Waves,
  Wind,
  Activity,
  Flame,
  Mountain,
  AlertTriangle
} from 'lucide-react';
import { safetyApi } from '../services/api';
import { DISASTER_TYPES } from '../utils/constants';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';

const SafetyGuidelinesPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [guidelines, setGuidelines] = useState([]);
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        setLoading(true);
        const res = await safetyApi.getAll();
        if (res.data?.success) {
          setGuidelines(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading safety guidelines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidelines();
  }, []);

  const parseJsonArray = (jsonString) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return jsonString.split('\n').filter(s => s.trim().length > 0);
    }
  };

  const filteredGuidelines = guidelines.filter(g => {
    if (selectedType && g.disasterType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return g.title.toLowerCase().includes(q) ||
             g.description.toLowerCase().includes(q) ||
             (g.dos && g.dos.toLowerCase().includes(q)) ||
             (g.donts && g.donts.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>Official Civil Protection Handbook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Disaster Safety Protocols & Guidelines
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative survival instructions, checklists, and precautions for major disaster types
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors text-xs self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print Manual</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, e.g., 'electrical breaker', 'water purification', 'evacuate'..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {selectedType && (
            <button
              onClick={() => setSelectedType('')}
              className="text-xs font-semibold text-red-400 hover:underline px-2 py-1"
            >
              Show All Guides
            </button>
          )}
        </div>

        {/* Category Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setSelectedType('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !selectedType
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Hazards
          </button>
          {DISASTER_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === type.value
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines Content */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading safety protocols...</p>
        </div>
      ) : filteredGuidelines.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Matching Guidelines Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting another category.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGuidelines.map((guide) => {
            const dosList = parseJsonArray(guide.dos);
            const dontsList = parseJsonArray(guide.donts);
            const kitList = parseJsonArray(guide.emergencyKitItems);

            return (
              <div
                key={guide.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                {/* Guide Title & Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <DisasterTypeBadge type={guide.disasterType} className="text-xs px-3 py-1" />
                    <h2 className="text-xl sm:text-2xl font-black text-white">{guide.title}</h2>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                    Priority Safety Plan
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  {guide.description}
                </p>

                {/* Do's and Don'ts 2-column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* DO's */}
                  <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>DO's (Crucial Actions)</span>
                    </div>
                    <ul className="space-y-2.5">
                      {dosList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DON'Ts */}
                  <div className="p-5 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <XCircle className="w-5 h-5" />
                      <span>DON'Ts (Dangerous Mistakes)</span>
                    </div>
                    <ul className="space-y-2.5">
                      {dontsList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Survival Kit Items */}
                {kitList.length > 0 && (
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Package className="w-4 h-4" />
                      <span>Recommended Emergency Go-Bag Kit Essentials</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {kitList.map((kit, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span className="leading-tight">{kit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SafetyGuidelinesPage;
