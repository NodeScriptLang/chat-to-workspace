'use client'; // This directive ensures the component runs on the client side in Next.js

import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import { useAppendMessage } from "@assistant-ui/react";

// Import all components from the `/components/ui` directory
import * as Components from '@/components/ui';

// Define a type for the props that the DynamicComponentLoader will accept
interface DynamicComponentLoaderProps {
  sourceCode: string;
}

// Adjust the type of shadCNComponents to accommodate different component types
// const shadCNComponents: Record<string, React.ComponentType<any> | React.ForwardRefExoticComponent<any> | React.FC<any>> = { ...Components.Components };
const shadCNComponents: any = { ...Components.Components };

const DynamicComponentLoader: React.FC<DynamicComponentLoaderProps> = ({ sourceCode }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const append = useAppendMessage();

  useEffect(() => {
    try {
      // Transpile the JSX code to JavaScript using Babel
      const transpiledCode = Babel.transform(sourceCode, {
        presets: ['react', 'es2015'],
      }).code;

      // Create a new component from the transpiled code
      const ComponentFactory = new Function(
        'React',
        'shadCNComponents',
        'append',
        `"use strict"; ${transpiledCode}; return MyComponent;`
      )(React, shadCNComponents, append) as React.ComponentType<any>;

      // console.log({ ComponentFactory, sourceCode, transpiledCode });

      setComponent(() => ComponentFactory);
    } catch (error) {
      console.error('Error loading dynamic component:', error);
    }
  }, [sourceCode]);

  return Component ? <Component /> : <div>Loading...</div>;
};

export default DynamicComponentLoader;
