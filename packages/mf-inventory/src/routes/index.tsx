import { createRoute } from '@tanstack/react-router';
import { Button, Alert } from 'siesa-ui-kit';
import { rootRoute } from './__root';
import React from 'react';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Alert
        title="Module Loaded"
        description="The Inventory module has been successfully mounted via Single-SPA."
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
         <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
         <div className="flex gap-4">
           {/* Note: Button types from siesa-ui-kit might vary, using what was in App.tsx */}
           <Button type="default" size="base" onClick={() => console.log('Create')}>
             New Item
           </Button>
           <Button type="outline-solid" size="base">
             View Reports
           </Button>
         </div>
      </div>
    </div>
  );
}
