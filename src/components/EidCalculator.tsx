"use client"

import React, { useState, useEffect } from 'react';
import { Banknote, Plus, RotateCcw, Trash2, Sparkles, Coins, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 500];

export default function EidCalculator() {
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedTotal = localStorage.getItem('eid_total');
      const savedHistory = localStorage.getItem('eid_history');
      if (savedTotal) setTotal(parseFloat(savedTotal) || 0);
      if (savedHistory) setHistory(JSON.parse(savedHistory) || []);
    } catch (e) {
      // Fail silently for storage errors
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('eid_total', total.toString());
    localStorage.setItem('eid_history', JSON.stringify(history));
  }, [total, history, mounted]);

  const handleAddAmount = (amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    setTotal(prev => prev + amount);
    setHistory(prev => [...prev, amount]);
  };

  const handleSubtractAmount = (amount: number) => {
    setTotal(prev => Math.max(0, prev - amount));
    setHistory(prev => [...prev, -amount]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastAmount = history[history.length - 1];
    setTotal(prev => Math.max(0, prev - lastAmount));
    setHistory(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    setTotal(0);
    setHistory([]);
    setCustomAmount('');
    localStorage.removeItem('eid_total');
    localStorage.removeItem('eid_history');
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="max-w-md mx-auto px-6 pt-2 pb-20 space-y-8 font-body">
      <header className="space-y-4">
        <div className="bg-accent retro-border retro-shadow p-2 overflow-hidden rotate-[-1deg]">
          <div className="animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-tighter">
            EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK •
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter italic">
            Eid<br /><span className="text-primary retro-shadow-sm" style={{ WebkitTextStroke: '2px black' }}>Count</span>
          </h1>
          <div className="bg-secondary retro-border retro-shadow p-3 rotate-[5deg] flex items-center justify-center min-w-[3.5rem] h-14">
            <span className="text-white font-black text-3xl select-none" style={{ WebkitTextStroke: '1px black' }}>د.إ</span>
          </div>
        </div>
      </header>

      <Card className="bg-primary retro-border retro-shadow transform transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]">
        <CardContent className="pt-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Coins className="h-24 w-24 rotate-12" />
          </div>
          <p className="text-sm uppercase tracking-widest font-black mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" /> My Total Eideya <Sparkles className="h-4 w-4" />
          </p>
          <div className="text-7xl font-black flex items-center justify-center gap-1 font-mono tracking-tighter">
            <span className="text-2xl mt-4">AED</span>
            <span>{total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase flex items-center gap-2">
            <Plus className="h-6 w-6 stroke-[3px]" /> Quick Add
          </h2>
          <Button 
            onClick={() => handleSubtractAmount(5)}
            variant="outline"
            className="h-10 px-4 bg-destructive text-white rounded-none retro-border retro-shadow-sm retro-shadow-active font-black"
          >
            <Minus className="h-4 w-4 mr-1 stroke-[3px]" /> 5
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleAddAmount(amount)}
              variant="outline"
              className="h-20 text-2xl font-black rounded-none retro-border retro-shadow retro-shadow-active transition-all bg-white hover:bg-white active:bg-white"
            >
              {amount}
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        const val = parseFloat(customAmount);
        if (!isNaN(val) && val > 0) {
          handleAddAmount(val);
          setCustomAmount('');
        }
      }} className="space-y-4">
        <h2 className="text-xl font-black uppercase flex items-center gap-2">
          <Banknote className="h-6 w-6 stroke-[3px]" /> Custom Eideya
        </h2>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="0.00"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="h-14 text-xl font-bold rounded-none border-2 border-black focus-visible:ring-primary retro-shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={!customAmount}
            className="h-14 px-8 bg-secondary text-white hover:bg-secondary/90 rounded-none font-black text-lg retro-border retro-shadow retro-shadow-active"
          >
            ADD
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between pt-6">
        <Button
          variant="ghost"
          onClick={handleUndo}
          disabled={history.length === 0}
          className="font-bold underline decoration-4 decoration-primary underline-offset-4 hover:bg-transparent"
        >
          <RotateCcw className="h-5 w-5 mr-2" /> UNDO LAST
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              disabled={total === 0}
              className="text-destructive font-black uppercase hover:bg-transparent"
            >
              <Trash2 className="h-5 w-5 mr-2" /> RESET
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-4 border-black retro-shadow bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black uppercase">Start over?</AlertDialogTitle>
              <AlertDialogDescription className="text-foreground font-bold">
                This will clear your total and history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="rounded-none border-2 border-black font-bold">CANCEL</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive text-white rounded-none border-2 border-black font-black retro-shadow-sm">RESET ALL</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
