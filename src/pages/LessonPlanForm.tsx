import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import type { LessonPlan } from '@/types';
import { generateLessonPlan } from '../types/gemini'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Loader2, BookOpen, GraduationCap, Target, Package, FileText, Clock } from 'lucide-react';

export default function LessonPlanForm() {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    topic: '',
    gradeLevel: '',
    mainConcept: '',
    materials: '',
    objectives: '',
    outline: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLessonPlan(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = (content: string) => {
    const doc = new jsPDF();
    
    
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(`Lesson Plan: ${lessonPlan.topic}`, 20, 20);
  
    
    let yPos = 40;
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Grade Level: ${lessonPlan.gradeLevel}`, 20, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, yPos);
    
    
    const sections = content.split('SECTION');
    let currentY = 50;
  
    sections.forEach((section, index) => {
      if (index === 0) return; 
  
      const [sectionTitle, ...sectionContent] = section.split('\n');
      const cleanContent = sectionContent.join('\n').trim();
  
      
      (doc as any).autoTable({
        startY: currentY,
        head: [[sectionTitle.replace(/\d+:/, '').trim()]],
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 14,
          fontStyle: 'bold'
        },
        body: [],
        margin: { top: 10 }
      });
  
      currentY = (doc as any).lastAutoTable.finalY + 5;
  
      
      if (sectionTitle.includes('TIMELINE')) {
        
        const rows = cleanContent.split('\n')
          .filter(row => row.trim())
          .map(row => row.split('|').map(cell => cell.trim()));
        
        (doc as any).autoTable({
          startY: currentY,
          head: [['Duration', 'Activity', 'Instructions', 'Notes']],
          body: rows,
          headStyles: { fillColor: [71, 172, 239] },
          styles: { cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 70 },
            3: { cellWidth: 50 }
          }
        });
      } else {
        
        (doc as any).autoTable({
          startY: currentY,
          body: cleanContent.split('\n')
            .filter(line => line.trim())
            .map(line => [line.trim()]),
          styles: { 
            cellPadding: 5,
            fontSize: 11
          },
          columnStyles: {
            0: { cellWidth: 'auto' }
          }
        });
      }
  
      currentY = (doc as any).lastAutoTable.finalY + 10;
    });
  
    
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }
  
    doc.save(`lesson-plan-${lessonPlan.topic.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const savedPlans = JSON.parse(localStorage.getItem('lessonPlans') || '[]');
      savedPlans.push(lessonPlan);
      localStorage.setItem('lessonPlans', JSON.stringify(savedPlans));

      
      const generatedContent = await generateLessonPlan(lessonPlan);
      
      
      generatePDF(generatedContent);

      toast.success('Lesson plan generated and saved successfully');

      
      setLessonPlan({
        topic: '',
        gradeLevel: '',
        mainConcept: '',
        materials: '',
        objectives: '',
        outline: ''
      });
    } catch (error) {
      toast.error('Failed to generate lesson plan. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg dark:shadow-black/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
            Lesson Plan Creator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Design engaging educational experiences with ease</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
          <div className="p-8">
            <div className="space-y-8">
              {/* Essential Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Topic
                  </label>
                  <Input
                    name="topic"
                    value={lessonPlan.topic}
                    onChange={handleChange}
                    placeholder="Enter lesson topic"
                    required
                    className="h-12 border-slate-200 dark:border-slate-600 focus:border-indigo-300 dark:focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    <GraduationCap className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Grade Level
                  </label>
                  <Input
                    name="gradeLevel"
                    value={lessonPlan.gradeLevel}
                    onChange={handleChange}
                    placeholder="Enter grade level"
                    required
                    className="h-12 border-slate-200 dark:border-slate-600 focus:border-indigo-300 dark:focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Detailed Planning Section */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border border-slate-200 dark:border-slate-700 rounded-xl px-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg group-hover:from-indigo-200 group-hover:to-purple-200 dark:group-hover:from-indigo-800 dark:group-hover:to-purple-800 transition-all duration-200">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Lesson Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6 space-y-6">
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          <Target className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          Main Concept
                        </label>
                        <Textarea
                          name="mainConcept"
                          value={lessonPlan.mainConcept}
                          onChange={handleChange}
                          placeholder="Describe the core concept and key subtopics students will explore"
                          required
                          className="min-h-[100px] border-slate-200 dark:border-slate-600 focus:border-emerald-300 dark:focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          <Package className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          Materials Needed
                        </label>
                        <Textarea
                          name="materials"
                          value={lessonPlan.materials}
                          onChange={handleChange}
                          placeholder="List all resources, supplies, and materials required for this lesson"
                          required
                          className="min-h-[100px] border-slate-200 dark:border-slate-600 focus:border-amber-300 dark:focus:border-amber-400 focus:ring-amber-100 dark:focus:ring-amber-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          <Target className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          Learning Objectives
                        </label>
                        <Textarea
                          name="objectives"
                          value={lessonPlan.objectives}
                          onChange={handleChange}
                          placeholder="Define what students will be able to do by the end of this lesson"
                          required
                          className="min-h-[100px] border-slate-200 dark:border-slate-600 focus:border-blue-300 dark:focus:border-blue-400 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                        />
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          Lesson Outline
                        </label>
                        <Textarea
                          name="outline"
                          value={lessonPlan.outline}
                          onChange={handleChange}
                          placeholder="Outline the lesson structure, activities, and timeline"
                          required
                          className="min-h-[120px] border-slate-200 dark:border-slate-600 focus:border-purple-300 dark:focus:border-purple-400 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSubmit}
                  className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-xl hover:shadow-indigo-300 dark:hover:shadow-indigo-800/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      <span>Generating Your Lesson Plan...</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Create Lesson Plan
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}