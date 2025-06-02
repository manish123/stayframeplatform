import { useState } from 'react';
import { ChevronDown, Search, Image, Edit3, Download, Eye, Menu, X, Palette, Type, Move, RotateCcw, ChevronRight, Grid, Layers, Zap, Monitor, Smartphone } from 'lucide-react';

const ResponsiveQuoteLayouts = () => {
  const [activeLayout, setActiveLayout] = useState('sidebar');
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
  const [showInspector, setShowInspector] = useState(false);

  const layouts = {
    sidebar: 'Sidebar Layout',
    split: 'Split View',
    workflow: 'Workflow Steps',
    dashboard: 'Dashboard Style'
  };

  // Layout 1: Sidebar Layout (Best for Desktop + Mobile)
  const SidebarLayout = () => {
    const [activeTool, setActiveTool] = useState('template');
    const [selectedQuote, setSelectedQuote] = useState("The only way to do great work is to love what you do.");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const tools = [
      { id: 'template', label: 'Templates', icon: Palette, color: 'text-purple-600' },
      { id: 'theme', label: 'Themes', icon: Grid, color: 'text-blue-600' },
      { id: 'image', label: 'Images', icon: Image, color: 'text-green-600' },
      { id: 'edit', label: 'Edit', icon: Edit3, color: 'text-orange-600' }
    ];

    return (
      <div className={`h-screen bg-gray-50 flex ${viewMode === 'mobile' ? 'w-96' : 'w-full'}`}>
        {/* Sidebar */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          viewMode === 'mobile' 
            ? (sidebarOpen ? 'w-full' : 'w-0 overflow-hidden') 
            : (sidebarOpen ? 'w-80' : 'w-16')
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 ${!sidebarOpen && viewMode !== 'mobile' ? 'hidden' : ''}`}>
              Quote Generator
            </h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {viewMode === 'mobile' ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Tool Navigation */}
          <div className="p-4">
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTool === tool.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  } ${!sidebarOpen && viewMode !== 'mobile' ? 'justify-center' : ''}`}
                >
                  <tool.icon className={tool.color} size={20} />
                  <span className={`font-medium ${!sidebarOpen && viewMode !== 'mobile' ? 'hidden' : ''}`}>
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tool Content */}
          {(sidebarOpen || viewMode === 'mobile') && (
            <div className="p-4 border-t border-gray-100 flex-1 overflow-y-auto">
              {activeTool === 'template' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Choose Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Minimal', 'Bold', 'Elegant', 'Modern'].map((template) => (
                      <div key={template} className="border-2 border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 cursor-pointer transition-colors">
                        <div className="h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                        <span className="text-sm font-medium">{template}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'theme' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Select Theme</h3>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Motivation</option>
                    <option>Love</option>
                    <option>Success</option>
                    <option>Life</option>
                  </select>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search quotes..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {[
                      "The only way to do great work is to love what you do.",
                      "Life is what happens when you're busy making other plans.",
                      "The future belongs to those who believe in their dreams."
                    ].map((quote, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedQuote(quote)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedQuote === quote ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-sm italic">"{quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'image' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Background Images</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search Unsplash..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"></div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'edit' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Element Inspector</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Quote Text</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg" 
                      rows={3} 
                      defaultValue={selectedQuote}
                    ></textarea>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size: 18px</label>
                      <input type="range" className="w-full" min="12" max="48" defaultValue="18" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Position X: 50%</label>
                      <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Position Y: 50%</label>
                      <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            {viewMode === 'mobile' && !sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
            
            <div className="flex items-center justify-between ml-auto">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Eye size={16} />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-6 bg-gray-100">
            <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center text-white p-8 max-w-lg">
                <p className="text-2xl font-bold mb-4 leading-relaxed">"{selectedQuote}"</p>
                <p className="text-lg opacity-90">- Steve Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Layout 2: Split View Layout
  const SplitViewLayout = () => {
    const [activePanel, setActivePanel] = useState('theme');

    return (
      <div className={`h-screen bg-gray-50 ${viewMode === 'mobile' ? 'w-96' : 'w-full'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Quote Generator</h1>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className={`flex h-[calc(100vh-80px)] ${viewMode === 'mobile' ? 'flex-col' : ''}`}>
          {/* Left Panel - Tools */}
          <div className={`bg-white border-r border-gray-200 ${viewMode === 'mobile' ? 'h-1/2' : 'w-1/2'}`}>
            {/* Panel Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {['Template', 'Theme', 'Image', 'Edit'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePanel(tab.toLowerCase())}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activePanel === tab.toLowerCase()
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6 h-full overflow-y-auto">
              {activePanel === 'theme' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Motivation</option>
                      <option>Success</option>
                      <option>Life</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search quotes..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    {[
                      "The only way to do great work is to love what you do.",
                      "Innovation distinguishes between a leader and a follower.",
                      "Stay hungry, stay foolish."
                    ].map((quote, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                        <p className="text-sm italic text-gray-700">"{quote}"</p>
                        <p className="text-xs text-gray-500 mt-2">- Steve Jobs</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'edit' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Text Content</label>
                    <textarea 
                      className="w-full p-4 border border-gray-300 rounded-lg" 
                      rows={4} 
                      defaultValue="The only way to do great work is to love what you do."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size</label>
                      <input type="range" className="w-full" min="12" max="48" defaultValue="24" />
                      <span className="text-xs text-gray-500">24px</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Line Height</label>
                      <input type="range" className="w-full" min="1" max="2" step="0.1" defaultValue="1.4" />
                      <span className="text-xs text-gray-500">1.4</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Position X</label>
                      <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                      <span className="text-xs text-gray-500">50%</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Position Y</label>
                      <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                      <span className="text-xs text-gray-500">50%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Canvas */}
          <div className={`bg-gray-100 p-6 ${viewMode === 'mobile' ? 'h-1/2' : 'w-1/2'}`}>
            <div className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-md">
                <p className="text-xl font-bold mb-3 leading-relaxed">"The only way to do great work is to love what you do."</p>
                <p className="opacity-90">- Steve Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Layout 3: Workflow Steps (Desktop: Horizontal, Mobile: Vertical)
  const WorkflowLayout = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
      { id: 1, title: 'Template', icon: Palette },
      { id: 2, title: 'Theme', icon: Grid },
      { id: 3, title: 'Image', icon: Image },
      { id: 4, title: 'Canvas', icon: Edit3 }
    ];

    return (
      <div className={`h-screen bg-gray-50 ${viewMode === 'mobile' ? 'w-96' : 'w-full'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-center text-gray-800">Quote Generator</h1>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className={`flex ${viewMode === 'mobile' ? 'justify-between' : 'justify-center space-x-8'}`}>
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center cursor-pointer ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon size={20} />
                  </div>
                  <span className={`ml-3 font-medium ${viewMode === 'mobile' ? 'hidden' : ''}`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && viewMode !== 'mobile' && (
                  <ChevronRight className="ml-4 text-gray-400" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6">
          {currentStep === 4 && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Canvas Editor</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    Export
                  </button>
                </div>
              </div>
              
              <div className={`flex gap-6 flex-1 ${viewMode === 'mobile' ? 'flex-col' : ''}`}>
                <div className={`bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center ${
                  viewMode === 'mobile' ? 'h-64' : 'flex-1'
                }`}>
                  <div className="text-center text-white p-6">
                    <p className="text-xl font-bold mb-3">"Innovation distinguishes between a leader and a follower."</p>
                    <p className="opacity-90">- Steve Jobs</p>
                  </div>
                </div>
                
                <div className={`bg-white rounded-lg border border-gray-200 p-4 ${
                  viewMode === 'mobile' ? 'flex-1' : 'w-80'
                }`}>
                  <h3 className="font-semibold mb-4">Element Inspector</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quote Text</label>
                      <textarea className="w-full p-3 border border-gray-300 rounded-lg" rows={3}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Size</label>
                        <input type="range" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <input type="range" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep !== 4 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Step {currentStep}: {steps[currentStep-1]?.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({length: 6}).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <span className="text-gray-500">Option {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-between">
          <button 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Layout 4: Dashboard Style
  const DashboardLayout = () => {
    return (
      <div className={`h-screen bg-gray-50 ${viewMode === 'mobile' ? 'w-96' : 'w-full'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Quote Generator Dashboard</h1>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-4 p-4 h-[calc(100vh-80px)] ${
          viewMode === 'mobile' 
            ? 'grid-cols-1 grid-rows-4' 
            : 'grid-cols-3 grid-rows-3'
        }`}>
          {/* Templates */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Palette className="mr-2 text-purple-600" size={16} />
              Templates
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Minimal', 'Bold', 'Elegant', 'Modern'].map((template) => (
                <div key={template} className="aspect-square bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <span className="text-xs">{template}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Grid className="mr-2 text-blue-600" size={16} />
              Themes
            </h3>
            <select className="w-full p-2 border border-gray-300 rounded mb-3">
              <option>Motivation</option>
              <option>Success</option>
              <option>Life</option>
            </select>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {["Great quote here", "Another inspiring quote", "Third motivational quote"].map((quote, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded text-xs cursor-pointer hover:bg-gray-100 transition-colors">
                  {quote}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Image className="mr-2 text-green-600" size={16} />
              Images
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded cursor-pointer hover:opacity-80 transition-opacity"></div>
              ))}
            </div>
          </div>

          {/* Canvas - Takes up 2x2 on desktop, full width on mobile */}
          <div className={`bg-white rounded-lg border border-gray-200 p-4 ${
            viewMode === 'mobile' ? '' : 'col-span-2 row-span-2'
          }`}>
            <h3 className="font-semibold mb-3 flex items-center">
              <Edit3 className="mr-2 text-orange-600" size={16} />
              Canvas
            </h3>
            <div className="h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
              <div className="text-center p-4">
                <p className="font-bold text-lg mb-2">"Your Quote Here"</p>
                <p className="opacity-90">- Author</p>
              </div>
            </div>
          </div>

          {/* Element Inspector */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Type className="mr-2 text-red-600" size={16} />
              Inspector
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Font Size</label>
                <input type="range" className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Position</label>
                <input type="range" className="w-full" />
              </div>
              <button className="w-full py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLayout = () => {
    switch(activeLayout) {
      case 'sidebar': return <SidebarLayout />;
      case 'split': return <SplitViewLayout />;
      case 'workflow': return <WorkflowLayout />;
      case 'dashboard': return <DashboardLayout />;
      default: return <SidebarLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Layout Controls */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-40">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <div className="flex gap-2 mr-4">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-lg ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-lg ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Smartphone size={20} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(layouts).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveLayout(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeLayout === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`ml-4 p-2 rounded-lg ${
              showInspector ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Layers size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`p-4 ${viewMode === 'mobile' ? 'max-w-md mx-auto' : ''}`}>
        {renderLayout()}
      </div>
      
      {/* Inspector Panel */}
      {showInspector && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Element Inspector</h3>
            <button 
              onClick={() => setShowInspector(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Element</label>
              <div className="p-3 bg-gray-50 rounded-md text-sm">Quote Text</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Properties</label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Font Size</span>
                    <span>18px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="48" 
                    defaultValue="18" 
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Color</span>
                    <span>#000000</span>
                  </div>
                  <input 
                    type="color" 
                    defaultValue="#000000" 
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveQuoteLayouts;