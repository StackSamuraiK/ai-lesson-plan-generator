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
import { Loader2 } from 'lucide-react';

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
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Lesson Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Topic
              </label>
              <Input
                name="topic"
                value={lessonPlan.topic}
                onChange={handleChange}
                placeholder="Enter lesson topic"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Grade Level
              </label>
              <Input
                name="gradeLevel"
                value={lessonPlan.gradeLevel}
                onChange={handleChange}
                placeholder="Enter grade level"
                required
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-left">Lesson Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Main Concept
                    </label>
                    <Textarea
                      name="mainConcept"
                      value={lessonPlan.mainConcept}
                      onChange={handleChange}
                      placeholder="Enter main concept and subtopics"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Materials Needed
                    </label>
                    <Textarea
                      name="materials"
                      value={lessonPlan.materials}
                      onChange={handleChange}
                      placeholder="List required materials"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Learning Objectives
                    </label>
                    <Textarea
                      name="objectives"
                      value={lessonPlan.objectives}
                      onChange={handleChange}
                      placeholder="Enter learning objectives"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Lesson Outline
                    </label>
                    <Textarea
                      name="outline"
                      value={lessonPlan.outline}
                      onChange={handleChange}
                      placeholder="Enter lesson outline"
                      required
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                'Create Lesson Plan'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}