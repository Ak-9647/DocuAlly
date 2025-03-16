export const metadata = {
  title: 'System Status | Docually',
  description: 'Check the current status of Docually services',
};

export default function StatusPage() {
  // In a real implementation, this would fetch actual status data from a monitoring service
  const services = [
    { name: 'Web Application', status: 'operational', uptime: '99.99%' },
    { name: 'API', status: 'operational', uptime: '99.95%' },
    { name: 'Document Storage', status: 'operational', uptime: '99.99%' },
    { name: 'Email Service', status: 'operational', uptime: '99.90%' },
    { name: 'Authentication Service', status: 'operational', uptime: '99.99%' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">System Status</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <p className="text-green-800 font-medium">All systems operational</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700">Operational</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
        <p className="text-gray-500 italic">No incidents reported in the last 30 days.</p>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p>This page refreshes automatically every 5 minutes.</p>
      </div>
    </div>
  );
} 