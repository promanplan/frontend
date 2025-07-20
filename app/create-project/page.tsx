'use client';

import Questionnaire from '@/components/Questionnaire';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Create New Project</CardTitle>
          <CardDescription className="text-center">Fill out the questionnaire to set up your new project</CardDescription>
        </CardHeader>
        <CardContent>
          <Questionnaire />
        </CardContent>
      </Card>
    </div>
  );
} 