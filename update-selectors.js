const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', '(admin)', 'reports', 'survey');

// Pages to process
const pages = [
  'analysis', 'behavior', 'completion-time', 'devices', 'drop-off', 
  'location', 'open-questions', 'overview', 'question-time', 'questions', 'time', 'user-type'
];

const targetPattern = `          <div className="relative mb-6" ref={surveyRef}>
            <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm" onClick={() => setIsSurveyOpen(!isSurveyOpen)}>
              <span className="text-[14px] text-[#334155] font-sans tracking-tight">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</span>
              <ChevronDown size={20} className="text-gray-400 print:hidden" />
            </div>
            {isSurveyOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 print:hidden">
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#334155] font-sans">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</div>
              </div>
            )}
          </div>`;

const targetPatternRegexAlternative = /<div className="relative mb-6" ref=\{surveyRef\}>[\s\S]*?\{isSurveyOpen && \([\s\S]*?\}\)\n\s*<\/div>/g;

pages.forEach(page => {
  const filePath = path.join(baseDir, page, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace the block with <SurveySelector />
    content = content.replace(targetPatternRegexAlternative, '<SurveySelector />');
    
    // Add import statement at the top if not already added
    if (!content.includes('import SurveySelector')) {
        // Insert after lucide-react or first import
        content = content.replace(/import \{[\s\S]*?\} from "lucide-react";/, match => `${match}\nimport SurveySelector from "@/components/SurveySelector";`);
    }

    // Clean up unused state variables to prevent lint errors
    content = content.replace(/\s*const \[isSurveyOpen, setIsSurveyOpen\] = useState\(false\);\n/, '');
    content = content.replace(/\s*const surveyRef = useRef<HTMLDivElement>\(null\);\n/, '');
    
    // Clean up unused reference function
    const effectStr = `  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (surveyRef.current && !surveyRef.current.contains(event.target as Node)) {
        setIsSurveyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);\n`;

    content = content.replace(effectStr, '');

    // Cleanup ChevronDown unused import from lucide-react if we safely can (harder with regex without parsing AST, but we can try removing it)
    content = content.replace(/,\s*ChevronDown/, '');
    content = content.replace(/ChevronDown,\s*/, '');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${page}/page.tsx`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
