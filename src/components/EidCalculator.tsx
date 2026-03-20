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

  useEffect(() => {
    setMounted(true);
    try {
      const savedTotal = localStorage.getItem('eid_total');
      const savedHistory = localStorage.getItem('eid_history');
      if (savedTotal) setTotal(parseFloat(savedTotal) || 0);
      if (savedHistory) setHistory(JSON.parse(savedHistory) || []);
    } catch (e) {}
  }, []);

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
    <div className="max-w-md mx-auto px-4 flex flex-col font-body" style={{ height: '100dvh', maxHeight: '100dvh', overflow: 'hidden' }}>
      {/* Marquee banner */}
      <div className="bg-accent retro-border retro-shadow p-1.5 overflow-hidden rotate-[-1deg] mt-2 flex-shrink-0">
        <div className="animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-tighter">
          EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK • EID MUBARAK •
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mt-2 flex-shrink-0">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter italic leading-none">
          Eid<br /><span className="text-primary retro-shadow-sm" style={{ WebkitTextStroke: '2px black' }}>Count</span>
        </h1>
        <div className="bg-secondary retro-border retro-shadow p-2 rotate-[5deg] flex items-center justify-center min-w-[3rem] h-12">
          <span className="text-white font-black text-2xl select-none" style={{ WebkitTextStroke: '1px black' }}>د.إ</span>
        </div>
      </div>

      {/* Total Card */}
      <Card className="bg-primary retro-border retro-shadow mt-3 flex-shrink-0">
        <CardContent className="py-4 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 opacity-10">
            <Coins className="h-16 w-16 rotate-12" />
          </div>
          <p className="text-xs uppercase tracking-widest font-black mb-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" /> My Total Eideya <Sparkles className="h-3 w-3" />
          </p>
          <div className="text-5xl font-black flex items-center justify-center gap-1 font-mono tracking-tighter">
            <span className="text-lg mt-2">AED</span>
            <span>{total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add */}
      <div className="mt-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-black uppercase flex items-center gap-1">
            <Plus className="h-4 w-4 stroke-[3px]" /> Quick Add
          </h2>
          <Button 
            onClick={() => handleSubtractAmount(5)}
            variant="outline"
            className="h-8 px-3 bg-destructive text-white rounded-none retro-border retro-shadow-sm retro-shadow-active font-black text-sm"
          >
            <Minus className="h-3 w-3 mr-1 stroke-[3px]" /> 5
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleAddAmount(amount)}
              variant="outline"
              className="h-14 text-xl font-black rounded-none retro-border retro-shadow retro-shadow-active transition-all bg-white hover:bg-white active:bg-white"
            >
              {amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const val = parseFloat(customAmount);
        if (!isNaN(val) && val > 0) {
          handleAddAmount(val);
          setCustomAmount('');
        }
      }} className="mt-3 flex-shrink-0">
        <h2 className="text-base font-black uppercase flex items-center gap-1 mb-2">
          <Banknote className="h-4 w-4 stroke-[3px]" /> Custom Eideya
        </h2>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="0.00"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="h-11 text-lg font-bold rounded-none border-2 border-black focus-visible:ring-primary retro-shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={!customAmount}
            className="h-11 px-6 bg-secondary text-white hover:bg-secondary/90 rounded-none font-black text-base retro-border retro-shadow retro-shadow-active"
          >
            ADD
          </Button>
        </div>
      </form>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Bottom actions */}
      <div className="flex items-center justify-between pb-4 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={handleUndo}
          disabled={history.length === 0}
          className="font-bold underline decoration-4 decoration-primary underline-offset-4 hover:bg-transparent text-sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> UNDO LAST
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              disabled={total === 0}
              className="text-destructive font-black uppercase hover:bg-transparent text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" /> RESET
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
