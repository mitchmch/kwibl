import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { getCountryFromCoords, searchBusinesses, getComplaintScenarios, ComplaintScenario } from '../services/geminiService';

interface Props {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; category: string; companyName: string; attachment?: string }) => void;
  industries: string[];
}

type Step = 1 | 2 | 3 | 4 | 5;

interface BusinessItem {
    name: string;
    logo: string;
}

export const CreateComplaintFlow: React.FC<Props> = ({ onClose, onSubmit, industries }) => {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [title, setTitle] = useState('');
  // removed draftDescription as we now flow directly to finalDescription
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const [industry, setIndustry] = useState(industries[0] || 'General');
  const [businessList, setBusinessList] = useState<BusinessItem[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [customBusiness, setCustomBusiness] = useState('');
  
  // Scenarios State
  const [scenarios, setScenarios] = useState<ComplaintScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [finalDescription, setFinalDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Step 1: Location ---
  const detectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const country = await getCountryFromCoords(position.coords.latitude, position.coords.longitude);
        setLocation(country);
        setIsLocating(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        // Do not force fallback if we just fail to get location automatically, let user type.
        // But if they clicked the button, we should stop loading.
        if (!location) setLocation('United States'); 
        setIsLocating(false);
      }, { timeout: 10000 });
    } else {
      setLocation('United States');
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // --- File Handling ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachmentName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Step 2: Business Search ---
  const fetchBusinesses = async (loc = location, ind = industry) => {
    setIsLoading(true);
    const results = await searchBusinesses(loc, ind);
    setBusinessList(results);
    setIsLoading(false);
  };

  const handleIndustryChange = (newIndustry: string) => {
    setIndustry(newIndustry);
    setBusinessList([]);
    fetchBusinesses(location, newIndustry);
  };

  // --- Step 3: Load Scenarios ---
  const loadScenarios = async () => {
    setIsLoading(true);
    const business = selectedBusiness === 'Other' ? customBusiness : selectedBusiness;
    const results = await getComplaintScenarios(business, industry);
    setScenarios(results);
    // Reset description if not already set, or keep previous if user went back
    if (!finalDescription) {
        setFinalDescription('');
    }
    setIsLoading(false);
  };

  // Handle Dynamic Field Changes
  const handleDynamicFieldChange = (field: string, value: string) => {
    const newFields = { ...dynamicFields, [field]: value };
    setDynamicFields(newFields);
    
    // Auto-update description based on template
    if (selectedScenarioId) {
        const scenario = scenarios.find(s => s.id === selectedScenarioId);
        if (scenario) {
            let compiledText = scenario.template;
            // Replace all placeholders
            scenario.fields.forEach(f => {
                const val = newFields[f] || `[${f}]`;
                // Global replace for {{Field}}
                compiledText = compiledText.split(`{{${f}}}`).join(val);
            });
            setFinalDescription(compiledText);
        }
    }
  };

  const selectScenario = (scenario: ComplaintScenario) => {
      setSelectedScenarioId(scenario.id);
      setDynamicFields({});
      
      // Initial compilation with empty placeholders
      let compiledText = scenario.template;
      scenario.fields.forEach(f => {
         compiledText = compiledText.split(`{{${f}}}`).join(`[${f}]`);
      });
      setFinalDescription(compiledText);
  };

  const useBlankDraft = () => {
      setSelectedScenarioId(null);
      setFinalDescription('');
  };

  // --- Navigation ---
  const nextStep = async () => {
    if (step === 2) {
       // Moving from Company to Scenarios
       await loadScenarios();
       setStep(3);
    } else if (step === 1) {
        if (!location) return; // Validation
        setStep(2);
        // Trigger fetch if list is empty or stale. Using timeout to ensure state update if any
        if (businessList.length === 0) {
            fetchBusinesses(location, industry);
        }
    } else if (step === 2 && (!selectedBusiness || (selectedBusiness === 'Other' && !customBusiness))) {
        // Validation for step 2
        return;
    } else {
       setStep(prev => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    setStep(prev => (prev - 1) as Step);
  };

  const handleFinalSubmit = () => {
    const business = selectedBusiness === 'Other' ? customBusiness : selectedBusiness;
    onSubmit({
      title,
      description: finalDescription,
      category: industry,
      companyName: business,
      attachment: attachment || undefined
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {[1, 2, 3, 4, 5].map(num => (
        <div key={num} className="flex flex-col items-center relative z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
            step >= num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {step > num ? <Icons.CheckCircle className="w-5 h-5" /> : num}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${step >= num ? 'text-indigo-600' : 'text-slate-400'}`}>
            {num === 1 ? 'Loc' : num === 2 ? 'Company' : num === 3 ? 'Scenario' : num === 4 ? 'Details' : 'Review'}
          </span>
        </div>
      ))}
      {/* Progress Bar Background */}
      <div className="absolute top-9 left-6 right-6 h-0.5 bg-slate-200 -z-0">
         <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
         ></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900">File New Complaint</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Icons.LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 relative">
          {renderStepIndicator()}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Where did this happen?</h4>
                <p className="text-slate-500 text-sm">We'll use this to find relevant businesses.</p>
              </div>
              
              <div className="max-w-xs mx-auto">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Country / Region</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      placeholder="e.g. United States"
                    />
                    <div className="absolute left-3 top-3.5 text-slate-400">
                        {isLocating ? <Icons.Activity className="w-5 h-5 animate-spin" /> : <Icons.Globe className="w-5 h-5" />}
                    </div>
                 </div>
                 <button 
                   onClick={detectLocation}
                   className="mt-2 text-xs text-indigo-600 font-medium hover:underline flex items-center justify-center w-full"
                 >
                   <Icons.Activity className="w-3 h-3 mr-1" /> Re-detect Location
                 </button>
              </div>
            </div>
          )}

          {/* Step 2: Company */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Icons.Briefcase className="w-6 h-6 text-indigo-600" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-900">Who is this about?</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select 
                   value={industry} 
                   onChange={(e) => handleIndustryChange(e.target.value)} 
                   className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                 <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-slate-700">Select Business</label>
                    <button onClick={() => fetchBusinesses(location, industry)} className="text-xs text-indigo-600 font-bold hover:underline">
                        Refresh List
                    </button>
                 </div>
                 
                 {isLoading ? (
                     <div className="p-8 text-center">
                         <Icons.Activity className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                         <p className="text-sm text-slate-500">Searching businesses in {location}...</p>
                     </div>
                 ) : (
                     <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {businessList.map((biz, idx) => (
                            <div 
                                key={`${biz.name}-${idx}`}
                                onClick={() => setSelectedBusiness(biz.name)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                                    selectedBusiness === biz.name
                                    ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                                    : 'bg-white border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                                    {biz.logo ? (
                                        <img 
                                            src={biz.logo} 
                                            alt={biz.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('fallback-icon'); }}
                                        />
                                    ) : null}
                                    <Icons.Briefcase className="w-4 h-4 text-slate-400 absolute fallback-element" style={{opacity: biz.logo ? 0 : 1}} /> 
                                </div>
                                <span className="text-sm font-medium text-slate-900 line-clamp-2">{biz.name}</span>
                            </div>
                        ))}
                        <div 
                            onClick={() => setSelectedBusiness('Other')}
                            className={`p-3 rounded-lg border border-dashed cursor-pointer transition-all flex items-center justify-center ${
                                selectedBusiness === 'Other' 
                                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                                : 'bg-white border-slate-300 hover:border-indigo-300'
                            }`}
                        >
                             <span className="text-sm font-medium text-slate-600">Other / Not Listed</span>
                        </div>
                     </div>
                 )}
              </div>

              {selectedBusiness === 'Other' && (
                  <div className="animate-fade-in">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Enter Business Name</label>
                      <input 
                        value={customBusiness}
                        onChange={(e) => setCustomBusiness(e.target.value)}
                        className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type the business name..."
                      />
                  </div>
              )}
            </div>
          )}

          {/* Step 3: AI Scenarios */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
               <div className="text-center mb-6">
                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Icons.Star className="w-6 h-6 text-indigo-600" />
                   </div>
                   <h4 className="text-lg font-bold text-slate-900">What kind of issue?</h4>
                   <p className="text-sm text-slate-500">Select a scenario to help us auto-fill the complaint details.</p>
               </div>

               {isLoading ? (
                   <div className="p-12 text-center border rounded-xl bg-slate-50">
                       <Icons.Activity className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                       <p className="text-sm text-slate-600 font-medium">Loading scenarios...</p>
                   </div>
               ) : (
                   <div className="space-y-6">
                       {/* Scenario Chips */}
                       <div className="flex flex-wrap gap-2 justify-center">
                           <button 
                               onClick={useBlankDraft}
                               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                   selectedScenarioId === null
                                   ? 'bg-slate-900 text-white shadow-md'
                                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                               }`}
                           >
                               Generic / Blank
                           </button>
                           {scenarios.map(s => (
                               <button 
                                   key={s.id}
                                   onClick={() => selectScenario(s)}
                                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                       selectedScenarioId === s.id
                                       ? 'bg-indigo-600 text-white shadow-md'
                                       : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                   }`}
                               >
                                   {s.label}
                               </button>
                           ))}
                       </div>
                       
                       {/* Dynamic Fields Section */}
                       {selectedScenarioId && (
                           <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                               <h5 className="font-bold text-slate-800 mb-4 flex items-center">
                                   <Icons.List className="w-4 h-4 mr-2" /> 
                                   Required Information
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                   {scenarios.find(s => s.id === selectedScenarioId)?.fields.map(field => (
                                       <div key={field}>
                                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field}</label>
                                           <input 
                                               type="text" 
                                               value={dynamicFields[field] || ''}
                                               onChange={(e) => handleDynamicFieldChange(field, e.target.value)}
                                               className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                               placeholder={`Enter ${field}`}
                                           />
                                       </div>
                                   ))}
                               </div>
                               <p className="text-xs text-slate-500">These details will be used to generate your complaint description in the next step.</p>
                           </div>
                       )}
                   </div>
               )}
            </div>
          )}

          {/* Step 4: Details (Title, Description, Attachments) */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-lg font-bold text-slate-900">Complaint Details</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Summarize the issue (e.g., 'Overcharged on billing')" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required 
                  value={finalDescription} 
                  onChange={e => setFinalDescription(e.target.value)} 
                  rows={8} 
                  className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-sm" 
                  placeholder="Explain what went wrong in your own words. If you selected a scenario, this is auto-filled for you." 
                />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Evidence (Optional)</label>
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-colors"
                 >
                    {attachmentName ? (
                        <div className="flex items-center justify-center text-indigo-600">
                            <Icons.CheckCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium">{attachmentName}</span>
                            <span className="ml-2 text-xs text-slate-400">(Click to change)</span>
                        </div>
                    ) : (
                        <div className="text-slate-500">
                            <Icons.Paperclip className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <span className="text-sm">Click to upload images or documents</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                    />
                 </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Target</span>
                        <div className="font-bold text-lg text-slate-900">{selectedBusiness === 'Other' ? customBusiness : selectedBusiness}</div>
                        <div className="text-xs text-slate-500">{location} • {industry}</div>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Title</span>
                        <div className="font-semibold text-slate-900">{title}</div>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Complaint</span>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap mt-1">{finalDescription}</div>
                    </div>
                    {attachmentName && (
                        <div>
                             <span className="text-xs font-bold text-slate-500 uppercase">Attachments</span>
                             <div className="flex items-center text-indigo-600 text-sm mt-1">
                                 <Icons.Paperclip className="w-4 h-4 mr-1" /> {attachmentName}
                             </div>
                        </div>
                    )}
                </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-between bg-white rounded-b-2xl">
           <button 
             onClick={prevStep}
             disabled={step === 1 || isLoading}
             className="px-6 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Back
           </button>

           {step < 5 ? (
               <button 
                 onClick={nextStep}
                 disabled={
                     isLoading ||
                     (step === 1 && !location) || 
                     (step === 2 && (!selectedBusiness || (selectedBusiness === 'Other' && !customBusiness))) ||
                     (step === 4 && (!title || !finalDescription))
                 }
                 className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 flex items-center"
               >
                 {isLoading ? 'Processing...' : 'Next'}
                 {!isLoading && <Icons.LogOut className="w-4 h-4 ml-2 rotate-180 transform" />}
               </button>
           ) : (
               <button 
                 onClick={handleFinalSubmit}
                 className="px-8 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center"
               >
                 Submit Complaint
                 <Icons.CheckCircle className="w-4 h-4 ml-2" />
               </button>
           )}
        </div>
      </div>
    </div>
  );
};