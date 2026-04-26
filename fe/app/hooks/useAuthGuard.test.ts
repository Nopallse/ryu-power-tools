// Test file to debug auth storage
// Run this in the browser console to see what's stored

export function testAuthStorage() {
  const raw = window.localStorage.getItem('ryu-auth');
  console.log('Raw localStorage ryu-auth:', raw);
  
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      console.log('Parsed auth:', parsed);
      console.log('Token value:', parsed.token);
      console.log('Token is truthy:', !!parsed.token);
      console.log('Token length:', parsed.token?.length);
    } catch (e) {
      console.error('Failed to parse:', e);
    }
  } else {
    console.log('No ryu-auth found in localStorage');
    console.log('All localStorage keys:', Object.keys(window.localStorage));
  }
}

// Expose to window for manual testing
if (typeof window !== 'undefined') {
  (window as any).testAuthStorage = testAuthStorage;
}
