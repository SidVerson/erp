'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from 'react';

export default function AccessDenied(): React.ReactElement {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Доступ запрещен</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            У вас нет прав для доступа к этой странице.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 