import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { setWebMcpNavigate } from '~/_utils/webmcp.client';

/**
 * Upgrades the WebMCP tools from full page loads to client-side navigation
 * once the app has hydrated.
 */
export function useWebMcpNavigate() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    setWebMcpNavigate((to) => navigateRef.current(to));
  }, []);
}
