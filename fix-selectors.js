const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', '(admin)', 'reports', 'survey');

const pages = [
  'analysis', 'behavior', 'completion-time', 'devices', 'drop-off', 
  'location', 'open-questions', 'overview', 'question-time', 'questions', 'time', 'user-type'
];

// We will locate the block safely by finding the start and end indices.
// Start: `<div className="relative mb-6" ref={surveyRef}>`
// However, since surveyRef was removed, it might be literally that string or just the block.

pages.forEach(page => {
  const filePath = path.join(baseDir, page, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find where the block begins
    const startIdx1 = content.indexOf('<div className="relative mb-6" ref={surveyRef}>');
    const startIdx2 = content.indexOf('<div className="relative mb-6">');
    const startIdx = startIdx1 !== -1 ? startIdx1 : startIdx2;

    if (startIdx !== -1) {
        // Find the following <h2> tag which marks the end of the survey drop down block safely
        const endIdx = content.indexOf('<h2 className=', startIdx);
        
        if (endIdx !== -1) {
            const before = content.substring(0, startIdx);
            const after = content.substring(endIdx);
            
            content = before + '<SurveySelector />\n\n          ' + after;
        }
    }

    // Now, some files might still have those dangling variables if the first script was run and failed halfway,
    // or if the script only partially stripped things. We must ensure:
    // ChevronDown is removed from lucide-react if present.
    // isSurveyOpen, setIsSurveyOpen, surveyRef are definitely gone.

    // Let's do a safe string replacement instead of regexes that might miss
    
    content = content.replace(/const \[isSurveyOpen, setIsSurveyOpen\] = useState\(false\);/, '');
    content = content.replace(/const surveyRef = useRef<HTMLDivElement>\(null\);/, '');
    
    // Some lines might look like `export default function Report() {  const [isReloading...`
    // Let's format it slightly better if needed, but not strictly necessary.
    content = content.replace(/{\s*const \[isReloading/, '{\n  const [isReloading');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Successfully patched ${page}/page.tsx`);
  }
});
