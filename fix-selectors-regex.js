const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', '(admin)', 'reports', 'survey');
const pages = [
  'analysis', 'behavior', 'completion-time', 'devices', 'drop-off', 
  'location', 'open-questions', 'overview', 'question-time', 'questions', 'time', 'user-type'
];

pages.forEach(page => {
  const filePath = path.join(baseDir, page, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove the old block using a regex that captures from className="relative mb-6" until {isSurveyOpen && (...) } </div>
    const blockRegex = /<div\s+className="relative mb-6"(?:\s+ref=\{surveyRef\})?>[\s\S]*?\{isSurveyOpen\s*&&\s*\([\s\S]*?\}\s*\)\}\s*<\/div>/g;
    
    // Check if the file still has the old block
    if (blockRegex.test(content)) {
        content = content.replace(blockRegex, '<SurveySelector />');
    }

    // Since we also did import of SurveySelector, don't double import
    // But remove ChevronDown, etc.
    content = content.replace(/,\s*ChevronDown/, '');
    content = content.replace(/ChevronDown,\s*/, '');
    
    content = content.replace(/\s*const \[isSurveyOpen, setIsSurveyOpen\] = useState\(false\);\n/, '');
    content = content.replace(/\s*const surveyRef = useRef<HTMLDivElement>\(null\);\n/, '');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fully patched ${page}/page.tsx`);
  }
});
