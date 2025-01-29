"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react'
import { useUserRole } from '@/hooks/useUserRole';

const InterviewerDashboard = () => {
  
  const { isLoading, isCandidate } = useUserRole();
  
  if( isCandidate || isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <Link href="/dashboard">
        <Button>Dashboard Button Here</Button>
      </Link>
    </div>
  );
};

export default InterviewerDashboard