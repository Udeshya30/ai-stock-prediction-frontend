
// Mock data for development purposes
export const getMockStockData = (symbol = 'AAPL') => {
  // Different data based on symbol to simulate API calls
  const stockProfiles = {
    'AAPL': {
      name: 'Apple Inc.',
      symbol: 'AAPL',
      currentPrice: 173.72,
      change: 2.34,
      changePercent: 1.37,
      shortTerm: {
        min: 170.50,
        max: 187.20,
        targetDate: 'Jun 15, 2025',
        currentPrice: 173.72
      },
      longTerm: {
        min: 168.90,
        max: 210.40,
        targetDate: 'Dec 20, 2025',
        currentPrice: 173.72
      },
      recommendation: {
        action: 'Buy',
        confidence: 78,
        reasoning: 'Strong product cycle with iPhone 16 and Vision Pro expansion. Services revenue growing at 15% YoY. Shareholder-friendly capital return policy.'
      },
      news: [
        { title: 'Apple Reports Q1 Earnings Beat, Services Revenue Hits New Record', source: 'Bloomberg', date: '2h ago' },
        { title: 'iPhone 16 Production Ramps Up as Apple Prepares for September Launch', source: 'Reuters', date: '5h ago' },
        { title: 'Apple\'s AI Features Set to Challenge Google and Microsoft', source: 'CNBC', date: '7h ago' },
        { title: 'Vision Pro International Expansion Planned for Q3', source: 'Financial Times', date: '1d ago' },
        { title: 'Apple Increases Chip Orders from TSMC for Next-Gen Devices', source: 'Nikkei', date: '1d ago' }
      ]
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      currentPrice: 415.28,
      change: -3.17,
      changePercent: -0.76,
      shortTerm: {
        min: 405.10,
        max: 437.50,
        targetDate: 'Jun 10, 2025',
        currentPrice: 415.28
      },
      longTerm: {
        min: 398.60,
        max: 472.30,
        targetDate: 'Nov 25, 2025',
        currentPrice: 415.28
      },
      recommendation: {
        action: 'Hold',
        confidence: 65,
        reasoning: 'Azure growth remains strong but valuation appears stretched. AI integration promising but competition intensifying in cloud services.'
      },
      news: [
        { title: 'Microsoft Announces New Copilot Features for Office Suite', source: 'TechCrunch', date: '3h ago' },
        { title: 'Azure AI Services Adoption Accelerates Among Enterprise Customers', source: 'ZDNet', date: '6h ago' },
        { title: 'Microsoft Plans $10B Investment in UK Data Centers', source: 'BBC', date: '9h ago' },
        { title: 'Xbox Game Pass Subscribers Reach 30 Million', source: 'The Verge', date: '1d ago' },
        { title: 'Microsoft Teams Gets Major UI Refresh and Performance Updates', source: 'Engadget', date: '1d ago' }
      ]
    },
    'GOOG': {
      name: 'Alphabet Inc.',
      symbol: 'GOOG',
      currentPrice: 154.87,
      change: 1.21,
      changePercent: 0.79,
      shortTerm: {
        min: 150.30,
        max: 168.70,
        targetDate: 'Jul 5, 2025',
        currentPrice: 154.87
      },
      longTerm: {
        min: 147.60,
        max: 182.40,
        targetDate: 'Jan 15, 2026',
        currentPrice: 154.87
      },
      recommendation: {
        action: 'Buy',
        confidence: 82,
        reasoning: 'Google Cloud gaining market share rapidly. Ad revenue resilient despite market concerns. Gemini AI capabilities driving new product adoption.'
      },
      news: [
        { title: 'Google I/O Event Showcases New AI Tools for Developers', source: 'Wired', date: '4h ago' },
        { title: 'YouTube Premium Subscribers Top 100 Million', source: 'Variety', date: '8h ago' },
        { title: 'Gemini AI Integration Coming to More Google Services', source: 'TechCrunch', date: '11h ago' },
        { title: 'Google Cloud Signs Major Deal with Global Financial Institution', source: 'Reuters', date: '1d ago' },
        { title: 'Android 16 Beta Released with Enhanced Privacy Features', source: 'The Verge', date: '2d ago' }
      ]
    }
  };

  // Default to Apple if symbol not found
  return stockProfiles[symbol] || stockProfiles['AAPL'];
};

export const getGlobalNews = () => {
  return [
    { title: 'Fed Signals Potential Rate Cut in September Meeting', source: 'Wall Street Journal', date: '2h ago' },
    { title: 'EU Regulators Approve $25B Tech Merger After Concessions', source: 'Financial Times', date: '4h ago' },
    { title: 'US Consumer Confidence Rises in April, Beating Expectations', source: 'Bloomberg', date: '7h ago' },
    { title: 'Global Supply Chain Issues Easing as Shipping Rates Normalize', source: 'Reuters', date: '10h ago' },
    { title: 'Tech Sector Leads Market Rally Amid Strong Earnings', source: 'CNBC', date: '12h ago' },
    { title: 'Housing Market Shows Signs of Recovery as Mortgage Rates Fall', source: 'CNN Business', date: '1d ago' }
  ];
};

export const getIndiaNews = () => {
  return [
    { title: 'RBI Maintains Repo Rate, Economic Growth Forecast at 7.2%', source: 'Economic Times', date: '3h ago' },
    { title: 'Sensex Hits New Record High, Crosses 75,000 Mark', source: 'Business Standard', date: '5h ago' },
    { title: 'IT Sector Revenue Growth Projections Raised for FY26', source: 'LiveMint', date: '8h ago' },
    { title: 'Foreign Investors Pour $3B into Indian Equities in April', source: 'Financial Express', date: '11h ago' },
    { title: 'Government Announces New PLI Scheme for Electronics Manufacturing', source: 'India Today', date: '14h ago' },
    { title: 'Indian Startups Raise $2.8B in Q1, Early-Stage Funding Rebounds', source: 'YourStory', date: '1d ago' }
  ];
};

export const getMarketData = () => {
  return {
    oil: {
      value: 78.42,
      change: -1.35
    },
    gold: {
      value: 2325.60,
      change: 0.82
    },
    dollarToRupee: {
      value: 82.73,
      change: -0.25
    }
  };
};
