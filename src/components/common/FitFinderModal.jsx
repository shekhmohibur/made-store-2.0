import { useState } from 'react';
import { X, Sparkles, Check, Ruler, Info } from 'lucide-react';

const FitFinderModal = ({ isOpen, onClose, onSelectSize, currentSelectedSize }) => {
    const [unit, setUnit] = useState('metric'); // 'metric' (cm/kg) or 'imperial' (ft/lbs)
    const [heightCm, setHeightCm] = useState(175);
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(9);
    const [weightKg, setWeightKg] = useState(70);
    const [weightLbs, setWeightLbs] = useState(155);
    const [fitStyle, setFitStyle] = useState('regular'); // 'fitted', 'regular', 'oversized'
    const [build, setBuild] = useState('regular'); // 'slim', 'regular', 'athletic', 'plus'

    if (!isOpen) return null;

    // Calculate effective weight in kg
    const effectiveWeightKg = unit === 'metric' ? Number(weightKg) : Number(weightLbs) * 0.453592;
    // Calculate effective height in cm
    const effectiveHeightCm = unit === 'metric' ? Number(heightCm) : Number(heightFt) * 30.48 + Number(heightIn) * 2.54;

    // BMI & Sizing Algorithm
    const heightM = effectiveHeightCm / 100;
    const bmi = effectiveWeightKg / (heightM * heightM);

    let recommendedSize = 'M';
    let confidence = 94;

    if (bmi < 19) {
        recommendedSize = fitStyle === 'oversized' ? 'M' : 'S';
    } else if (bmi < 23) {
        if (effectiveHeightCm > 185) {
            recommendedSize = fitStyle === 'fitted' ? 'M' : 'L';
        } else {
            recommendedSize = fitStyle === 'fitted' ? 'S' : fitStyle === 'oversized' ? 'L' : 'M';
        }
    } else if (bmi < 27) {
        recommendedSize = fitStyle === 'fitted' ? 'M' : fitStyle === 'oversized' ? 'XL' : 'L';
    } else if (bmi < 31) {
        recommendedSize = fitStyle === 'fitted' ? 'L' : 'XL';
    } else {
        recommendedSize = fitStyle === 'fitted' ? 'XL' : 'XXL';
    }

    if (build === 'athletic' || build === 'plus') {
        if (recommendedSize === 'S') recommendedSize = 'M';
        else if (recommendedSize === 'M' && fitStyle !== 'fitted') recommendedSize = 'L';
    }

    const fitNotes = {
        fitted: 'Structured contour with close-to-body silhouette. Zero excess drape.',
        regular: 'Classic silhouette with 2-3 inches of natural ease across chest and shoulders.',
        oversized: 'Relaxed drop-shoulder drape inspired by runway editorial street tailoring.',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 font-sans">
                
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-950 to-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Sparkles size={20} className="text-white" />
                        </span>
                        <div>
                            <h3 className="font-serif text-lg tracking-wide uppercase font-bold">
                                Smart Fit AI Recommender
                            </h3>
                            <p className="text-[11px] text-slate-400">Precision atelier biometric sizing engine</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    
                    {/* Unit Switcher */}
                    <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setUnit('metric')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${unit === 'metric' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Metric (cm / kg)
                        </button>
                        <button
                            type="button"
                            onClick={() => setUnit('imperial')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${unit === 'imperial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Imperial (ft, in / lbs)
                        </button>
                    </div>

                    {/* Height Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">Height</span>
                            <span className="font-mono font-bold text-slate-900">
                                {unit === 'metric' ? `${heightCm} cm` : `${heightFt}' ${heightIn}"`}
                            </span>
                        </div>
                        {unit === 'metric' ? (
                            <input
                                type="range"
                                min="140"
                                max="210"
                                value={heightCm}
                                onChange={(e) => setHeightCm(Number(e.target.value))}
                                className="w-full accent-slate-900 cursor-pointer"
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={heightFt}
                                    onChange={(e) => setHeightFt(Number(e.target.value))}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                                >
                                    {[4, 5, 6, 7].map((f) => (
                                        <option key={f} value={f}>{f} Feet</option>
                                    ))}
                                </select>
                                <select
                                    value={heightIn}
                                    onChange={(e) => setHeightIn(Number(e.target.value))}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                                >
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                                        <option key={i} value={i}>{i} Inches</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Weight Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">Weight</span>
                            <span className="font-mono font-bold text-slate-900">
                                {unit === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={unit === 'metric' ? 40 : 90}
                            max={unit === 'metric' ? 140 : 310}
                            value={unit === 'metric' ? weightKg : weightLbs}
                            onChange={(e) =>
                                unit === 'metric'
                                    ? setWeightKg(Number(e.target.value))
                                    : setWeightLbs(Number(e.target.value))
                            }
                            className="w-full accent-slate-900 cursor-pointer"
                        />
                    </div>

                    {/* Fit Preference */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700">Fit Preference</span>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            {[
                                { id: 'fitted', label: 'Tailored Fitted' },
                                { id: 'regular', label: 'Classic Regular' },
                                { id: 'oversized', label: 'Runway Oversized' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFitStyle(f.id)}
                                    className={`p-2.5 rounded-xl border text-center font-bold transition ${fitStyle === f.id ? 'bg-slate-950 text-white border-slate-950 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-1.5">
                            <Info size={13} className="shrink-0 mt-0.5 text-slate-400" />
                            <span>{fitNotes[fitStyle]}</span>
                        </p>
                    </div>

                    {/* AI Calculation Result Card */}
                    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
                                <Sparkles size={14} /> Recommended Size for You
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                                {confidence}% biometric confidence for this garment cut
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-mono font-black text-2xl shadow-lg shadow-indigo-600/30">
                            {recommendedSize}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (onSelectSize) onSelectSize(recommendedSize);
                            onClose();
                        }}
                        className="flex-1 py-3 px-4 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow flex items-center justify-center gap-2"
                    >
                        <Check size={14} /> Apply Size {recommendedSize} to Product
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FitFinderModal;
