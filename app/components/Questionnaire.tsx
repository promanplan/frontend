'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
}

const questions: Question[] = [
  {
    id: 'projectName',
    text: 'What is the name of your project?',
    type: 'text',
    required: true,
  },
  {
    id: 'projectType',
    text: 'What type of project is this?',
    type: 'select',
    options: ['Web Application', 'Mobile App', 'Desktop Application', 'API Service', 'Other'],
    required: true,
  },
  {
    id: 'description',
    text: 'Please provide a brief description of your project:',
    type: 'textarea',
    required: true,
  },
  {
    id: 'techStack',
    text: 'What technologies will you be using?',
    type: 'textarea',
    required: true,
  },
  {
    id: 'timeline',
    text: 'What is your expected project timeline?',
    type: 'text',
    required: true,
  },
];

export default function Questionnaire() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', answers);
      
      // Create a qa object with question text as keys and answers as values
      const qa: Record<string, string> = {};
      questions.forEach(question => {
        if (answers[question.id]) {
          qa[question.text] = answers[question.id];
        }
      });
      
      // Create payload according to the required schema
      const payload = {
        "name": answers.projectName || "",
        "description": answers.description || "",
        "qa": qa,
        "is_private": true
      };
      // Log the payload to be sent
      console.log('Sending payload:', payload);
      // Send the data to your backend
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(payload),
        });
        if (response.status == 401) {
          console.error('Unauthorized');
          // login the user or set this token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODIxOTVlZmY4YWQxNWMxODdlNDcwODEiLCJleHAiOjE3NDc5ODczNDB9.-GGHvhGm1_PZ0lOfLQXNFA001ndGDfcjsVLYnhysW5w
          // const token = localStorage.getItem('access_token');
          // localStorage.setItem('Token', `${token}`);
        }
        // Expecting response to contain project id
        const data = await response.json();
        if (data && data.id) {
          router.push(`/projects/${data.project_id}/build-events-sse?id=${data.project_id}`);
          return;
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = Math.round(((currentStep + 1) / questions.length) * 100);

  return (
    <div className="w-full">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-lg font-medium mb-4">
            {currentQuestion.text}
          </Label>
          
          {currentQuestion.type === 'text' && (
            <Input
              className="mt-2"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
          )}

          {currentQuestion.type === 'select' && (
            <Select
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentQuestion.type === 'textarea' && (
            <Textarea
              className="mt-2"
              rows={4}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
          >
            {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
} 