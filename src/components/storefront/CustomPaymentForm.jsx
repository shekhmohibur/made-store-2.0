import { useState } from 'react';
import { Copy, Check, Info, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import ImageUploadInput from '../common/ImageUploadInput';

/**
 * CustomPaymentForm:
 * Interactive payment verification form displayed to customers when paying
 * via merchant's custom payment channels (e.g. bKash, Nagad, Bank Wire, Crypto/USDT).
 */
const CustomPaymentForm = ({
    method,
    paymentData,
    onChange,
    errors = {}
}) => {
    const [copied, setCopied] = useState(false);

    if (!method) return null;

    const handleCopyAccount = () => {
        if (!method.accountNumber) return;
        navigator.clipboard.writeText(method.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-4 animate-in fade-in zoom-in-95">
            {/* Account Details & 1-Click Copy */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-indigo-600" />
                        Merchant Account / Wallet:
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        {method.accountType || 'Official Account'}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 text-white rounded-lg font-mono text-xs">
                    <span className="font-bold tracking-wider truncate select-all">
                        {method.accountNumber || 'Contact Merchant for Account Details'}
                    </span>
                    {method.accountNumber && (
                        <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-sans font-bold flex items-center gap-1 shrink-0 transition"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>

                {method.instructions && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 pt-1 leading-relaxed">
                        <Info size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span>{method.instructions}</span>
                    </div>
                )}
            </div>

            {/* Verification Inputs */}
            <div className="space-y-3 pt-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1">
                    <FileText size={13} /> Payment Verification Details *
                </p>

                {/* Transaction ID / Reference ID */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Transaction ID (TrxID) / Ref # {method.requireTrxId !== false ? '*' : '(Optional)'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">e.g. 9J83KA72L</span>
                    </label>
                    <input
                        type="text"
                        required={method.requireTrxId !== false}
                        value={paymentData.trxId || ''}
                        onChange={(e) => onChange('trxId', e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        placeholder="Enter the Transaction ID received after payment"
                        className={`w-full px-3.5 py-2.5 text-xs font-mono bg-white border rounded-xl focus:outline-none transition ${
                            errors.trxId ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 focus:border-indigo-600'
                        }`}
                    />
                    {errors.trxId && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.trxId}
                        </p>
                    )}
                </div>

                {/* Sender Mobile / Account Number */}
                {method.requireSenderNumber !== false && (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Sender Phone / Account # *</span>
                            <span className="text-[10px] text-slate-400 font-normal">Your payment number</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={paymentData.senderNumber || ''}
                            onChange={(e) => onChange('senderNumber', e.target.value)}
                            placeholder="Enter the phone/account number you paid from"
                            className={`w-full px-3.5 py-2.5 text-xs font-mono bg-white border rounded-xl focus:outline-none transition ${
                                errors.senderNumber ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 focus:border-indigo-600'
                            }`}
                        />
                        {errors.senderNumber && (
                            <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.senderNumber}
                            </p>
                        )}
                    </div>
                )}

                {/* Receipt Screenshot Upload */}
                {method.requireReceipt && (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Payment Proof / Receipt Screenshot (Optional but recommended)
                        </label>
                        <ImageUploadInput
                            value={paymentData.receiptImage || ''}
                            onChange={(dataUrl) => onChange('receiptImage', dataUrl)}
                            label="Attach Payment Receipt Screenshot"
                            maxDimension={900}
                            quality={0.65}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomPaymentForm;
