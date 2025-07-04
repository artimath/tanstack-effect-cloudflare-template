import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentOverlayLoader, InlineLoader, OverlayLoader } from "@/components/ui/overlay-loader";

export function LoaderExamples() {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const [inlineLoading, setInlineLoading] = useState(false);

  const simulateLoading = (type: "global" | "component" | "inline") => {
    switch (type) {
      case "global":
        setGlobalLoading(true);
        setTimeout(() => setGlobalLoading(false), 3000);
        break;
      case "component":
        setComponentLoading(true);
        setTimeout(() => setComponentLoading(false), 2000);
        break;
      case "inline":
        setInlineLoading(true);
        setTimeout(() => setInlineLoading(false), 1500);
        break;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Overlay Loader Examples</h1>
        <p className="text-muted-foreground">Different types of loading states for various use cases.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Global Overlay Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Global Overlay Loader</CardTitle>
            <CardDescription>Full-screen overlay for page-level loading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => simulateLoading("global")} disabled={globalLoading}>
              Show Global Loader
            </Button>
            <div className="text-sm text-muted-foreground">
              Covers the entire viewport with different backdrop options:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Light backdrop</li>
                <li>Dark backdrop</li>
                <li>Blur backdrop</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Component Overlay Loader */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Component Overlay</CardTitle>
            <CardDescription>Overlays specific components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => simulateLoading("component")} disabled={componentLoading}>
              Show Component Loader
            </Button>
            <div className="text-sm text-muted-foreground">
              Perfect for:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Card loading states</li>
                <li>Form submissions</li>
                <li>Data table updates</li>
              </ul>
            </div>
          </CardContent>

          <ComponentOverlayLoader isLoading={componentLoading} message="Loading component..." size="sm" />
        </Card>

        {/* Inline Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Loader</CardTitle>
            <CardDescription>Small loaders for inline content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => simulateLoading("inline")} disabled={inlineLoading}>
              Show Inline Loader
            </Button>

            <div className="space-y-2">
              <InlineLoader isLoading={inlineLoading} message="Processing..." />

              <div className="text-sm text-muted-foreground">
                Great for:
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Button loading states</li>
                  <li>Small content areas</li>
                  <li>Status indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>Code examples for different loader types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Global Overlay Loader</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`<OverlayLoader 
  isLoading={isLoading} 
  message="Loading application..." 
  size="lg"
  backdrop="blur"
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Component Overlay Loader</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`<div className="relative">
  {/* Your component content */}
  <ComponentOverlayLoader 
    isLoading={isLoading} 
    message="Loading data..." 
    size="md"
  />
</div>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Inline Loader</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`<InlineLoader 
  isLoading={isLoading} 
  message="Saving..." 
  size="sm"
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Overlay Loader */}
      <OverlayLoader isLoading={globalLoading} message="Loading application..." size="lg" backdrop="blur" />
    </div>
  );
}
